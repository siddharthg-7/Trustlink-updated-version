

import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiResponse } from '../types';

const useMock = !import.meta.env.VITE_GEMINI_API_KEY;
let ai: any = null;
if (!useMock) {
  ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
} else {
  // Graceful fallback for local development when API key is not provided.
  // This prevents the app from throwing and allows the UI to function
  // with a deterministic mock response that resembles the Gemini output.
  console.warn('VITE_GEMINI_API_KEY not set — using local mock Gemini service.');
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      description: "Classify the content as one of: PROMOTION, INTERNSHIP, SCAM, UNKNOWN.",
      enum: ['PROMOTION', 'INTERNSHIP', 'SCAM', 'UNKNOWN'],
    },
    riskScore: {
      type: Type.NUMBER,
      description: "A score from 0 (Safe) to 100 (High Risk) based on the analysis.",
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 indicating the confidence in the analysis provided."
    },
    analysis: {
      type: Type.STRING,
      description: "A brief, one or two sentence explanation for the classification and risk score. Mention specific red flags if any are found.",
    },
    redFlags: {
      type: Type.ARRAY,
      description: "A list of 2-5 specific red flags detected (e.g., 'Asks for money', 'Unrealistic claims', 'Suspicious URL', 'Urgency Language', 'Too Good To Be True Promises'). Otherwise, an empty array.",
      items: {
        type: Type.STRING,
      },
    },
     recommendation: {
        type: Type.STRING,
        description: "A final, clear recommendation from the following options: 'Safe to apply', 'Needs manual verification', 'Likely scam — stay away', 'Confirmed scam — avoid'.",
    },
    linkAnalysis: {
        type: Type.OBJECT,
        description: "Analysis of any URL found in the content. If no URL, provide default 'Unknown' values.",
        properties: {
            domainAge: { type: Type.STRING, description: "Estimated age of the domain (e.g., 'New', 'Established', 'Unknown')." },
            sslStatus: { type: Type.STRING, description: "Status of SSL certificate ('Secure', 'Not Secure', 'Unknown')." },
            redirects: { type: Type.INTEGER, description: "Number of redirects detected (0 if none or unknown)." },
            malwareScan: { type: Type.STRING, description: "Result of a conceptual malware scan ('Clean', 'Infected', 'Unknown')." },
        }
    },
    keywordHighlights: {
        type: Type.ARRAY,
        description: "A list of suspicious phrases or keywords found in the text that should be highlighted for the user.",
        items: { type: Type.STRING }
    },
    similarScamsCount: {
        type: Type.NUMBER,
        description: "An estimated count of how many similar scams have been reported based on patterns in the content."
    }
  },
  required: ['category', 'riskScore', 'confidenceScore', 'analysis', 'redFlags', 'recommendation', 'linkAnalysis', 'keywordHighlights', 'similarScamsCount'],
};

const systemInstruction = `Act as TRUST LINK AI. You are a security analyst specializing in identifying fraudulent online content for students. You must analyze all user inputs (links, text, and images of text/links like screenshots) and classify them as Promotion, Internship, Scam, or Unknown. If an image is provided, perform OCR to extract any text and analyze that text. Be strict about scams. Highlight every possible risk. If the information is insufficient, clearly say so and classify as UNKNOWN. Never create fake company names or fake verification.
- Provide a risk score from 0-100 and a confidence score for your analysis.
- Identify specific red flags (e.g., "Registration Fee Mentioned", "Fake HR Name", "Urgency Language").
- If a link is present (in text or image), analyze it: estimate its domain age, SSL status, redirect chains, and malware risk. If no link, use 'Unknown' or 0.
- Extract suspicious keywords/phrases for highlighting.
- Estimate the number of similar scams seen before based on content patterns.
- Always provide a structured output in the required JSON format.`;


export const analyzeContent = async (content: string, image?: { mimeType: string; data: string }): Promise<GeminiResponse> => {
  try {
    if (useMock) {
      // Simple heuristic mock analysis for local development.
      const lower = content.toLowerCase();
      const isScam = /scam|fee|pay|urgent|wire|transfer|bank account|verify now/.test(lower);
      const isIntern = /intern|internship|graduate|entry-level/.test(lower);
      const isPromo = /promo|promotion|discount|offer|apply now/.test(lower);
      let category: any = 'UNKNOWN';
      if (isScam) category = 'SCAM';
      else if (isIntern) category = 'INTERNSHIP';
      else if (isPromo) category = 'PROMOTION';

      const redFlags = [] as string[];
      if (isScam) redFlags.push('Requests payment or bank details', 'Urgency language');
      if (/free|too good to be true/.test(lower)) redFlags.push('Unrealistic promises');

      const mock: GeminiResponse = {
        category,
        riskScore: isScam ? 85 : (isIntern || isPromo ? 25 : 10),
        confidenceScore: isScam ? 90 : 70,
        analysis: isScam ? 'Content shows multiple scam indicators such as requests for payment and urgency.' : 'No clear scam indicators found in the provided text.',
        redFlags: redFlags.slice(0, 5),
        recommendation: isScam ? 'Likely scam — stay away' : (isIntern ? 'Safe to apply' : 'Needs manual verification'),
        linkAnalysis: {
          domainAge: 'Unknown',
          sslStatus: 'Unknown',
          redirects: 0,
          malwareScan: 'Unknown',
        },
        keywordHighlights: (content.match(/\b(urgent|apply now|fee|bank|verify now|free|discount)\b/gi) || []).slice(0,5),
        similarScamsCount: isScam ? 3 : 0,
      };
      return mock;
    }

    const prompt = `Analyze the following content based on your instructions and provide a structured JSON response. If there is only an image, analyze the image. If there is text and an image, consider them together. Text: "${content}"`;

    const parts: any[] = [{ text: prompt }];

    if (image) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);

    if (
        typeof parsedResponse.category === 'string' &&
        ['PROMOTION', 'INTERNSHIP', 'SCAM', 'UNKNOWN'].includes(parsedResponse.category) &&
        typeof parsedResponse.riskScore === 'number' &&
        typeof parsedResponse.analysis === 'string' &&
        typeof parsedResponse.recommendation === 'string' &&
        Array.isArray(parsedResponse.redFlags)
    ) {
        return parsedResponse as GeminiResponse;
    } else {
        console.error("Gemini response did not match expected schema:", parsedResponse);
        throw new Error("Received an invalid response format from the AI.");
    }

  } catch (error) {
    console.error("Error analyzing content with Gemini:", error);
    throw new Error("Failed to communicate with the AI service.");
  }
};
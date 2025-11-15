import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    analysis: {
      type: Type.STRING,
      description: "A brief, one or two sentence explanation for the classification and risk score. Mention specific red flags if any are found.",
    },
    redFlags: {
      type: Type.ARRAY,
      description: "A list of 2-5 specific red flags detected (e.g., 'Asks for money', 'Unrealistic claims', 'Suspicious URL'). Otherwise, an empty array.",
      items: {
        type: Type.STRING,
      },
    },
     recommendation: {
        type: Type.STRING,
        description: "A final, clear recommendation from the following options: 'Safe to apply', 'Needs manual verification', 'Likely scam — stay away', 'Confirmed scam — avoid'.",
    }
  },
  required: ['category', 'riskScore', 'analysis', 'redFlags', 'recommendation'],
};

const systemInstruction = `Act as TRUST LINK AI. You are a security analyst specializing in identifying fraudulent online content for students. You must analyze all user inputs (links, text, screenshots, PDFs, job descriptions) and classify them as Promotion, Internship, Scam, or Unknown. Be strict about scams. Highlight every possible risk. If the information is insufficient, clearly say so and classify as UNKNOWN. Never create fake company names or fake verification.
Grounding Rules:
- Never confirm authenticity unless clear evidence exists.
- Always caution users if information is incomplete.
- If the message asks for money, immediately increase risk score and flag it.
- If a domain is suspicious, shortened, or doesn't match a known company, treat it with high caution.
- If an offer is “guaranteed,” “quick,” or has “no interview,” flag it as suspicious.
- Never generate overly optimistic responses for unclear messages.
- Always provide a structured output in the required JSON format.`;


export const analyzeContent = async (content: string): Promise<GeminiResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following content based on your instructions and provide a structured JSON response. Content: "${content}"`,
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
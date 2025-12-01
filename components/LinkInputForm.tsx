
import React, { useState, useEffect } from 'react';
import type { LinkReport } from '../types';
import { analyzeContent } from '../services/geminiService';
import { ScanIcon, SparklesIcon, ImageIcon, XIcon, AlertTriangleIcon } from './icons';

interface LinkInputFormProps {
  onNewReport: (report: LinkReport) => void;
}

const LinkInputForm: React.FC<LinkInputFormProps> = ({ onNewReport }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preCheckWarning, setPreCheckWarning] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    return () => {
        if (image) {
            URL.revokeObjectURL(image.preview);
        }
    };
  }, [image]);

  useEffect(() => {
    const text = content.toLowerCase();
    const ipRegex = /((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}/;
    const suspiciousTLDs = ['.xyz', '.top', '.gq', '.tk', '.ml', '.cf'];
    const manyHyphens = (text.match(/-/g) || []).length > 3;

    if (ipRegex.test(text)) {
        setPreCheckWarning("Caution: Raw IP address detected.");
    } else if (suspiciousTLDs.some(tld => text.includes(tld))) {
        setPreCheckWarning("Caution: Suspicious top-level domain.");
    } else if (manyHyphens && text.includes('http')) {
        setPreCheckWarning("Caution: Excessive hyphens detected.");
    } else {
        setPreCheckWarning(null);
    }
  }, [content]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { 
        setError('Image file is too large (max 4MB).');
        return;
      }
      const preview = URL.createObjectURL(file);
      setImage({ file, preview });
      setError(null);
    }
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!content.trim() && !image) || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      let imageUrl: string | undefined = undefined;
      let imagePayload: { mimeType: string; data: string } | undefined = undefined;

      if (image) {
          imageUrl = await fileToDataUrl(image.file);
          imagePayload = {
              mimeType: image.file.type,
              data: imageUrl.split(',')[1],
          };
      }

      const result = await analyzeContent(content, imagePayload);
      const newReport: LinkReport = {
        id: new Date().toISOString(),
        content,
        ...result,
        timestamp: new Date().toISOString(),
        comments: [],
        imageUrl: imageUrl,
      };
      
      // Success Animation Trigger
      setIsSuccess(true);
      setTimeout(() => {
          onNewReport(newReport);
          setContent('');
          setImage(null);
          setPreCheckWarning(null);
          setIsSuccess(false);
      }, 1000);

    } catch (err) {
      setError('Failed to analyze the content. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 relative z-20">
        <div className={`relative bg-white/40 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8 border border-white/20 dark:border-white/10 transition-all duration-500 ${isLoading ? 'scale-[0.98] opacity-90' : 'scale-100'} ${isSuccess ? 'translate-y-[-20px] opacity-0' : ''}`}>
        
        {/* Glow Effect behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-3xl blur opacity-20 dark:opacity-40 -z-10 animate-pulse-glow"></div>

        <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                <SparklesIcon className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">AI Scam Detector</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">Paste a link or upload a screenshot for instant verification.</p>
            </div>
        </div>
        
        <form onSubmit={handleSubmit}>
            <div className="relative group">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Example: 'You won a prize! Click here: http://bit.ly/fake...'"
                    className="w-full h-36 p-5 pr-12 text-slate-700 dark:text-slate-100 bg-white/50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-600/50 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 resize-none placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-sm"
                    disabled={isLoading}
                />
            </div>
            
            {preCheckWarning && (
                <div className="mt-3 flex items-start gap-3 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/40 p-3 rounded-xl border border-amber-200 dark:border-amber-700/50 animate-fade-in">
                    <AlertTriangleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>{preCheckWarning}</p>
                </div>
            )}
            
            <div className="mt-5 flex items-center justify-between">
                {image ? (
                    <div className="relative group inline-block">
                        <img src={image.preview} alt="Preview" className="h-20 w-auto object-cover rounded-xl border-2 border-white/50 shadow-md" />
                        <button
                            type="button"
                            onClick={() => setImage(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-transform hover:scale-110"
                        >
                            <XIcon className="h-3 w-3" />
                        </button>
                    </div>
                ) : (
                    <label htmlFor="image-upload" className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-dashed border-slate-300 dark:border-slate-500 rounded-xl cursor-pointer transition-all duration-300 group">
                        <ImageIcon className="h-5 w-5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-500" />
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-indigo-500">
                            Upload Proof
                        </span>
                        <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
                    </label>
                )}

                <button
                    type="submit"
                    disabled={isLoading || (!content.trim() && !image)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                >
                    {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                    </>
                    ) : (
                    <>
                        <ScanIcon className="w-5 h-5" />
                        Verify Now
                    </>
                    )}
                </button>
            </div>

            {error && <p className="text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-sm mt-4 text-center">{error}</p>}
        </form>
        </div>
        
        {/* Success Overlay Animation */}
        {isSuccess && (
             <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                 <div className="bg-emerald-500 text-white px-6 py-4 rounded-full shadow-2xl animate-fade-in-down flex items-center gap-3">
                     <SparklesIcon className="w-6 h-6 animate-spin" />
                     <span className="font-bold text-lg">Report Submitted!</span>
                 </div>
             </div>
        )}
    </div>
  );
};

export default LinkInputForm;

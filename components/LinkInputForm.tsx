
import React, { useState } from 'react';
import type { LinkReport } from '../types';
import { analyzeContent } from '../services/geminiService';
import { ScanIcon, SparklesIcon } from './icons';

interface LinkInputFormProps {
  onNewReport: (report: LinkReport) => void;
}

const LinkInputForm: React.FC<LinkInputFormProps> = ({ onNewReport }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeContent(content);
      const newReport: LinkReport = {
        id: new Date().toISOString(),
        content,
        ...result,
        timestamp: new Date().toISOString(),
      };
      onNewReport(newReport);
      setContent('');
    } catch (err) {
      setError('Failed to analyze the content. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-0">
        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg p-6 w-full border border-transparent dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-full">
                <SparklesIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Submit a Message</h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
            Got a suspicious internship or placement opportunity? Let us verify it for you!
        </p>
        <form onSubmit={handleSubmit}>
            <div className="relative">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste a suspicious link, email, or message here..."
                className="w-full h-28 p-4 pr-12 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
                disabled={isLoading}
            />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
                type="submit"
                disabled={isLoading || !content.trim()}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg disabled:shadow-none"
            >
                {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                </>
                ) : (
                <>
                    <ScanIcon />
                    Verify Now
                </>
                )}
            </button>
        </form>
        </div>
    </div>
  );
};

export default LinkInputForm;

import React from 'react';
import type { LinkReport } from '../types';
import { CATEGORIES } from '../constants';
import { FlagIcon, ThumbDownIcon, ThumbUpIcon, TimeIcon, CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon } from './icons';

interface ResultsDisplayProps {
  report: LinkReport;
}

const RecommendationBanner: React.FC<{ recommendation: string }> = ({ recommendation }) => {
    const lowerCaseRec = recommendation.toLowerCase();
    let bgColor = 'bg-slate-100 dark:bg-slate-700';
    let textColor = 'text-slate-800 dark:text-slate-200';
    let Icon = QuestionMarkCircleIcon;

    if (lowerCaseRec.includes('safe')) {
        bgColor = 'bg-green-100 dark:bg-green-900/50';
        textColor = 'text-green-800 dark:text-green-300';
        Icon = CheckCircleIcon;
    } else if (lowerCaseRec.includes('scam') || lowerCaseRec.includes('avoid')) {
        bgColor = 'bg-red-100 dark:bg-red-900/50';
        textColor = 'text-red-800 dark:text-red-300';
        Icon = XCircleIcon;
    } else if (lowerCaseRec.includes('review') || lowerCaseRec.includes('verification')) {
        bgColor = 'bg-amber-100 dark:bg-amber-900/50';
        textColor = 'text-amber-800 dark:text-amber-300';
        Icon = QuestionMarkCircleIcon;
    }

    return (
        <div className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${bgColor} ${textColor}`}>
            <Icon className="h-6 w-6 flex-shrink-0" />
            <p className="text-sm font-semibold">{recommendation}</p>
        </div>
    )
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ report }) => {
  const categoryInfo = CATEGORIES.find(c => c.id === report.category);

  if (!categoryInfo) return null;

  const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 5) return "just now";
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };
  
  const riskColor = report.riskScore > 75 ? 'text-red-500' : report.riskScore > 40 ? 'text-amber-400' : 'text-green-500';

  return (
    <div className={`bg-white dark:bg-slate-800/50 rounded-lg shadow-md border-l-4 ${categoryInfo.borderColor} ${categoryInfo.darkBorderColor} overflow-hidden border border-transparent dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      <div className="p-5">
        <div className="flex justify-between items-start">
            <div>
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${categoryInfo.bgColor} ${categoryInfo.textColor} ${categoryInfo.darkBgColor} ${categoryInfo.darkTextColor}`}>
                {categoryInfo.name}
                </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                <TimeIcon />
                <span>{timeAgo(report.timestamp)}</span>
            </div>
        </div>
        
        <p className="mt-4 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/70 p-3 rounded-md border border-slate-200 dark:border-slate-700 break-words">
          {report.content}
        </p>
        
        <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-700 dark:text-slate-200">AI Analysis</h4>
            <div className="flex items-baseline mt-2">
                <p className={`text-3xl font-bold ${riskColor}`}>{report.riskScore}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">/ 100 Risk Score</p>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{report.analysis}</p>

            {report.redFlags && report.redFlags.length > 0 && (
                <div className="mt-3">
                    <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Red Flags</h5>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {report.redFlags.map(flag => (
                            <span key={flag} className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 text-xs font-medium px-2.5 py-1 rounded-full">{flag}</span>
                        ))}
                    </div>
                </div>
            )}
            <RecommendationBanner recommendation={report.recommendation} />
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">Is this analysis helpful?</p>
            <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-500/10 text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"><ThumbUpIcon /></button>
                <button className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-500/10 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"><ThumbDownIcon /></button>
                <button className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-amber-500/10 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"><FlagIcon /></button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
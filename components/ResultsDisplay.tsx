import React, { useState } from 'react';
import type { LinkReport, User } from '../types';
import { CATEGORIES } from '../constants';
import { FlagIcon, ThumbDownIcon, ThumbUpIcon, TimeIcon, CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon, ChevronDownIcon, ServerIcon, AlertTriangleIcon, LinkIcon, HistoryIcon, ShieldCheckIcon, MessageSquareIcon } from './icons';

interface ResultsDisplayProps {
  report: LinkReport;
  currentUser: User | null;
  onAddComment: (reportId: string, content: string) => void;
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

const RiskScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const getRiskColor = (s: number) => s > 60 ? '#ef4444' : s > 30 ? '#f59e0b' : '#22c55e';
    const color = getRiskColor(score);
    const circumference = 2 * Math.PI * 40; // radius = 40
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center h-32 w-32 flex-shrink-0">
            <svg className="absolute" width="120" height="120" viewBox="0 0 100 100">
                <circle
                    className="text-slate-200 dark:text-slate-700"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                />
                <circle
                    stroke={color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                        transition: 'stroke-dashoffset 0.5s ease-out',
                    }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold" style={{ color }}>{score}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ 100</span>
            </div>
        </div>
    );
};

const HighlightedContent: React.FC<{ text: string; highlights?: string[] }> = ({ text, highlights }) => {
    if (!highlights || highlights.length === 0) {
        return <>{text}</>;
    }
    // Escape special characters for regex
    const escapedHighlights = highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedHighlights.join('|')})`, 'gi');
    const parts = text.split(regex);
    
    return (
        <span>
            {parts.map((part, i) =>
                highlights.some(h => h.toLowerCase() === part.toLowerCase()) ? (
                    <mark key={i} className="bg-amber-300 dark:bg-amber-500/50 rounded px-1">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
};


const AnalysisDetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; colorClass?: string }> = ({ icon, label, value, colorClass = 'text-slate-600 dark:text-slate-300' }) => (
    <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
        <div className="text-slate-400 dark:text-slate-500">{icon}</div>
        <div className="flex-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
            <div className={`text-sm font-semibold ${colorClass}`}>{value}</div>
        </div>
    </div>
);


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ report, currentUser, onAddComment }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const categoryInfo = CATEGORIES.find(c => c.id === report.category);

  if (!categoryInfo) return null;
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser) return;
    onAddComment(report.id, comment);
    setComment('');
  };

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
  
    const getLinkStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'secure':
            case 'clean':
                return 'text-green-500';
            case 'not secure':
            case 'infected':
                return 'text-red-500';
            default:
                return 'text-amber-500';
        }
    };

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
          <HighlightedContent text={report.content} highlights={report.keywordHighlights} />
        </p>
        
        <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-700 dark:text-slate-200">AI Analysis</h4>
                {report.confidenceScore && (
                    <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{width: `${report.confidenceScore}%`}}></div>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{report.confidenceScore}% Confidence</span>
                    </div>
                )}
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 mt-2">
                <RiskScoreGauge score={report.riskScore} />
                <div className="flex-1 text-center md:text-left">
                    <p className="text-sm text-slate-600 dark:text-slate-300">{report.analysis}</p>
                    <RecommendationBanner recommendation={report.recommendation} />
                </div>
            </div>
            
            <div className="mt-4">
                <button
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    className="w-full flex justify-between items-center p-2 rounded-md text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                    <span>{isDetailsOpen ? 'Hide' : 'Show'} Detailed Report</span>
                    <ChevronDownIcon className={`transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDetailsOpen && (
                    <div className="mt-3 space-y-4 animate-fade-in">
                        {report.redFlags && report.redFlags.length > 0 && (
                            <div>
                                <h5 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Scam Indicators</h5>
                                <div className="flex flex-wrap gap-2">
                                    {report.redFlags.map(flag => (
                                        <span key={flag} className="flex items-center gap-1.5 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 text-xs font-medium px-2.5 py-1 rounded-full">
                                            <FlagIcon className="h-3 w-3" /> {flag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {report.linkAnalysis && (
                            <div>
                                <h5 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Link Safety Check</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <AnalysisDetailItem icon={<ServerIcon />} label="Domain Age" value={report.linkAnalysis.domainAge} />
                                    <AnalysisDetailItem icon={<ShieldCheckIcon />} label="SSL Certificate" value={report.linkAnalysis.sslStatus} colorClass={getLinkStatusColor(report.linkAnalysis.sslStatus)} />
                                    <AnalysisDetailItem icon={<LinkIcon />} label="Redirect Chains" value={`${report.linkAnalysis.redirects} hops`} />
                                    <AnalysisDetailItem icon={<AlertTriangleIcon />} label="Malware Scan" value={report.linkAnalysis.malwareScan} colorClass={getLinkStatusColor(report.linkAnalysis.malwareScan)} />
                                </div>
                            </div>
                        )}
                        
                        {report.similarScamsCount !== undefined && report.similarScamsCount > 0 && (
                            <div>
                                <h5 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Pattern Matching</h5>
                                <AnalysisDetailItem icon={<HistoryIcon />} label="Similar Scam Patterns" value={`${report.similarScamsCount} similar reports found`} colorClass="text-amber-500" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">Is this analysis helpful?</p>
            <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-500/10 text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"><ThumbUpIcon /></button>
                <button className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-500/10 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"><ThumbDownIcon /></button>
                <button className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-amber-500/10 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"><FlagIcon /></button>
            </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
             <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                 <MessageSquareIcon />
                 <span>{report.comments.length} Comment{report.comments.length !== 1 && 's'}</span>
             </button>
             {showComments && (
                 <div className="mt-3 space-y-3 animate-fade-in">
                     {report.comments.map(c => (
                         <div key={c.id} className="flex items-start gap-2">
                             <img src={c.author.avatarUrl} alt={c.author.username} className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 mt-1" />
                             <div className="bg-slate-100 dark:bg-slate-900/70 rounded-lg p-2 flex-1">
                                 <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{c.author.username}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{timeAgo(c.timestamp)}</span>
                                 </div>
                                 <p className="text-sm text-slate-600 dark:text-slate-300">{c.content}</p>
                             </div>
                         </div>
                     ))}

                    {currentUser ? (
                        <form onSubmit={handleCommentSubmit} className="flex items-start gap-2 pt-2">
                            <img src={currentUser.avatarUrl} alt="your avatar" className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 mt-1" />
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full text-sm p-2 bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </form>
                    ) : (
                       <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center">Please log in to comment.</p>
                    )}
                 </div>
             )}
        </div>

      </div>
    </div>
  );
};

export default ResultsDisplay;
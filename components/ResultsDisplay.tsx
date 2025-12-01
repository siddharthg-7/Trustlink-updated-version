
import React, { useState } from 'react';
import type { LinkReport, User } from '../types';
import { CATEGORIES, MOCK_USERS } from '../constants';
import { FlagIcon, ThumbDownIcon, ThumbUpIcon, TimeIcon, CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon, ChevronDownIcon, ServerIcon, AlertTriangleIcon, LinkIcon, HistoryIcon, ShieldCheckIcon, MessageSquareIcon, BadgeCheckIcon } from './icons';

interface ResultsDisplayProps {
  report: LinkReport;
  currentUser: User | null;
  onAddComment: (reportId: string, content: string) => void;
  onVerify: (reportId: string) => void;
}

const RecommendationBanner: React.FC<{ recommendation: string }> = ({ recommendation }) => {
    const lowerCaseRec = recommendation.toLowerCase();
    let bgColor = 'bg-slate-100 dark:bg-slate-700/50';
    let textColor = 'text-slate-800 dark:text-slate-200';
    let Icon = QuestionMarkCircleIcon;

    if (lowerCaseRec.includes('safe')) {
        bgColor = 'bg-emerald-100/50 dark:bg-emerald-900/30';
        textColor = 'text-emerald-800 dark:text-emerald-300';
        Icon = CheckCircleIcon;
    } else if (lowerCaseRec.includes('scam') || lowerCaseRec.includes('avoid')) {
        bgColor = 'bg-rose-100/50 dark:bg-rose-900/30';
        textColor = 'text-rose-800 dark:text-rose-300';
        Icon = XCircleIcon;
    } else if (lowerCaseRec.includes('review') || lowerCaseRec.includes('verification')) {
        bgColor = 'bg-amber-100/50 dark:bg-amber-900/30';
        textColor = 'text-amber-800 dark:text-amber-300';
        Icon = QuestionMarkCircleIcon;
    }

    return (
        <div className={`mt-4 p-3 rounded-xl flex items-start sm:items-center gap-3 ${bgColor} ${textColor} border border-white/10`}>
            <Icon className="h-5 w-5 flex-shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-sm font-bold">{recommendation}</p>
        </div>
    )
}

const RiskScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const getRiskColor = (s: number) => s > 60 ? '#f43f5e' : s > 30 ? '#f59e0b' : '#10b981';
    const color = getRiskColor(score);
    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center h-28 w-28 flex-shrink-0">
            <svg className="absolute transform -rotate-90" width="100" height="100" viewBox="0 0 100 100">
                <circle
                    className="text-slate-200 dark:text-slate-700/50"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    r="36"
                    cx="50"
                    cy="50"
                />
                <circle
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    r="36"
                    cx="50"
                    cy="50"
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                        transition: 'stroke-dashoffset 1s ease-out',
                    }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black drop-shadow-sm" style={{ color }}>{score}</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">RISK</span>
            </div>
        </div>
    );
};

const AnalysisDetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; colorClass?: string }> = ({ icon, label, value, colorClass = 'text-slate-700 dark:text-slate-200' }) => (
    <div className="flex items-center gap-3 p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-white/20 dark:border-white/5 shadow-sm">
        <div className="text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-900/50 p-2 rounded-lg">{icon}</div>
        <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-0.5">{label}</div>
            <div className={`text-sm font-bold truncate ${colorClass}`}>{value}</div>
        </div>
    </div>
);


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ report, currentUser, onAddComment, onVerify }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const categoryInfo = CATEGORIES.find(c => c.id === report.category);
  const author = report.userId ? MOCK_USERS.find(u => u.id === report.userId) : null;
  const isAdmin = currentUser?.id === 'user-1';

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
    if (seconds < 60) return "just now";
    return seconds < 3600 ? `${Math.floor(seconds/60)}m ago` : seconds < 86400 ? `${Math.floor(seconds/3600)}h ago` : `${Math.floor(seconds/86400)}d ago`;
  };
  
  return (
    <div className={`group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-lg border overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${report.isVerified ? 'border-emerald-400/50 shadow-emerald-500/10' : 'border-white/30 dark:border-white/10'}`}>
        
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-slate-200/50 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 bg-white/30 dark:bg-slate-900/30">
             <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full border ${categoryInfo.bgColor} ${categoryInfo.textColor} border-transparent bg-opacity-40`}>
                    {categoryInfo.name}
                </span>
                
                {report.isVerified && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 shadow-sm animate-pulse-glow">
                        <BadgeCheckIcon className="w-4 h-4" />
                        Verified
                    </span>
                )}
             </div>

             <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                {author && (
                     <div className="flex items-center gap-2 mr-2 bg-white/50 dark:bg-slate-800 py-1 px-2 rounded-full border border-slate-200/50 dark:border-white/10">
                        <img src={author.avatarUrl} alt={author.username} className="w-4 h-4 rounded-full" />
                        <span className="text-slate-700 dark:text-slate-300">By {author.username}</span>
                    </div>
                )}
                <span className="flex items-center gap-1 opacity-75"><TimeIcon className="w-3.5 h-3.5" />{timeAgo(report.timestamp)}</span>
                {isAdmin && (
                    <button 
                        onClick={() => onVerify(report.id)}
                        className={`ml-2 px-3 py-1 rounded-lg font-bold transition-all shadow-sm ${report.isVerified ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                    >
                        {report.isVerified ? 'Unverify' : 'Verify'}
                    </button>
                )}
             </div>
        </div>

        {/* Content */}
        <div className="p-6">
             <div className="mb-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200/50 dark:border-white/5">
                {report.imageUrl && (
                    <div className="mb-4 rounded-xl overflow-hidden shadow-sm">
                        <img src={report.imageUrl} alt="Submission" className="w-full h-auto max-h-80 object-contain bg-slate-100 dark:bg-slate-800" />
                    </div>
                )}
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {report.content || <span className="italic text-slate-400">Image-only submission</span>}
                </p>
             </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-white/10 shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-50"></div>
                
                <div className="relative p-6">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                             <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-300">
                                <ShieldCheckIcon className="w-6 h-6" />
                             </div>
                             <h3 className="text-lg font-bold text-slate-800 dark:text-white">AI Analysis</h3>
                        </div>
                        {report.confidenceScore && (
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence</span>
                                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{report.confidenceScore}%</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                        <RiskScoreGauge score={report.riskScore} />
                        <div className="flex-1 space-y-3 w-full text-center sm:text-left">
                            <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-medium">
                                {report.analysis}
                            </p>
                             <RecommendationBanner recommendation={report.recommendation} />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                        className="w-full mt-6 flex justify-center items-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 transition-colors"
                    >
                        <span>{isDetailsOpen ? 'Hide Details' : 'View Full Report'}</span>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isDetailsOpen && (
                        <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/10 grid gap-4 animate-fade-in">
                            {report.redFlags && report.redFlags.length > 0 && (
                                <div className="space-y-2">
                                    <h5 className="text-xs font-bold text-rose-500 uppercase tracking-widest">Red Flags</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {report.redFlags.map(flag => (
                                            <span key={flag} className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                                                <FlagIcon className="h-3.5 w-3.5" /> {flag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {report.linkAnalysis && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                    <AnalysisDetailItem icon={<ServerIcon className="w-4 h-4" />} label="Domain Age" value={report.linkAnalysis.domainAge} />
                                    <AnalysisDetailItem icon={<ShieldCheckIcon className="w-4 h-4" />} label="SSL Status" value={report.linkAnalysis.sslStatus} />
                                    <AnalysisDetailItem icon={<LinkIcon className="w-4 h-4" />} label="Redirects" value={`${report.linkAnalysis.redirects}`} />
                                    <AnalysisDetailItem icon={<AlertTriangleIcon className="w-4 h-4" />} label="Malware Check" value={report.linkAnalysis.malwareScan} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Interactions Footer */}
        <div className="bg-slate-50/80 dark:bg-slate-900/40 px-6 py-4 border-t border-slate-200/50 dark:border-white/5 flex justify-between items-center backdrop-blur-md">
             <div className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-emerald-500 transition-colors"><ThumbUpIcon className="w-5 h-5" /></button>
                <button className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-rose-500 transition-colors"><ThumbDownIcon className="w-5 h-5" /></button>
             </div>
             <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                <MessageSquareIcon className="w-4 h-4" />
                {report.comments.length} Comments
             </button>
        </div>

        {/* Comments Area */}
        {showComments && (
            <div className="bg-slate-100/50 dark:bg-black/20 p-6 border-t border-slate-200/50 dark:border-white/5 animate-fade-in">
                <div className="space-y-4 mb-4">
                    {report.comments.map(c => (
                        <div key={c.id} className="flex gap-3">
                            <img src={c.author.avatarUrl} alt={c.author.username} className="h-8 w-8 rounded-full shadow-sm" />
                            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm">
                                <p className="font-bold text-slate-800 dark:text-white mb-1">{c.author.username}</p>
                                <p className="text-slate-600 dark:text-slate-300">{c.content}</p>
                            </div>
                        </div>
                    ))}
                    {report.comments.length === 0 && <p className="text-center text-sm text-slate-400 italic">No comments yet.</p>}
                </div>
                {currentUser && (
                    <form onSubmit={handleCommentSubmit} className="relative">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full pl-4 pr-12 py-3 rounded-xl bg-white dark:bg-slate-800 border-none shadow-inner text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                        <button type="submit" disabled={!comment.trim()} className="absolute right-2 top-2 p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition-colors">
                            <ChevronDownIcon className="w-4 h-4 -rotate-90" />
                        </button>
                    </form>
                )}
            </div>
        )}
    </div>
  );
};

export default ResultsDisplay;

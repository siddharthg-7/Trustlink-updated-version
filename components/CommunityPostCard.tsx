import React, { useState, useMemo } from 'react';
import type { CommunityPost, User, Category } from '../types';
import { CATEGORIES } from '../constants';
import { FlagIcon, MessageSquareIcon, TimeIcon } from './icons';

interface CommunityPostCardProps {
  post: CommunityPost;
  currentUser: User | null;
  onVote: (postId: string, category: Category) => void;
  onAddComment: (postId: string, content: string) => void;
}

const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};

const CommunityPostCard: React.FC<CommunityPostCardProps> = ({ post, currentUser, onVote, onAddComment }) => {
    const [comment, setComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    
    const voteData = useMemo(() => {
        const totalVotes = post.votes.length;
        if (totalVotes === 0) return [];
        
        const counts = post.votes.reduce((acc, vote) => {
            acc[vote.category] = (acc[vote.category] || 0) + 1;
            return acc;
        }, {} as Record<Category, number>);

        return CATEGORIES.map(cat => ({
            ...cat,
            count: counts[cat.id] || 0,
            percentage: totalVotes > 0 ? ((counts[cat.id] || 0) / totalVotes) * 100 : 0,
        })).sort((a,b) => b.count - a.count);

    }, [post.votes]);

    const userVote = currentUser ? post.votes.find(v => v.userId === currentUser.id)?.category : null;

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || !currentUser) return;
        onAddComment(post.id, comment);
        setComment('');
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow-md overflow-hidden border border-transparent dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="p-5">
                <div className="flex justify-between items-start text-sm text-slate-500 dark:text-slate-400">
                    <span>Anonymous User</span>
                    <div className="flex items-center gap-1">
                        <TimeIcon />
                        <span>{timeAgo(post.timestamp)}</span>
                    </div>
                </div>
                <p className="mt-3 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900/70 p-3 rounded-md border border-slate-200 dark:border-slate-700 break-words">
                    {post.content}
                </p>

                <div className="mt-4">
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-2">Community Verdict</h4>
                    {voteData.length > 0 ? (
                        <div className="space-y-2">
                             {voteData.map(cat => (
                                <div key={cat.id} className="w-full">
                                    <div className="flex justify-between items-center mb-1 text-xs">
                                        <span className={`font-semibold ${cat.textColor} ${cat.darkTextColor}`}>{cat.name}</span>
                                        <span className="font-semibold text-slate-600 dark:text-slate-300">{cat.percentage.toFixed(0)}% ({cat.count})</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                        <div className="h-2 rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-slate-400 dark:text-slate-500 text-xs py-3 bg-slate-50 dark:bg-slate-900/70 rounded-lg">No votes yet. Be the first to cast one!</p>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                         {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                disabled={!currentUser}
                                onClick={() => onVote(post.id, cat.id)}
                                className={`px-3 py-1 text-xs font-semibold rounded-full transition-transform transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${
                                    userVote === cat.id
                                    ? `text-white shadow-sm`
                                    : `${cat.bgColor} ${cat.textColor} ${cat.darkBgColor} ${cat.darkTextColor} hover:opacity-80`
                                }`}
                                style={userVote === cat.id ? { backgroundColor: cat.color } : {}}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                     <button className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-amber-500/10 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"><FlagIcon /></button>
                </div>
                {!currentUser && <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center">Please log in to vote and comment.</p>}

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                     <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                         <MessageSquareIcon />
                         <span>{post.comments.length} Comment{post.comments.length !== 1 && 's'}</span>
                     </button>
                     {showComments && (
                         <div className="mt-3 space-y-3">
                             {post.comments.map(c => (
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

                            {currentUser && (
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
                            )}
                         </div>
                     )}
                </div>

            </div>
        </div>
    );
};

export default CommunityPostCard;
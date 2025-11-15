
import React, { useState } from 'react';
import type { CommunityPost, User, Category, Comment } from '../types';
import { ArrowRightIcon, UsersIcon } from './icons';
import CommunityPostCard from './CommunityPostCard';

interface CommunityViewProps {
    posts: CommunityPost[];
    currentUser: User | null;
    onAddPost: (content: string) => void;
    onVote: (postId: string, category: Category) => void;
    onAddComment: (postId: string, content: string) => void;
}

const CommunityView: React.FC<CommunityViewProps> = ({ posts, currentUser, onAddPost, onVote, onAddComment }) => {
    const [newPostContent, setNewPostContent] = useState('');

    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;
        onAddPost(newPostContent);
        setNewPostContent('');
    };
    
    // Sort posts by timestamp, newest first
    const sortedPosts = [...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="p-4 md:p-0 space-y-6">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-full">
                    <UsersIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Ask the Community</h2>
            </div>

            <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-md border border-transparent dark:border-slate-700">
                 <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">Have a doubt? Post anonymously</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Get feedback from the community on a suspicious link or message. Your post will not be linked to your account.</p>
                 <form onSubmit={handlePostSubmit} className="flex items-start gap-2">
                     <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Share a link or message content here..."
                        className="w-full h-20 p-3 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
                    />
                    <button type="submit" disabled={!newPostContent.trim()} className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed dark:disabled:bg-indigo-800 transition-colors h-20 flex-shrink-0">
                        <ArrowRightIcon className="h-5 w-5" />
                    </button>
                 </form>
            </div>
            
            <div className="space-y-4">
                {sortedPosts.map(post => (
                    <CommunityPostCard 
                        key={post.id} 
                        post={post}
                        currentUser={currentUser}
                        onVote={onVote}
                        onAddComment={onAddComment}
                    />
                ))}
            </div>

        </div>
    );
};

export default CommunityView;

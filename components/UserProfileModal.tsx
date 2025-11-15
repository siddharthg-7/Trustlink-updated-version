import React from 'react';
import { BADGES } from '../constants';
import type { User, BadgeInfo } from '../types';
import { FlagIcon, MessageSquareIcon, ShieldCheckIcon, ThumbUpIcon } from './icons';

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
}

const StatItem: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
        <div className="text-slate-500 dark:text-slate-400">{icon}</div>
        <div>
            <div className="font-bold text-slate-800 dark:text-slate-100 text-lg">{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
        </div>
    </div>
);

const BadgeItem: React.FC<{ badge: BadgeInfo }> = ({ badge }) => (
    <div className="flex items-start gap-3">
        <div className="mt-1">{badge.icon}</div>
        <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">{badge.name}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{badge.description}</div>
        </div>
    </div>
)

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
    const earnedBadges = Object.values(BADGES).filter(badge => badge.check(user));

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-slate-700 animate-fade-in-down"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                        <img src={user.avatarUrl} alt={user.username} className="h-20 w-20 rounded-full mb-3 border-4 border-slate-200 dark:border-slate-700" />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{user.username}</h2>
                        <p className="text-slate-500 dark:text-slate-400">Community Contributor</p>
                    </div>

                    <div className="mt-6">
                         <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3 text-sm uppercase tracking-wider">Stats</h3>
                         <div className="grid grid-cols-3 gap-2">
                            <StatItem icon={<ShieldCheckIcon className="h-6 w-6" />} label="Reports" value={user.reportsCount} />
                            <StatItem icon={<ThumbUpIcon className="h-6 w-6" />} label="Votes" value={user.votesCount} />
                            <StatItem icon={<MessageSquareIcon className="h-6 w-6" />} label="Comments" value={user.commentsCount} />
                         </div>
                    </div>

                     <div className="mt-6">
                         <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3 text-sm uppercase tracking-wider">Badges</h3>
                         <div className="space-y-4">
                            {earnedBadges.length > 0 ? (
                                earnedBadges.map(badge => <BadgeItem key={badge.id} badge={badge} />)
                            ) : (
                                <p className="text-center text-slate-500 dark:text-slate-400 text-sm py-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">No badges earned yet. Keep contributing!</p>
                            )}
                         </div>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 text-right border-t border-slate-200 dark:border-slate-700">
                    <button 
                        onClick={onClose}
                        className="text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserProfileModal;
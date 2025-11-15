import React from 'react';
import type { CategoryInfo, LinkReport, User, CommunityPost, Badge, BadgeInfo } from './types';
import { BadgeCheckIcon, FlagIcon, UsersIcon } from './components/icons';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'PROMOTION',
    name: 'Promotion',
    color: '#3b82f6',
    bgColor: 'bg-blue-100',
    darkBgColor: 'dark:bg-blue-900/50',
    textColor: 'text-blue-800',
    darkTextColor: 'dark:text-blue-300',
    borderColor: 'border-blue-500',
    darkBorderColor: 'dark:border-blue-500',
  },
  {
    id: 'INTERNSHIP',
    name: 'Internship',
    color: '#ec4899',
    bgColor: 'bg-pink-100',
    darkBgColor: 'dark:bg-pink-900/50',
    textColor: 'text-pink-800',
    darkTextColor: 'dark:text-pink-300',
    borderColor: 'border-pink-500',
    darkBorderColor: 'dark:border-pink-500',
  },
  {
    id: 'SCAM',
    name: 'Scam',
    color: '#ef4444',
    bgColor: 'bg-red-100',
    darkBgColor: 'dark:bg-red-900/50',
    textColor: 'text-red-800',
    darkTextColor: 'dark:text-red-300',
    borderColor: 'border-red-500',
    darkBorderColor: 'dark:border-red-500',
  },
   {
    id: 'UNKNOWN',
    name: 'Unknown',
    color: '#f59e0b',
    bgColor: 'bg-amber-100',
    darkBgColor: 'dark:bg-amber-900/50',
    textColor: 'text-amber-800',
    darkTextColor: 'dark:text-amber-300',
    borderColor: 'border-amber-500',
    darkBorderColor: 'dark:border-amber-500',
  },
];

export const MOCK_REPORTS: LinkReport[] = [
    {
        id: 'mock-1',
        content: 'Congratulations! You\'ve won a $1000 gift card. Click here to claim: http://bit.ly/totally-legit-prize',
        category: 'SCAM',
        riskScore: 95,
        analysis: 'The message creates a false sense of urgency and uses a suspicious shortened URL, which are common tactics in phishing scams.',
        redFlags: ['unrealistic claims', 'shortened URL', 'sense of urgency'],
        recommendation: 'Confirmed scam — avoid',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: 'mock-2',
        content: 'Apply for our summer software engineering internship. Gain real-world experience and work with a dynamic team. Apply at https://realcompany.com/internships',
        category: 'INTERNSHIP',
        riskScore: 10,
        analysis: 'This appears to be a standard internship posting with a link to a plausible corporate domain.',
        redFlags: [],
        recommendation: 'Safe to apply',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
        id: 'mock-3',
        content: 'Get 50% off on all electronics this weekend only! Shop now at www.techdeals.com',
        category: 'PROMOTION',
        riskScore: 5,
        analysis: 'This is a typical promotional message with a clear offer and a direct link to a retail site.',
        redFlags: [],
        recommendation: 'Safe to apply',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    }
];

export const MOCK_USERS: User[] = [
    { id: 'user-1', username: 'Alex', avatarUrl: `https://i.pravatar.cc/150?u=alex`, reportsCount: 5, votesCount: 12, commentsCount: 3 },
    { id: 'user-2', username: 'Ben', avatarUrl: `https://i.pravatar.cc/150?u=ben`, reportsCount: 11, votesCount: 25, commentsCount: 8 },
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
    {
        id: 'comm-1',
        content: 'Got this email offer for a remote data entry job, seems too good to be true. They want me to buy equipment through them. What do you guys think? link: a-fake-job-site.com',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        comments: [
            { id: 'c1', author: MOCK_USERS[1], content: 'Definitely a scam. Legitimate companies don\'t ask you to pay for equipment upfront.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() }
        ],
        votes: [
            { userId: 'user-2', category: 'SCAM' },
            { userId: 'user-3-guest', category: 'SCAM' },
            { userId: 'user-4-guest', category: 'INTERNSHIP' },
        ],
    },
    {
        id: 'comm-2',
        content: 'Is this influencer merch drop legit? The website looks a bit new. shop-merch-now.io',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        comments: [],
        votes: [
             { userId: 'user-1', category: 'PROMOTION' },
        ],
    }
];

export const BADGES: { [key in Badge]: BadgeInfo & { check: (user: User) => boolean } } = {
    SCAM_SPOTTER: {
        id: 'SCAM_SPOTTER',
        name: 'Scam Spotter',
        description: 'Awarded for submitting 10+ reports for AI analysis.',
        icon: React.createElement(FlagIcon, { className: "h-5 w-5 text-red-500" }),
        check: (user) => user.reportsCount >= 10,
    },
    VERIFIED_CONTRIBUTOR: {
        id: 'VERIFIED_CONTRIBUTOR',
        name: 'Verified Contributor',
        description: 'Awarded for casting 20+ votes in the community.',
        icon: React.createElement(BadgeCheckIcon, { className: "h-5 w-5 text-blue-500" }),
        check: (user) => user.votesCount >= 20,
    },
    COMMUNITY_HELPER: {
        id: 'COMMUNITY_HELPER',
        name: 'Community Helper',
        description: 'Awarded for posting 5+ helpful comments.',
        icon: React.createElement(UsersIcon, { className: "h-5 w-5 text-green-500" }),
        check: (user) => user.commentsCount >= 5,
    }
};
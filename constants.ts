import React from 'react';
import type { CategoryInfo, LinkReport, User, CommunityPost, Badge, BadgeInfo, VerifiedOpportunity, TrustedCompany } from './types';
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

export const MOCK_USERS: User[] = [
    { id: 'user-1', username: 'Alex', avatarUrl: `https://i.pravatar.cc/150?u=alex`, reportsCount: 5, votesCount: 12, commentsCount: 3 },
    { id: 'user-2', username: 'Ben', avatarUrl: `https://i.pravatar.cc/150?u=ben`, reportsCount: 11, votesCount: 25, commentsCount: 8 },
];

export const MOCK_REPORTS: LinkReport[] = [
    {
        id: 'mock-1',
        content: 'Congratulations! You\'ve won a $1000 gift card. Click here to claim: http://bit.ly/totally-legit-prize',
        category: 'SCAM',
        riskScore: 95,
        analysis: 'The message creates a false sense of urgency and uses a suspicious shortened URL, which are common tactics in phishing scams.',
        redFlags: ['Unrealistic Claims', 'Shortened URL', 'Sense of Urgency', 'Requests Personal Info'],
        recommendation: 'Confirmed scam — avoid',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        confidenceScore: 98,
        similarScamsCount: 12,
        keywordHighlights: ["Congratulations!", "won a $1000 gift card", "Click here to claim"],
        linkAnalysis: {
            domainAge: 'Less than 1 month',
            sslStatus: 'Not Secure',
            redirects: 2,
            malwareScan: 'Infected'
        },
        comments: [
            { id: 'rc1', author: MOCK_USERS[1], content: 'Wow, this is a classic gift card scam. Thanks for the analysis!', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() }
        ]
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
        confidenceScore: 95,
        similarScamsCount: 0,
        keywordHighlights: [],
        linkAnalysis: {
            domainAge: 'Over 5 years',
            sslStatus: 'Secure',
            redirects: 0,
            malwareScan: 'Clean'
        },
        comments: []
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
        confidenceScore: 99,
        similarScamsCount: 0,
        keywordHighlights: ["50% off", "this weekend only"],
        linkAnalysis: {
            domainAge: 'Over 2 years',
            sslStatus: 'Secure',
            redirects: 0,
            malwareScan: 'Clean'
        },
        comments: []
    },
    {
        id: 'mock-4',
        content: 'URGENT: Your student account is suspended. Verify your details immediately at student-portal-update.net to avoid closure.',
        category: 'SCAM',
        riskScore: 88,
        analysis: 'High-pressure language and a non-official URL are major red flags for a phishing attempt.',
        redFlags: ['Urgency Language', 'Suspicious URL', 'Requests Personal Info'],
        recommendation: 'Confirmed scam — avoid',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
        confidenceScore: 96,
        similarScamsCount: 25,
        keywordHighlights: ["URGENT", "account is suspended", "Verify your details"],
        linkAnalysis: { domainAge: 'Less than 1 week', sslStatus: 'Not Secure', redirects: 1, malwareScan: 'Unknown' },
        comments: []
    },
    {
        id: 'mock-5',
        content: 'Easy online job, earn $500/day. No experience needed. Just need to pay a small registration fee for training materials. a-fake-job-site.com',
        category: 'SCAM',
        riskScore: 92,
        analysis: 'Promises of high pay for no experience combined with an upfront fee is a classic job scam.',
        redFlags: ['Unrealistic Claims', 'Asks for money', 'Too Good To Be True Promises'],
        recommendation: 'Confirmed scam — avoid',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // 25 hours ago
        confidenceScore: 99,
        similarScamsCount: 41,
        keywordHighlights: ["earn $500/day", "pay a small registration fee"],
        linkAnalysis: { domainAge: 'Less than 1 month', sslStatus: 'Unknown', redirects: 0, malwareScan: 'Unknown' },
        comments: []
    },
     {
        id: 'mock-6',
        content: 'Join our marketing team as an intern. Great learning opportunity. apply.realcorp.com',
        category: 'INTERNSHIP',
        riskScore: 12,
        analysis: 'Legitimate internship opportunity from a known corporation.',
        redFlags: [],
        recommendation: 'Safe to apply',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        confidenceScore: 94,
        comments: []
    },
    {
        id: 'mock-7',
        content: 'Flash sale on student laptops! Up to 40% off. Shop at bestgadgets.store',
        category: 'PROMOTION',
        riskScore: 8,
        analysis: 'Standard promotional content for an online store.',
        redFlags: [],
        recommendation: 'Safe to apply',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        confidenceScore: 97,
        comments: []
    },
     {
        id: 'mock-8',
        content: 'Your package delivery has failed. Please confirm your address and pay a redelivery fee of $1.99 here: usps-redeliver-track.info',
        category: 'SCAM',
        riskScore: 98,
        analysis: 'Smishing scam impersonating a delivery service to steal credit card information through a small fee.',
        redFlags: ['Impersonation', 'Suspicious URL', 'Asks for money'],
        recommendation: 'Confirmed scam — avoid',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        confidenceScore: 99,
        similarScamsCount: 150,
        keywordHighlights: ["delivery has failed", "pay a redelivery fee"],
        linkAnalysis: { domainAge: 'Less than 1 week', sslStatus: 'Not Secure', redirects: 3, malwareScan: 'Infected' },
        comments: []
    },
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

export const MOCK_VERIFIED_OPPORTUNITIES: VerifiedOpportunity[] = [
  { id: 'vo-1', company: 'Innovate Corp', title: 'Frontend Developer Intern', category: 'INTERNSHIP', verifiedOn: '2024-07-20', trustScore: 95, applyLink: '#', logoUrl: 'https://placehold.co/40x40/a78bfa/ffffff/png?text=IC' },
  { id: 'vo-2', company: 'Data Solutions', title: 'Data Analyst Internship', category: 'INTERNSHIP', verifiedOn: '2024-07-18', trustScore: 92, applyLink: '#', logoUrl: 'https://placehold.co/40x40/3b82f6/ffffff/png?text=DS' },
  { id: 'vo-3', company: 'CodeGenius', title: 'Junior Software Engineer', category: 'JOB', verifiedOn: '2024-07-15', trustScore: 98, applyLink: '#', logoUrl: 'https://placehold.co/40x40/10b981/ffffff/png?text=CG' },
  { id: 'vo-4', company: 'MarketPro', title: 'Digital Marketing Specialist', category: 'JOB', verifiedOn: '2024-07-12', trustScore: 94, applyLink: '#', logoUrl: 'https://placehold.co/40x40/f97316/ffffff/png?text=MP' },
  { id: 'vo-5', company: 'CloudNet', title: '50% Off Cloud Hosting', category: 'PROMOTION', verifiedOn: '2024-07-21', trustScore: 99, applyLink: '#', logoUrl: 'https://placehold.co/40x40/0ea5e9/ffffff/png?text=CN' },
];

export const MOCK_TRUSTED_COMPANIES: TrustedCompany[] = [
    { id: 'tc-1', name: 'Innovate Corp', industry: 'Technology', logoUrl: 'https://placehold.co/40x40/a78bfa/ffffff/png?text=IC' },
    { id: 'tc-2', name: 'CodeGenius', industry: 'Software', logoUrl: 'https://placehold.co/40x40/10b981/ffffff/png?text=CG' },
    { id: 'tc-3', name: 'Data Solutions', industry: 'Analytics', logoUrl: 'https://placehold.co/40x40/3b82f6/ffffff/png?text=DS' },
    { id: 'tc-4', name: 'MarketPro', industry: 'Marketing', logoUrl: 'https://placehold.co/40x40/f97316/ffffff/png?text=MP' },
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
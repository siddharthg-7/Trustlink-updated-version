
// FIX: Import React to provide types like ReactNode.
import React from 'react';

// FIX: Removed circular import of 'User' type which is defined in this file.

export type Category = 'PROMOTION' | 'INTERNSHIP' | 'SCAM' | 'UNKNOWN';

export type View = 'analysis' | 'dashboard' | 'community' | 'responses';

export type Badge = 'SCAM_SPOTTER' | 'VERIFIED_CONTRIBUTOR' | 'COMMUNITY_HELPER';

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  reportsCount: number;
  votesCount: number;
  commentsCount: number;
}

export interface Comment {
    id: string;
    author: User;
    content: string;
    timestamp: string;
}

export interface CommunityVote {
    userId: string;
    category: Category;
}

export interface CommunityPost {
    id: string;
    content: string;
    timestamp: string;
    comments: Comment[];
    votes: CommunityVote[];
}

export interface LinkAnalysis {
  domainAge: string;
  sslStatus: 'Secure' | 'Not Secure' | 'Unknown';
  redirects: number;
  malwareScan: 'Clean' | 'Infected' | 'Unknown';
}

export interface LinkReport {
  id: string;
  content: string;
  category: Category;
  riskScore: number;
  analysis: string;
  redFlags: string[];
  recommendation: string;
  timestamp: string;
  linkAnalysis?: LinkAnalysis;
  keywordHighlights?: string[];
  similarScamsCount?: number;
  confidenceScore?: number;
  comments: Comment[];
  imageUrl?: string;
  isVerified?: boolean;
  userId?: string;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  color: string;
  bgColor: string;
  darkBgColor: string;
  textColor: string;
  darkTextColor: string;
  borderColor: string;
  darkBorderColor: string;
}

export interface GeminiResponse {
  category: Category;
  riskScore: number;
  analysis: string;
  redFlags: string[];
  recommendation: string;
  linkAnalysis?: LinkAnalysis;
  keywordHighlights?: string[];
  similarScamsCount?: number;
  confidenceScore?: number;
}

export interface VerifiedOpportunity {
  id: string;
  company: string;
  title: string;
  category: 'INTERNSHIP' | 'JOB' | 'PROMOTION';
  verifiedOn: string;
  trustScore: number;
  applyLink: string;
  logoUrl: string;
}

export interface TrustedCompany {
  id: string;
  name: string;
  logoUrl: string;
  industry: string;
}

export interface DashboardData {
    totalReports: number;
    scamCount: number;
    safeLinksCount: number;
    communityMembers: number;
    riskScoreDistribution: { name: string; value: number; fill: string }[];
    reportsOverTime: { date: string; count: number }[];
    categoryBreakdown: { name: string; value: number; fill: string }[];
    trendingScams: { name: string; count: number }[];
    recentScams: LinkReport[];
}

export type SortOrder = 'NEWEST_FIRST' | 'OLDEST_FIRST' | 'HIGHEST_RISK' | 'LOWEST_RISK';
export type DateRange = 'ALL' | '24_HOURS' | '7_DAYS' | '30_DAYS';
export type RiskLevel = 'ALL' | 'SAFE' | 'MODERATE' | 'HIGH';

export interface FilterState {
    searchTerm: string;
    category: Category | 'ALL';
    dateRange: DateRange;
    riskLevel: RiskLevel;
    sortOrder: SortOrder;
}

export interface BadgeInfo {
    id: Badge;
    name: string;
    description: string;
    icon: React.ReactNode;
}

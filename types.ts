
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

export interface LinkReport {
  id: string;
  content: string;
  category: Category;
  riskScore: number;
  analysis: string;
  redFlags: string[];
  recommendation: string;
  timestamp: string;
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
}

export interface DashboardData {
    distribution: { name: string; value: number; fill: string }[];
    trendingKeywords: { name: string; count: number }[];
    totalReports: number;
    scamCount: number;
}

export interface BadgeInfo {
    id: Badge;
    name: string;
    description: string;
    icon: React.ReactNode;
}

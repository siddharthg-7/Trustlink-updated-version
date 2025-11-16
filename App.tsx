import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import LinkInputForm from './components/LinkInputForm';
import CategoryView from './components/CategoryView';
import Dashboard from './components/Dashboard';
import CommunityView from './components/CommunityView';
import UserProfileModal from './components/UserProfileModal';
import FilterBar from './components/FilterBar';
import ResultsDisplay from './components/ResultsDisplay';
import { CATEGORIES, MOCK_REPORTS, MOCK_USERS, MOCK_COMMUNITY_POSTS } from './constants';
import type { LinkReport, Category, View, DashboardData, User, CommunityPost, Comment, FilterState } from './types';
import { UserCircleIcon, TrustLinkLogo } from './components/icons';

const App: React.FC = () => {
  const [reports, setReports] = useState<LinkReport[]>(MOCK_REPORTS);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>('analysis');
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: 'ALL',
    dateRange: 'ALL',
    riskLevel: 'ALL',
    sortOrder: 'NEWEST_FIRST',
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // --- Handlers ---
  const handleLogin = () => {
    if (!currentUser) {
        setCurrentUser(MOCK_USERS[0]);
    } else {
        const currentIndex = MOCK_USERS.findIndex(u => u.id === currentUser.id);
        const nextIndex = (currentIndex + 1) % MOCK_USERS.length;
        setCurrentUser(MOCK_USERS[nextIndex]);
    }
  };

  const handleLogout = () => setCurrentUser(null);

  const handleNewReport = (report: LinkReport) => {
    setReports(prevReports => [report, ...prevReports]);
    if (currentUser) {
        setCurrentUser(prevUser => prevUser ? { ...prevUser, reportsCount: prevUser.reportsCount + 1 } : null);
    }
  };
  
  const handleNewCommunityPost = (content: string) => {
      const newPost: CommunityPost = {
          id: `comm-${Date.now()}`,
          content,
          timestamp: new Date().toISOString(),
          comments: [],
          votes: [],
      };
      setCommunityPosts(prev => [newPost, ...prev]);
  };
  
  const handleVote = (postId: string, category: Category) => {
      if (!currentUser) return;
      setCommunityPosts(posts => posts.map(post => {
          if (post.id === postId) {
              const existingVoteIndex = post.votes.findIndex(v => v.userId === currentUser.id);
              if (existingVoteIndex > -1) {
                  const newVotes = [...post.votes];
                  newVotes[existingVoteIndex] = { userId: currentUser.id, category };
                  return { ...post, votes: newVotes };
              } else {
                  return { ...post, votes: [...post.votes, { userId: currentUser.id, category }] };
              }
          }
          return post;
      }));
      setCurrentUser(prev => prev ? { ...prev, votesCount: prev.votesCount + 1 } : null);
  };
  
  const handleAddComment = (postId: string, content: string) => {
      if (!currentUser) return;
      const newComment: Comment = {
          id: `c-${Date.now()}`,
          author: currentUser,
          content,
          timestamp: new Date().toISOString()
      };
      setCommunityPosts(posts => posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment]} : p));
      setCurrentUser(prev => prev ? { ...prev, commentsCount: prev.commentsCount + 1} : null);
  }

  const handleAddReportComment = (reportId: string, content: string) => {
      if (!currentUser) return;
      const newComment: Comment = {
          id: `rc-${Date.now()}`,
          author: currentUser,
          content,
          timestamp: new Date().toISOString()
      };
      setReports(reports => reports.map(r => r.id === reportId ? { ...r, comments: [...r.comments, newComment]} : r));
      setCurrentUser(prev => prev ? { ...prev, commentsCount: prev.commentsCount + 1} : null);
  }

  // --- Memoized Data ---
  const filteredReports = useMemo(() => {
    let tempReports = [...reports];

    if (filters.searchTerm) {
      const lowercasedFilter = filters.searchTerm.toLowerCase();
      tempReports = tempReports.filter(r =>
        r.content.toLowerCase().includes(lowercasedFilter) ||
        r.analysis.toLowerCase().includes(lowercasedFilter) ||
        r.redFlags.some(flag => flag.toLowerCase().includes(lowercasedFilter))
      );
    }

    if (filters.category !== 'ALL') {
      tempReports = tempReports.filter(r => r.category === filters.category);
    }

    if (filters.dateRange !== 'ALL') {
      const now = Date.now();
      let timeLimit = now;
      if (filters.dateRange === '24_HOURS') timeLimit = now - 24 * 60 * 60 * 1000;
      if (filters.dateRange === '7_DAYS') timeLimit = now - 7 * 24 * 60 * 60 * 1000;
      if (filters.dateRange === '30_DAYS') timeLimit = now - 30 * 24 * 60 * 60 * 1000;
      tempReports = tempReports.filter(r => new Date(r.timestamp).getTime() >= timeLimit);
    }

    if (filters.riskLevel !== 'ALL') {
      if (filters.riskLevel === 'SAFE') tempReports = tempReports.filter(r => r.riskScore <= 30);
      if (filters.riskLevel === 'MODERATE') tempReports = tempReports.filter(r => r.riskScore > 30 && r.riskScore <= 60);
      if (filters.riskLevel === 'HIGH') tempReports = tempReports.filter(r => r.riskScore > 60);
    }

    switch (filters.sortOrder) {
      case 'NEWEST_FIRST':
        tempReports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case 'OLDEST_FIRST':
        tempReports.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        break;
      case 'HIGHEST_RISK':
        tempReports.sort((a, b) => b.riskScore - a.riskScore);
        break;
      case 'LOWEST_RISK':
        tempReports.sort((a, b) => a.riskScore - b.riskScore);
        break;
    }

    return tempReports;
  }, [reports, filters]);

  const dashboardData = useMemo<DashboardData>(() => {
    const totalReports = reports.length;
    const scamCount = reports.filter(r => r.category === 'SCAM').length;
    const safeLinksCount = reports.filter(r => r.riskScore <= 30).length;
    const communityMembers = MOCK_USERS.length;

    const riskScores = reports.reduce((acc, report) => {
        if (report.riskScore <= 30) acc.safe++;
        else if (report.riskScore <= 60) acc.moderate++;
        else acc.high++;
        return acc;
    }, { safe: 0, moderate: 0, high: 0 });
    
    const riskScoreDistribution = [
        { name: 'Safe (0-30)', value: riskScores.safe, fill: '#22c55e' },
        { name: 'Moderate (31-60)', value: riskScores.moderate, fill: '#f59e0b' },
        { name: 'High (61-100)', value: riskScores.high, fill: '#ef4444' },
    ];

    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const reportsByDay = reports.reduce((acc, report) => {
        const date = new Date(report.timestamp).toISOString().split('T')[0];
        if (last7Days.includes(date)) {
            acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const reportsOverTime = last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: reportsByDay[date] || 0,
    }));
    
     const categoryCounts = reports.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1;
      return acc;
    }, {} as Record<Category, number>);

    const categoryBreakdown = CATEGORIES.map(cat => ({
        name: cat.name,
        value: categoryCounts[cat.id] || 0,
        fill: cat.color,
    }));

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const trendingScamsKeywords = reports
      .filter(r => r.category === 'SCAM' && new Date(r.timestamp) >= oneWeekAgo && r.redFlags)
      .flatMap(r => r.redFlags!)
      .reduce((acc, keyword) => {
        acc[keyword] = (acc[keyword] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const recentScams = reports
      .filter(r => r.category === 'SCAM' && r.riskScore > 70)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3);

    return {
      totalReports,
      scamCount,
      safeLinksCount,
      communityMembers,
      riskScoreDistribution,
      reportsOverTime,
      categoryBreakdown,
      trendingScams: Object.entries(trendingScamsKeywords)
        .sort(([, aCount], [, bCount]) => bCount - aCount)
        .slice(0, 5)
        .map(([name, value]) => ({ name, count: value })),
      recentScams
    };
  }, [reports]);

  // --- Render Logic ---
  const renderContent = () => {
    switch (activeView) {
      case 'analysis':
        return (
          <>
            <div className="text-center my-8 md:my-12 px-4">
                <div className="inline-block bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl shadow-lg">
                    <TrustLinkLogo className="h-12 md:h-16 w-auto" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mt-6 flex items-center justify-center gap-3">
                    <UserCircleIcon className="h-9 w-9 sm:h-10 sm:w-10 text-sky-500 dark:text-sky-400" />
                    Welcome, Student
                </h2>
                <p className="text-lg sm:text-xl font-bold text-indigo-500 dark:text-indigo-400 mt-2">TRUST LINK - The Verify Zone</p>
                <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                    To find out the genuine opportunities for the Relentless seeker in you.
                </p>
            </div>
            <LinkInputForm onNewReport={handleNewReport} />
             <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4 px-4 md:px-0">All Analyses</h2>
              <div className="px-4 md:px-0">
                <FilterBar filters={filters} onFilterChange={setFilters} resultCount={filteredReports.length} />
              </div>
              <div key={JSON.stringify(filters)} className="space-y-4 px-4 md:px-0">
                {filteredReports.length > 0 ? (
                  filteredReports.map(report => <ResultsDisplay key={report.id} report={report} currentUser={currentUser} onAddComment={handleAddReportComment} />)
                ) : (
                  <div className="text-center py-12 px-4 bg-white dark:bg-slate-800/50 rounded-lg shadow-md border border-transparent dark:border-slate-700 animate-fade-in">
                    <p className="text-slate-500 dark:text-slate-400">No reports match your current filters.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        );
      case 'responses':
          return (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4 px-4 md:px-0">All Responses</h2>
              <CategoryView reports={reports} currentUser={currentUser} onAddComment={handleAddReportComment} />
            </div>
          );
      case 'community':
        return <CommunityView 
            posts={communityPosts}
            currentUser={currentUser}
            onAddPost={handleNewCommunityPost}
            onVote={handleVote}
            onAddComment={handleAddComment}
        />;
      case 'dashboard':
        return <Dashboard data={dashboardData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Header 
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenProfile={() => setProfileModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="container mx-auto max-w-4xl py-6 pb-24 animate-fade-in">
        {renderContent()}
      </main>
      
      {isProfileModalOpen && currentUser && (
        <UserProfileModal user={currentUser} onClose={() => setProfileModalOpen(false)} />
      )}
    </div>
  );
};

export default App;

import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import LinkInputForm from './components/LinkInputForm';
import CategoryView from './components/CategoryView';
import Dashboard from './components/Dashboard';
import CommunityView from './components/CommunityView';
import UserProfileModal from './components/UserProfileModal';
import FilterBar from './components/FilterBar';
import ResultsDisplay from './components/ResultsDisplay';
import LandingPage from './components/LandingPage';
import LayoutWrapper from './components/LayoutWrapper';
import ToastContainer, { ToastMessage, ToastType } from './components/Toast.tsx';
import { CATEGORIES, MOCK_REPORTS, MOCK_USERS, MOCK_COMMUNITY_POSTS } from './constants';
import type { LinkReport, Category, View, DashboardData, User, CommunityPost, Comment, FilterState } from './types';
import { BriefcaseIcon, CheckBadgeIcon, AlertTriangleIcon } from './components/icons';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [reports, setReports] = useState<LinkReport[]>(MOCK_REPORTS);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>('analysis');
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
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

  const addToast = (message: string, type: ToastType = 'info') => {
      const id = Date.now().toString();
      setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
      setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleEnterApp = (role: 'STUDENT' | 'ADMIN') => {
      setShowLanding(false);
      if (role === 'ADMIN') {
          setCurrentUser(MOCK_USERS[0]); // Alex is Admin
          setActiveView('dashboard');
          addToast("Welcome, Admin! Dashboard loaded.", 'success');
      } else {
          setActiveView('analysis');
          addToast("Welcome to the Student Zone!", 'info');
      }
  };

  const handleLogin = () => {
    if (!currentUser) {
        setCurrentUser(MOCK_USERS[0]);
        addToast("Logged in successfully", 'success');
    } else {
        const currentIndex = MOCK_USERS.findIndex(u => u.id === currentUser.id);
        const nextIndex = (currentIndex + 1) % MOCK_USERS.length;
        setCurrentUser(MOCK_USERS[nextIndex]);
        addToast(`Switched user to ${MOCK_USERS[nextIndex].username}`, 'info');
    }
  };

  const handleLogout = () => {
      setCurrentUser(null);
      addToast("Logged out", 'info');
  };

  const handleNewReport = (report: LinkReport) => {
    const reportWithUser = { ...report, userId: currentUser?.id };
    setReports(prevReports => [reportWithUser, ...prevReports]);
    if (currentUser) {
        setCurrentUser(prevUser => prevUser ? { ...prevUser, reportsCount: prevUser.reportsCount + 1 } : null);
    }
    addToast("Analysis Complete! Report generated.", 'success');
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
      addToast("Community post submitted!", 'success');
  };
  
  const handleVote = (postId: string, category: Category) => {
      if (!currentUser) {
          addToast("Please login to vote", 'error');
          return;
      }
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
      addToast("Vote recorded", 'success');
  };
  
  const handleAddComment = (postId: string, content: string) => {
      if (!currentUser) {
           addToast("Please login to comment", 'error');
           return;
      }
      const newComment: Comment = {
          id: `c-${Date.now()}`,
          author: currentUser,
          content,
          timestamp: new Date().toISOString()
      };
      setCommunityPosts(posts => posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment]} : p));
      setCurrentUser(prev => prev ? { ...prev, commentsCount: prev.commentsCount + 1} : null);
      addToast("Comment added", 'success');
  }

  const handleAddReportComment = (reportId: string, content: string) => {
      if (!currentUser) {
          addToast("Please login to comment", 'error');
          return;
      }
      const newComment: Comment = {
          id: `rc-${Date.now()}`,
          author: currentUser,
          content,
          timestamp: new Date().toISOString()
      };
      setReports(reports => reports.map(r => r.id === reportId ? { ...r, comments: [...r.comments, newComment]} : r));
      setCurrentUser(prev => prev ? { ...prev, commentsCount: prev.commentsCount + 1} : null);
      addToast("Comment added", 'success');
  }

  const handleVerifyReport = (reportId: string) => {
    if (!currentUser) {
        addToast("Authorization required", 'error');
        return;
    }
    setReports(prev => prev.map(r => {
        if (r.id === reportId) {
             const newStatus = !r.isVerified;
             if (newStatus) {
                 const author = MOCK_USERS.find(u => u.id === r.userId);
                 const notificationText = author 
                    ? `Report Verified. Notification sent to ${author.username}.`
                    : `Report Verified.`;
                 addToast(notificationText, 'success');
             } else {
                 addToast("Verification removed", 'info');
             }
             return { ...r, isVerified: newStatus };
        }
        return r;
    }));
  };

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
      .filter(r => r.category === 'SCAM' && new Date(r.timestamp).getTime() >= oneWeekAgo.getTime() && r.redFlags)
      .flatMap(r => r.redFlags!)
      .reduce((acc, keyword) => {
        acc[keyword] = (acc[keyword] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    const recentScams = reports
      .filter(r => r.category === 'SCAM' && r.riskScore > 70)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3);
    return { totalReports, scamCount, safeLinksCount, communityMembers, riskScoreDistribution, reportsOverTime, categoryBreakdown, trendingScams: Object.entries(trendingScamsKeywords).sort(([, aCount], [, bCount]) => bCount - aCount).slice(0, 5).map(([name, value]) => ({ name, count: value })), recentScams };
  }, [reports]);

  // --- Student Dashboard Category Cards ---
  const CategoryCard: React.FC<{ title: string; count: number; icon: React.ReactNode; color: string; onClick: () => void }> = ({ title, count, icon, color, onClick }) => (
    <div onClick={onClick} className="bg-white/30 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-5 rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg group">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} text-white shadow-md group-hover:shadow-lg transition-shadow`}>
            {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{count} active reports</p>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'analysis':
        return (
          <>
             {/* Student Dashboard Summary Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 px-4 md:px-0">
                <CategoryCard 
                    title="Promotions" 
                    count={reports.filter(r => r.category === 'PROMOTION').length} 
                    icon={<CheckBadgeIcon className="w-6 h-6" />}
                    color="bg-gradient-to-br from-blue-400 to-cyan-500"
                    onClick={() => { setActiveView('responses'); }} 
                />
                 <CategoryCard 
                    title="Internships" 
                    count={reports.filter(r => r.category === 'INTERNSHIP').length} 
                    icon={<BriefcaseIcon className="w-6 h-6" />}
                    color="bg-gradient-to-br from-purple-400 to-fuchsia-500"
                    onClick={() => { setActiveView('responses'); }} 
                />
                 <CategoryCard 
                    title="Scam Alerts" 
                    count={reports.filter(r => r.category === 'SCAM').length} 
                    icon={<AlertTriangleIcon className="w-6 h-6" />}
                    color="bg-gradient-to-br from-red-400 to-pink-500"
                    onClick={() => { setActiveView('responses'); }} 
                />
             </div>

            <LinkInputForm onNewReport={handleNewReport} />
            
             <div className="mt-16">
              <div className="flex items-center gap-4 mb-6 px-4 md:px-0">
                  <h2 className="text-2xl font-bold text-slate-700 dark:text-white">Recent Analysis</h2>
                  <div className="h-px bg-slate-200 dark:bg-slate-700 flex-grow"></div>
              </div>
              <div className="px-4 md:px-0">
                <FilterBar filters={filters} onFilterChange={setFilters} resultCount={filteredReports.length} />
              </div>
              <div className="space-y-6 px-4 md:px-0">
                {filteredReports.length > 0 ? (
                  filteredReports.map(report => (
                    <ResultsDisplay 
                        key={report.id} 
                        report={report} 
                        currentUser={currentUser} 
                        onAddComment={handleAddReportComment} 
                        onVerify={handleVerifyReport}
                    />
                  ))
                ) : (
                  <div className="text-center py-16 px-4 bg-white/20 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400">No reports match your filters.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        );
      case 'responses':
          return (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-slate-700 dark:text-white mb-6 px-4 md:px-0">Categorized Responses</h2>
              <CategoryView 
                reports={reports} 
                currentUser={currentUser} 
                onAddComment={handleAddReportComment} 
                onVerify={handleVerifyReport}
              />
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
    <LayoutWrapper theme={theme}>
        {showLanding ? (
            <LandingPage onEnter={handleEnterApp} />
        ) : (
            <div className="font-sans text-slate-800 dark:text-slate-200">
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
                <main className="container mx-auto max-w-5xl py-8 pb-32 animate-fade-in relative z-10">
                    {renderContent()}
                </main>
                
                {isProfileModalOpen && currentUser && (
                    <UserProfileModal user={currentUser} onClose={() => setProfileModalOpen(false)} />
                )}
                
                <ToastContainer toasts={toasts} removeToast={removeToast} />
            </div>
        )}
    </LayoutWrapper>
  );
};

export default App;

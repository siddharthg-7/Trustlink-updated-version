
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import type { DashboardData, VerifiedOpportunity, TrustedCompany, LinkReport } from '../types';
import { MOCK_VERIFIED_OPPORTUNITIES, MOCK_TRUSTED_COMPANIES } from '../constants';
import { ChartBarIcon, FlagIcon, ListIcon, CheckBadgeIcon, UsersIcon } from './icons';

interface DashboardProps {
    data: DashboardData;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 flex items-center gap-5 transition-transform hover:scale-105 duration-300 group">
        <div className={`p-4 rounded-xl shadow-inner ${color} bg-opacity-20 text-white group-hover:bg-opacity-40 transition-all`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    </div>
);

const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 h-full">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-6 text-lg">{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
            {children}
        </div>
    </div>
);

type VerifiedTab = 'internships' | 'jobs' | 'promotions' | 'companies';

const VerifiedItem: React.FC<{ item: VerifiedOpportunity | TrustedCompany }> = ({ item }) => {
    const isOpportunity = 'title' in item;

    return (
        <div className="flex items-center gap-4 p-4 bg-white/30 dark:bg-slate-900/30 rounded-xl border border-white/10 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors backdrop-blur-sm">
            <img src={item.logoUrl} alt={isOpportunity ? item.company : item.name} className="h-12 w-12 rounded-lg bg-white dark:bg-slate-700 object-contain p-1 shadow-sm" />
            <div className="flex-grow">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{isOpportunity ? item.title : item.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{isOpportunity ? item.company : item.industry}</p>
            </div>
            {isOpportunity && (
                <>
                <div className="text-center hidden sm:block">
                    <div className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${item.trustScore > 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'}`}>
                        <CheckBadgeIcon className="h-3 w-3" />
                        {item.trustScore}
                    </div>
                </div>
                <a href={item.applyLink} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 text-xs shadow-md">
                    Verify
                </a>
                </>
            )}
        </div>
    );
};

const RecentScamAlert: React.FC<{ report: LinkReport }> = ({ report }) => (
    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
        <div className="flex justify-between items-start">
             <p className="text-sm font-bold text-red-800 dark:text-red-200 line-clamp-2 mb-2 flex-grow">{report.content}</p>
             <span className="ml-2 text-xs font-black text-red-600 dark:text-red-400 whitespace-nowrap bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded">{report.riskScore} RISK</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
            {report.redFlags.slice(0, 3).map(flag => (
                <span key={flag} className="text-[10px] bg-red-200 text-red-900 dark:bg-red-800/50 dark:text-red-200 px-2 py-0.5 rounded-full border border-red-300 dark:border-red-700">{flag}</span>
            ))}
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    const [activeTab, setActiveTab] = useState<VerifiedTab>('internships');
    
    const renderVerifiedContent = () => {
        switch (activeTab) {
            case 'internships':
                return MOCK_VERIFIED_OPPORTUNITIES.filter(o => o.category === 'INTERNSHIP').map(item => <VerifiedItem key={item.id} item={item} />);
            case 'jobs':
                return MOCK_VERIFIED_OPPORTUNITIES.filter(o => o.category === 'JOB').map(item => <VerifiedItem key={item.id} item={item} />);
            case 'promotions':
                 return MOCK_VERIFIED_OPPORTUNITIES.filter(o => o.category === 'PROMOTION').map(item => <VerifiedItem key={item.id} item={item} />);
            case 'companies':
                return MOCK_TRUSTED_COMPANIES.map(item => <VerifiedItem key={item.id} item={item} />);
            default:
                return null;
        }
    };
    
    const TabButton: React.FC<{ tab: VerifiedTab, label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 ${
                activeTab === tab
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/50'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="p-4 md:p-0 space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-indigo-400 to-purple-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
                    <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white">Admin Dashboard</h2>
                    <p className="text-slate-500 dark:text-slate-400">Platform Analytics & Verification</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Reports" value={data.totalReports} icon={<ListIcon className="h-8 w-8"/>} color="bg-blue-500" />
                <StatCard title="Active Scams" value={data.scamCount} icon={<FlagIcon className="h-8 w-8"/>} color="bg-red-500" />
                <StatCard title="Safe Links" value={data.safeLinksCount} icon={<CheckBadgeIcon className="h-8 w-8"/>} color="bg-green-500" />
                <StatCard title="Community" value={data.communityMembers} icon={<UsersIcon className="h-8 w-8"/>} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-1">
                    <ChartContainer title="Risk Distribution">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={data.riskScoreDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} labelLine={false} stroke="none">
                                    {data.riskScoreDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} className="drop-shadow-lg" />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', color: '#fff' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
                
                <div className="lg:col-span-2">
                    <ChartContainer title="Weekly Report Trends">
                        <ResponsiveContainer>
                            <LineChart data={data.reportsOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', color: '#fff' }} cursor={{stroke: 'rgba(255,255,255,0.2)'}} />
                                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={4} dot={{r: 4, fill: '#8b5cf6', strokeWidth: 0}} activeDot={{ r: 8, fill: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 text-lg">Trending Scams</h3>
                    {data.trendingScams.length > 0 ? (
                        <div className="space-y-3">
                            {data.trendingScams.map((keyword, i) => (
                                <div key={keyword.name} className="flex justify-between items-center text-sm p-3 bg-white/40 dark:bg-slate-900/40 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-slate-400">#{i + 1}</span>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{keyword.name}</span>
                                    </div>
                                    <span className="font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full text-xs">{keyword.count} Reports</span>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No new scam trends this week.</p>}
                </div>
                <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 text-lg">Recent High-Risk Alerts</h3>
                     {data.recentScams.length > 0 ? (
                        <div className="space-y-3">
                            {data.recentScams.map(report => <RecentScamAlert key={report.id} report={report} />)}
                        </div>
                    ) : <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No high-risk scams detected recently.</p>}
                </div>
            </div>

            <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 text-lg">Verification Queue</h3>
                <div className="flex space-x-2 bg-slate-200/50 dark:bg-slate-900/50 p-1.5 rounded-full overflow-x-auto mb-6 backdrop-blur-sm w-fit">
                    <TabButton tab="internships" label="Internships" />
                    <TabButton tab="jobs" label="Job Offers" />
                    <TabButton tab="promotions" label="Promotions" />
                    <TabButton tab="companies" label="Companies" />
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {renderVerifiedContent()}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

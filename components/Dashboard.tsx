
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import type { DashboardData, VerifiedOpportunity, TrustedCompany, LinkReport } from '../types';
import { MOCK_VERIFIED_OPPORTUNITIES, MOCK_TRUSTED_COMPANIES } from '../constants';
import { ChartBarIcon, FlagIcon, ListIcon, CheckBadgeIcon, UsersIcon, AlertTriangleIcon, BriefcaseIcon, BuildingOfficeIcon } from './icons';

interface DashboardProps {
    data: DashboardData;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-md flex items-center gap-4 border border-transparent dark:border-slate-700 transition-transform transform hover:scale-105">
        {icon}
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    </div>
);

const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-md border border-transparent dark:border-slate-700">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">{title}</h3>
        <div style={{ width: '100%', height: 250 }}>
            {children}
        </div>
    </div>
);

type VerifiedTab = 'internships' | 'jobs' | 'promotions' | 'companies';

const VerifiedItem: React.FC<{ item: VerifiedOpportunity | TrustedCompany }> = ({ item }) => {
    const isOpportunity = 'title' in item;

    return (
        <div className="flex items-center gap-4 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors">
            <img src={item.logoUrl} alt={isOpportunity ? item.company : item.name} className="h-10 w-10 rounded-md bg-white dark:bg-slate-700 object-contain p-1 flex-shrink-0" />
            <div className="flex-grow">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{isOpportunity ? item.title : item.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{isOpportunity ? item.company : item.industry}</p>
            </div>
            {isOpportunity && (
                <>
                <div className="text-center hidden sm:block">
                    <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${item.trustScore > 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'}`}>
                        <CheckBadgeIcon className="h-3 w-3" />
                        {item.trustScore}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Trust Score</p>
                </div>
                <a href={item.applyLink} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs flex-shrink-0">
                    Apply
                </a>
                </>
            )}
        </div>
    );
};

const RecentScamAlert: React.FC<{ report: LinkReport }> = ({ report }) => (
    <div className="p-3 rounded-lg bg-red-100/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
        <p className="text-sm font-bold text-red-800 dark:text-red-300 truncate">{report.content}</p>
        <div className="flex items-center justify-between mt-1">
             <div className="flex items-center gap-2">
                {report.redFlags.slice(0, 2).map(flag => (
                    <span key={flag} className="text-xs bg-red-200 text-red-900 dark:bg-red-800/50 dark:text-red-200 px-2 py-0.5 rounded-full">{flag}</span>
                ))}
            </div>
            <span className="text-xs font-semibold text-red-600 dark:text-red-400">{report.riskScore} Risk</span>
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
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                activeTab === tab
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="p-4 md:p-0 space-y-6">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-full">
                    <ChartBarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Community Dashboard</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Reports" value={data.totalReports} icon={<ListIcon className="h-8 w-8 text-blue-500"/>} />
                <StatCard title="Active Scams" value={data.scamCount} icon={<FlagIcon className="h-8 w-8 text-red-500"/>} />
                <StatCard title="Safe Links" value={data.safeLinksCount} icon={<CheckBadgeIcon className="h-8 w-8 text-green-500"/>} />
                <StatCard title="Community" value={`${data.communityMembers} Members`} icon={<UsersIcon className="h-8 w-8 text-indigo-500"/>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <ChartContainer title="Risk Score Distribution">
                     <ResponsiveContainer>
                        <PieChart>
                            <Pie data={data.riskScoreDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold">{`${(percent * 100).toFixed(0)}%`}</text>;
                            }}>
                                {data.riskScoreDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid #475569', borderRadius: '0.5rem' }} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
                
                <div className="lg:col-span-2">
                    <ChartContainer title="Reports Last 7 Days">
                        <ResponsiveContainer>
                            <LineChart data={data.reportsOverTime} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.3)" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false}/>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid #475569', borderRadius: '0.5rem' }} />
                                <Line type="monotone" dataKey="count" stroke="#818cf8" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-md border border-transparent dark:border-slate-700 space-y-4">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200">Trending Scams This Week</h3>
                    {data.trendingScams.length > 0 ? (
                        <div className="space-y-2">
                            {data.trendingScams.map(keyword => (
                                <div key={keyword.name} className="flex justify-between items-center text-sm p-2 bg-slate-50 dark:bg-slate-900/50 rounded-md">
                                    <span className="font-medium text-slate-600 dark:text-slate-300">{keyword.name}</span>
                                    <span className="font-bold text-red-500 bg-red-100 dark:bg-red-900/50 dark:text-red-300 px-2 py-0.5 rounded-md">{keyword.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No new scam trends this week.</p>}
                </div>
                <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-md border border-transparent dark:border-slate-700 space-y-4">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200">Recent Scam Alerts</h3>
                     {data.recentScams.length > 0 ? (
                        <div className="space-y-2">
                            {data.recentScams.map(report => <RecentScamAlert key={report.id} report={report} />)}
                        </div>
                    ) : <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No high-risk scams detected recently.</p>}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-md border border-transparent dark:border-slate-700">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Verified Repository</h3>
                <div className="flex space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-full overflow-x-auto mb-4">
                    <TabButton tab="internships" label="Internships" />
                    <TabButton tab="jobs" label="Job Offers" />
                    <TabButton tab="promotions" label="Promotions" />
                    <TabButton tab="companies" label="Companies" />
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {renderVerifiedContent()}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { DashboardData } from '../types';
import { CATEGORIES } from '../constants';
import { ChartBarIcon, FlagIcon, ListIcon } from './icons';

interface DashboardProps {
    data: DashboardData;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; darkColor: string }> = ({ title, value, icon, color, darkColor }) => (
    <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-md flex items-center gap-4 border border-transparent dark:border-slate-700 transition-transform transform hover:scale-105">
        <div className={`p-3 rounded-full ${color} ${darkColor}`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    return (
        <div className="p-4 md:p-0 space-y-6">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-full">
                    <ChartBarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Community Dashboard</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard title="Total Reports" value={data.totalReports} icon={<ListIcon className="h-6 w-6 text-blue-800 dark:text-blue-300"/>} color="bg-blue-100" darkColor="dark:bg-blue-900/50" />
                <StatCard title="Scams Identified" value={data.scamCount} icon={<FlagIcon className="h-6 w-6 text-red-800 dark:text-red-300"/>} color="bg-red-100" darkColor="dark:bg-red-900/50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-md border border-transparent dark:border-slate-700 transition-shadow hover:shadow-2xl">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Report Distribution</h3>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={data.distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {data.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid #475569', borderRadius: '0.5rem' }}/>
                                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-md border border-transparent dark:border-slate-700 transition-shadow hover:shadow-2xl">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Trending Scam Keywords</h3>
                    {data.trendingKeywords.length > 0 ? (
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <BarChart data={data.trendingKeywords} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" width={80} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{fill: 'rgba(71, 85, 105, 0.3)'}} contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid #475569', borderRadius: '0.5rem' }} />
                                    <Bar dataKey="count" fill="#ef4444" barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[250px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                           No scam keywords to display.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
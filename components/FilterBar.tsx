import React from 'react';
import { CATEGORIES } from '../constants';
import { SearchIcon } from './icons';
import type { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
}

const FilterInput: React.FC<{ children: React.ReactNode, label: string }> = ({ children, label }) => (
    <div className="flex flex-col">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
        {children}
    </div>
);

const selectClassName = "bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md p-2 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 w-full";

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, resultCount }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onFilterChange({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg p-4 sm:p-5 mb-6 border border-transparent dark:border-slate-700 animate-fade-in-down">
            <div className="relative mb-4">
                 <label htmlFor="search-input" className="sr-only">Search</label>
                 <input
                    id="search-input"
                    type="text"
                    name="searchTerm"
                    value={filters.searchTerm}
                    onChange={handleChange}
                    placeholder="Search links, messages, or keywords..."
                    className="w-full p-2 pl-10 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-slate-400" />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FilterInput label="Category">
                    <select name="category" value={filters.category} onChange={handleChange} className={selectClassName}>
                        <option value="ALL">All</option>
                        {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </FilterInput>

                <FilterInput label="Date Range">
                    <select name="dateRange" value={filters.dateRange} onChange={handleChange} className={selectClassName}>
                        <option value="ALL">All Time</option>
                        <option value="24_HOURS">Last 24 Hours</option>
                        <option value="7_DAYS">Last Week</option>
                        <option value="30_DAYS">Last Month</option>
                    </select>
                </FilterInput>

                <FilterInput label="Risk Level">
                    <select name="riskLevel" value={filters.riskLevel} onChange={handleChange} className={selectClassName}>
                        <option value="ALL">All</option>
                        <option value="SAFE">Safe (0-30)</option>
                        <option value="MODERATE">Moderate (31-60)</option>
                        <option value="HIGH">High Risk (61-100)</option>
                    </select>
                </FilterInput>

                <FilterInput label="Sort By">
                    <select name="sortOrder" value={filters.sortOrder} onChange={handleChange} className={selectClassName}>
                        <option value="NEWEST_FIRST">Newest First</option>
                        <option value="OLDEST_FIRST">Oldest First</option>
                        <option value="HIGHEST_RISK">Highest Risk</option>
                        <option value="LOWEST_RISK">Lowest Risk</option>
                    </select>
                </FilterInput>
            </div>
             <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-right">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {resultCount} {resultCount === 1 ? 'result' : 'results'} found
                </p>
             </div>
        </div>
    );
};

export default FilterBar;

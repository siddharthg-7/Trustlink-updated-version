
import React, { useState } from 'react';
import type { Category, LinkReport, User } from '../types';
import { CATEGORIES } from '../constants';
import ResultsDisplay from './ResultsDisplay';

interface CategoryViewProps {
  reports: LinkReport[];
  currentUser: User | null;
  onAddComment: (reportId: string, content: string) => void;
  onVerify: (reportId: string) => void;
}

const CategoryView: React.FC<CategoryViewProps> = ({ reports, currentUser, onAddComment, onVerify }) => {
  const [activeTab, setActiveTab] = useState<Category>(CATEGORIES[0].id);

  const filteredReports = reports.filter(report => report.category === activeTab);

  return (
    <div>
      <div className="px-4 md:px-0 mb-4">
        <div className="flex space-x-2 bg-slate-200 dark:bg-slate-800/50 p-1 rounded-full overflow-x-auto">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`w-full px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                activeTab === category.id
                  ? 'text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
              }`}
              style={activeTab === category.id ? { backgroundColor: category.color } : {}}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-6 px-4 md:px-0">
        {filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <ResultsDisplay 
                key={report.id} 
                report={report} 
                currentUser={currentUser} 
                onAddComment={onAddComment} 
                onVerify={onVerify}
            />
          ))
        ) : (
          <div className="text-center py-12 px-4 bg-white dark:bg-slate-800/50 rounded-lg shadow-md border border-transparent dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">No reports found for this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryView;

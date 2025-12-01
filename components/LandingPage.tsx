
import React from 'react';
import { TrustLinkLogo, UserCircleIcon, ShieldCheckIcon, ArrowRightIcon } from './icons';

interface LandingPageProps {
  onEnter: (role: 'STUDENT' | 'ADMIN') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center relative p-6">
      <div className="z-10 text-center max-w-4xl w-full space-y-8">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center animate-fade-in-down">
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20 mb-6">
             <TrustLinkLogo className="h-24 w-auto scale-125" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 drop-shadow-lg tracking-tight">
            TrustLink
          </h1>
          <p className="text-2xl font-light text-slate-600 dark:text-slate-300 tracking-wide animate-fade-in delay-200">
            Verify Before You Trust
          </p>
        </div>
        
        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 w-full mt-12 px-4 md:px-12 animate-fade-in delay-300">
          {/* Student Card */}
          <button 
            onClick={() => onEnter('STUDENT')}
            className="group relative h-64 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
          >
            <div className="absolute inset-0 bg-white/30 dark:bg-slate-800/40 backdrop-blur-md border border-white/30 dark:border-white/10 transition-colors"></div>
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="bg-gradient-to-br from-blue-400 to-cyan-400 p-4 rounded-full mb-4 shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                    <UserCircleIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Student Zone</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                    Analyze links, check internships, and stay safe.
                </p>
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center text-blue-600 dark:text-blue-300 font-bold">
                    Enter Dashboard <ArrowRightIcon className="w-5 h-5 ml-2" />
                </div>
            </div>
          </button>

          {/* Admin Card */}
          <button 
            onClick={() => onEnter('ADMIN')}
            className="group relative h-64 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(236,72,153,0.3)]"
          >
             <div className="absolute inset-0 bg-white/30 dark:bg-slate-800/40 backdrop-blur-md border border-white/30 dark:border-white/10 transition-colors"></div>
             {/* Gradient Overlay on Hover */}
             <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             
             <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="bg-gradient-to-br from-pink-400 to-purple-400 p-4 rounded-full mb-4 shadow-lg group-hover:shadow-pink-500/50 transition-all">
                    <ShieldCheckIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Admin Access</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                    Verify reports, manage alerts, and view analytics.
                </p>
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center text-pink-600 dark:text-pink-300 font-bold">
                    Login Securely <ArrowRightIcon className="w-5 h-5 ml-2" />
                </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

import React from 'react';
import type { User, View } from '../types';
import { TrustLinkLogo, HomeIcon, ListChecksIcon, UsersIcon, ChartBarIcon, MoonIcon, SunIcon } from './icons';

interface HeaderProps {
    currentUser: User | null;
    onLogin: () => void;
    onLogout: () => void;
    onOpenProfile: () => void;
    activeView: View;
    setActiveView: (view: View) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const NavButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive 
            ? 'text-white bg-white/10' 
            : 'text-gray-300 hover:text-white hover:bg-white/5'
        }`}
    >
        {icon}
        {label}
    </button>
);

const Header: React.FC<HeaderProps> = ({ currentUser, onLogin, onLogout, onOpenProfile, activeView, setActiveView, theme, toggleTheme }) => {
  return (
    <header className="bg-[#1a2035] shadow-lg sticky top-0 z-40">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('analysis')}>
                     <TrustLinkLogo className="h-8 w-auto" />
                </div>
                <nav className="hidden md:flex items-center gap-2">
                    <NavButton label="Home" icon={<HomeIcon />} isActive={activeView === 'analysis'} onClick={() => setActiveView('analysis')} />
                    <NavButton label="Responses" icon={<ListChecksIcon />} isActive={activeView === 'responses'} onClick={() => setActiveView('responses')} />
                    <NavButton label="Community" icon={<UsersIcon />} isActive={activeView === 'community'} onClick={() => setActiveView('community')} />
                    <NavButton label="Dashboard" icon={<ChartBarIcon />} isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
                </nav>
            </div>
            <div className="flex items-center gap-3">
                 <button onClick={toggleTheme} className="text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors">
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
                {currentUser ? (
                    <div className="flex items-center gap-3">
                        <button onClick={onOpenProfile} className="flex items-center gap-2 text-sm font-medium text-gray-200 hover:text-white">
                            <img src={currentUser.avatarUrl} alt={currentUser.username} className="h-8 w-8 rounded-full bg-slate-700 ring-2 ring-slate-500" />
                        </button>
                    </div>
                ) : (
                    <button onClick={onLogin} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                        Login
                    </button>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
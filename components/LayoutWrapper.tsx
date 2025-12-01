
import React, { useState, useRef, useEffect } from 'react';
import { BotIcon, MusicIcon, MusicOffIcon } from './icons';

interface LayoutWrapperProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Toggle music playback
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Since we can't provide a real file, we'll simulate the state change. 
        // In a real app, this would be audioRef.current.play().
        console.log("Music playing (simulated)");
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Particle generation
  const particles = Array.from({ length: 20 });

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/30 dark:bg-blue-600/20 rounded-full blur-[100px] animate-float opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-500/30 dark:bg-purple-600/20 rounded-full blur-[100px] animate-float opacity-70" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-red-400/20 dark:bg-indigo-600/20 rounded-full blur-[80px] animate-float opacity-60" style={{ animationDelay: '4s' }}></div>
        
        {/* Glowing Particle Overlay */}
        {particles.map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/40 dark:bg-white/10 blur-[1px]"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `particle ${Math.random() * 20 + 10}s linear infinite`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          ></div>
        ))}
      </div>

      {/* --- Content Layer --- */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>

      {/* --- Floating Elements --- */}
      
      {/* Music Toggle */}
      <button 
        onClick={toggleMusic}
        className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-slate-700 dark:text-white shadow-lg hover:shadow-indigo-500/20 hover:scale-110 transition-all duration-300"
        title="Toggle Ambient Music"
      >
        {isPlaying ? <MusicIcon className="w-6 h-6 animate-pulse" /> : <MusicOffIcon className="w-6 h-6" />}
      </button>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop>
        <source src="" type="audio/mp3" /> {/* Placeholder for ambient tech hum */}
      </audio>

      {/* Floating Mascot (Shield Bot) */}
      <div className="fixed bottom-6 right-6 z-50 animate-float">
        <div className="relative group cursor-pointer">
           <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
           <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-full shadow-2xl border border-white/20 group-hover:scale-110 transition-transform duration-300">
              <BotIcon className="w-8 h-8 text-white" />
              {/* Tooltip bubble */}
              <div className="absolute bottom-full right-0 mb-3 w-40 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transform translate-y-2 group-hover:translate-y-0 text-center">
                  I'm TrustBot! I'm here to help you verify links.
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};

export default LayoutWrapper;

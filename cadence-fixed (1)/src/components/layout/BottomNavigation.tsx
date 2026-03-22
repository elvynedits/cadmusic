import React from 'react';
import { Home, LayoutGrid, Radio, ListMusic, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: LayoutGrid, label: 'New', path: '/new' },
    { icon: Radio, label: 'Radio', path: '/radio' },
    { icon: ListMusic, label: 'Library', path: '/library' },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center px-4 z-40 pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center bg-white/60 dark:bg-[#1C1C1E]/60 backdrop-blur-3xl rounded-[24px] p-1 shadow-xl border border-white/20 dark:border-white/10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center justify-center w-[60px] h-[52px] rounded-[20px] transition-all duration-300 ${isActive ? 'text-[#FF2D55]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-[20px]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 mb-0.5 z-10 ${isActive ? 'fill-current' : ''}`} />
                <span className="text-[9px] font-medium z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => navigate('/search')}
          className="w-[60px] h-[60px] rounded-full bg-white/60 dark:bg-[#1C1C1E]/60 backdrop-blur-3xl flex items-center justify-center shadow-xl border border-white/20 dark:border-white/10 text-gray-900 dark:text-white hover:scale-105 transition-transform"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

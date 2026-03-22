import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { User, LogOut, Settings, Heart, ListMusic } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const { user, loginWithGoogle, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Home';
      case '/search': return 'Search';
      case '/library': return 'Library';
      case '/radio': return 'Radio';
      case '/new': return 'New';
      default: return 'Cadence';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/60 dark:bg-[#0A0A0A]/60 backdrop-blur-3xl border-b border-white/20 dark:border-white/10 px-6 py-3 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
        {getPageTitle()}
      </h1>

      <div className="flex items-center gap-4 relative">
        {user ? (
          <div>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-9 h-9 rounded-full overflow-hidden bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors flex items-center justify-center"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-5 h-5 text-gray-900 dark:text-white" />
              )}
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 w-56 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm text-white font-medium truncate">{user.displayName}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <button onClick={() => { navigate('/library'); setIsDropdownOpen(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-colors">
                      <ListMusic className="w-4 h-4" /> My Playlists
                    </button>
                    <button onClick={() => { navigate('/library?tab=liked'); setIsDropdownOpen(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-colors">
                      <Heart className="w-4 h-4" /> Liked Songs
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                  </div>
                  
                  <div className="border-t border-white/10 py-1">
                    <button onClick={() => { logout(); setIsDropdownOpen(false); }} className="w-full px-4 py-2 text-left text-sm text-[#FF2D55] hover:bg-[#FF2D55]/10 flex items-center gap-3 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button
            onClick={loginWithGoogle}
            className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

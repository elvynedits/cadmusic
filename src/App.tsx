import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Header from './components/layout/Header';
import BottomPlayer from './components/layout/BottomPlayer';
import PlayerExpanded from './components/layout/PlayerExpanded';
import BottomNavigation from './components/layout/BottomNavigation';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import LibraryScreen from './screens/LibraryScreen';
import PlaylistScreen from './screens/PlaylistScreen';
import LoginScreen from './screens/LoginScreen';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'react-hot-toast';

function App() {
  const { initAuthListener, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initAuthListener();
  }, [initAuthListener]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF2D55] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#FF2D55]/30">
        <Toaster position="top-center" toastOptions={{ style: { background: '#1C1C1E', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
        <LoginScreen />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#FF2D55]/30">
        <Toaster position="top-center" toastOptions={{ style: { background: '#1C1C1E', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
        <Header />
        
        <main className="pb-24 sm:pb-32">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/library" element={<LibraryScreen />} />
              <Route path="/playlist/:id" element={<PlaylistScreen />} />
              <Route path="/radio" element={<div className="p-8 text-center text-gray-400">Radio coming soon</div>} />
              <Route path="/new" element={<div className="p-8 text-center text-gray-400">New coming soon</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>

        <BottomPlayer />
        <PlayerExpanded />
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;

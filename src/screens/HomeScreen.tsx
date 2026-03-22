import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePlayerStore, Song } from '../store/playerStore';
import { useRecentlyPlayedStore } from '../store/recentlyPlayedStore';
import { useLikedSongsStore } from '../store/likedSongsStore';
import { Play, ArrowRight, Heart, RefreshCw, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { play, addToQueue } = usePlayerStore();
  const { recentSongs, loadRecentSongs } = useRecentlyPlayedStore();
  const { isLiked, likeSong, unlikeSong } = useLikedSongsStore();
  const [topPicks, setTopPicks] = useState<Song[]>([]);
  const [loadingPicks, setLoadingPicks] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecentSongs();
    }
  }, [user, loadRecentSongs]);

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        const { API_ENDPOINTS } = await import('../config/apiConfig');
        const res = await fetch(API_ENDPOINTS.TOP_PICKS);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        if (data.results) {
          setTopPicks(data.results);
        }
      } catch (error) {
        console.error('Failed to fetch top picks:', error);
      } finally {
        setLoadingPicks(false);
      }
    };
    fetchTopPicks();
  }, []);

  const toggleLike = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    if (isLiked(song.videoId)) {
      unlikeSong(song.videoId);
    } else {
      likeSong(song);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Transfer Music Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1C1C1E] rounded-3xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-white/5"
        >
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-[#FF2D55]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Transfer music and playlists</h2>
              <p className="text-gray-400 text-sm">from other music services.</p>
            </div>
          </div>
          <button className="bg-[#FF2D55] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#FF2D55]/90 transition-colors text-sm w-full sm:w-auto">
            Get Started
          </button>
        </motion.div>

        {/* Top Picks */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold tracking-tight">Top Picks for You</h3>
            <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {loadingPicks ? (
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="min-w-[160px] sm:min-w-[200px] h-[200px] sm:h-[240px] bg-white/5 animate-pulse rounded-2xl snap-start" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
              {topPicks.map((song, i) => (
                <motion.div
                  key={song.videoId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { play(song); addToQueue(song); }}
                  className="min-w-[160px] sm:min-w-[200px] relative aspect-square rounded-2xl overflow-hidden group cursor-pointer snap-start"
                >
                  <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-tight mb-1">{song.title}</h4>
                    <p className="text-xs text-gray-300 truncate">{song.artist}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
                    <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all">
                      <Play className="w-5 h-5 fill-current ml-1" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Mood for You & Featuring */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold tracking-tight">Mood for You</h3>
            </div>
            <div className="relative h-[240px] rounded-3xl overflow-hidden cursor-pointer group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 opacity-90 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <p className="text-sm font-medium text-white/80 uppercase tracking-wider mb-1">Playlist</p>
                <h4 className="text-4xl font-bold text-white tracking-tight">Relax</h4>
              </div>
              <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-5 h-5 text-white fill-current ml-1" />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold tracking-tight">Featuring Cardi B</h3>
            </div>
            <div className="relative h-[240px] rounded-3xl overflow-hidden cursor-pointer group">
              <img src="https://picsum.photos/seed/cardib/800/600" alt="Cardi B" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <p className="text-sm font-medium text-white/80 uppercase tracking-wider mb-1">Artist Spotlight</p>
                <h4 className="text-3xl font-bold text-white tracking-tight">Cardi B Essentials</h4>
              </div>
              <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-5 h-5 text-white fill-current ml-1" />
              </div>
            </div>
          </section>
        </div>

        {/* Recently Played */}
        {recentSongs.length > 0 && (
          <section>
            <h3 className="text-2xl font-bold tracking-tight mb-4">Recently Played</h3>
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
              {recentSongs.map((song) => (
                <div key={song.videoId} className="min-w-[140px] snap-start group cursor-pointer" onClick={() => { play(song); addToQueue(song); }}>
                  <div className="w-[140px] h-[140px] rounded-2xl overflow-hidden mb-3 relative shadow-lg">
                    <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                    <button 
                      onClick={(e) => toggleLike(e, song)}
                      className={`absolute top-2 right-2 p-2 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all ${isLiked(song.videoId) ? 'text-[#FF2D55]' : 'text-white hover:text-[#FF2D55]'}`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked(song.videoId) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <h5 className="text-sm font-medium text-white truncate">{song.title}</h5>
                  <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

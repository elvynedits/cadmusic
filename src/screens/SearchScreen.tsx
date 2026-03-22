import React, { useEffect, useState } from 'react';
import { useSearchStore } from '../store/searchStore';
import { usePlayerStore, Song } from '../store/playerStore';
import { useLikedSongsStore } from '../store/likedSongsStore';
import { Search, Play, Plus, MoreHorizontal, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import AddToPlaylistModal from '../components/AddToPlaylistModal';

export default function SearchScreen() {
  const { searchQuery, setSearchQuery, searchResults, isSearching, performSearch } = useSearchStore();
  const { play, addToQueue } = usePlayerStore();
  const { isLiked, likeSong, unlikeSong } = useLikedSongsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, performSearch]);

  const handlePlay = (song: Song) => {
    play(song);
    addToQueue(song);
  };

  const toggleLike = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    if (isLiked(song.videoId)) {
      unlikeSong(song.videoId);
    } else {
      likeSong(song);
    }
  };

  const handleOpenModal = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    setSelectedSong(song);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32 pt-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="sticky top-20 z-30 mb-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Artists, Songs, Lyrics, and More"
              className="w-full bg-[#1C1C1E] border border-white/5 rounded-[16px] py-3.5 pl-12 pr-10 text-[17px] text-white placeholder-gray-500 focus:outline-none focus:bg-[#2C2C2E] transition-all shadow-sm"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-gray-600 rounded-full text-white hover:bg-gray-500"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            )}
          </div>
        </div>

        {isSearching ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 animate-pulse">
                <div className="w-14 h-14 bg-white/10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                  <div className="h-3 bg-white/10 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold mb-4 tracking-tight">Top Results</h3>
            {searchResults.map((song, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={song.videoId}
                className="group flex items-center gap-4 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => handlePlay(song)}
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-sm shrink-0">
                  <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 text-white fill-current ml-1" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 border-b border-white/5 pb-2 pt-2 group-last:border-0">
                  <h4 className="text-[17px] font-medium text-white truncate group-hover:text-[#FF2D55] transition-colors">{song.title}</h4>
                  <p className="text-[13px] text-gray-400 truncate">{song.artist}</p>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                  <button 
                    onClick={(e) => toggleLike(e, song)}
                    className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isLiked(song.videoId) ? 'text-[#FF2D55]' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked(song.videoId) ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={(e) => handleOpenModal(e, song)}
                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-white mb-2">No results found for "{searchQuery}"</h3>
            <p className="text-gray-400">Please make sure your words are spelled correctly or use less or different keywords.</p>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold mb-6 tracking-tight">Browse Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                { name: 'Pop', color: 'bg-pink-500' },
                { name: 'Hip-Hop', color: 'bg-orange-500' },
                { name: 'Rock', color: 'bg-red-500' },
                { name: 'Latin', color: 'bg-yellow-500' },
                { name: 'Dance', color: 'bg-green-500' },
                { name: 'R&B', color: 'bg-blue-500' },
                { name: 'Country', color: 'bg-indigo-500' },
                { name: 'Indie', color: 'bg-purple-500' }
              ].map((genre, i) => (
                <div 
                  key={genre.name}
                  className={`aspect-[4/3] rounded-2xl p-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform shadow-sm ${genre.color}`}
                >
                  <h4 className="text-[17px] font-bold text-white z-10 relative">{genre.name}</h4>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-black/20 rounded-full blur-xl" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <AddToPlaylistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        song={selectedSong} 
      />
    </div>
  );
}

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

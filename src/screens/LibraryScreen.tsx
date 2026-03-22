import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePlaylistStore } from '../store/playlistStore';
import { usePlayerStore, Song } from '../store/playerStore';
import { useLikedSongsStore } from '../store/likedSongsStore';
import { Plus, Play, Heart, ListMusic, MoreVertical, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import AddToPlaylistModal from '../components/AddToPlaylistModal';

export default function LibraryScreen() {
  const { user } = useAuthStore();
  const { playlists, loadPlaylists, createPlaylist, deletePlaylist } = usePlaylistStore();
  const { likedSongs, loadLikedSongs, unlikeSong } = useLikedSongsStore();
  const { play, addToQueue } = usePlayerStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'playlists' | 'liked'>('playlists');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'liked') {
      setActiveTab('liked');
    } else {
      setActiveTab('playlists');
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      loadPlaylists();
      loadLikedSongs();
    }
  }, [user, loadPlaylists, loadLikedSongs]);

  const handleCreatePlaylist = async () => {
    const name = prompt('Enter playlist name:');
    if (name) {
      await createPlaylist(name);
    }
  };

  const handleOpenModal = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    setSelectedSong(song);
    setIsModalOpen(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Your Library</h2>
        <p className="text-gray-400 mb-8 text-center max-w-md">Sign in to create playlists, save your favorite songs, and track your listening history.</p>
        <button 
          onClick={() => useAuthStore.getState().loginWithGoogle()}
          className="bg-[#FF2D55] text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-4">
          <button 
            onClick={() => { setActiveTab('playlists'); navigate('/library'); }}
            className={`text-2xl font-bold tracking-tight transition-colors ${activeTab === 'playlists' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Playlists
          </button>
          <button 
            onClick={() => { setActiveTab('liked'); navigate('/library?tab=liked'); }}
            className={`text-2xl font-bold tracking-tight transition-colors ${activeTab === 'liked' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Liked Songs
          </button>
        </div>

        {activeTab === 'playlists' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={handleCreatePlaylist}
                className="flex items-center gap-2 bg-[#1C1C1E] hover:bg-[#2C2C2E] text-[#FF2D55] px-4 py-2 rounded-full font-medium transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" /> New Playlist
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              <div 
                onClick={() => navigate('/library?tab=liked')}
                className="aspect-square rounded-2xl bg-gradient-to-br from-[#FF2D55] to-[#FF375F] p-4 flex flex-col justify-end relative group cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white/20" />
                <h4 className="text-[17px] font-bold text-white z-10">Liked Songs</h4>
                <p className="text-[13px] text-white/80 z-10">{likedSongs.length} songs</p>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (likedSongs.length > 0) {
                        play(likedSongs[0]);
                        likedSongs.slice(1).forEach(song => addToQueue(song));
                      }
                    }}
                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all"
                  >
                    <Play className="w-5 h-5 fill-current ml-1" />
                  </button>
                </div>
              </div>

              {playlists.map((playlist, i) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                  className="aspect-square rounded-2xl bg-[#1C1C1E] border border-white/5 p-4 flex flex-col justify-end relative group cursor-pointer hover:bg-[#2C2C2E] transition-colors shadow-sm"
                >
                  <div className="absolute top-4 right-4 z-20">
                    <button 
                      onClick={(e) => { e.stopPropagation(); deletePlaylist(playlist.id); }}
                      className="p-1 rounded-full bg-black/20 text-white/50 hover:text-white hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <ListMusic className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white/10" />
                  <h4 className="text-[17px] font-bold text-white z-10 truncate">{playlist.name}</h4>
                  <p className="text-[13px] text-gray-400 z-10">{playlist.songs?.length || 0} songs</p>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (playlist.songs && playlist.songs.length > 0) {
                          play(playlist.songs[0]);
                          playlist.songs.slice(1).forEach(song => addToQueue(song));
                        }
                      }}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all"
                    >
                      <Play className="w-5 h-5 fill-current ml-1" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'liked' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {likedSongs.length > 0 ? (
              <div className="flex flex-col gap-2">
                {likedSongs.map((song, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={song.videoId}
                    className="group flex items-center gap-4 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => { play(song); addToQueue(song); }}
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
                        onClick={(e) => { e.stopPropagation(); unlikeSong(song.videoId); }}
                        className="p-2 rounded-full hover:bg-white/10 text-[#FF2D55] transition-colors"
                      >
                        <Heart className="w-5 h-5 fill-current" />
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
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <Heart className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Songs you like will appear here</h3>
                <p className="text-gray-400">Save songs by tapping the heart icon.</p>
                <button 
                  onClick={() => navigate('/search')}
                  className="mt-8 bg-[#FF2D55] text-white px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform"
                >
                  Find songs
                </button>
              </div>
            )}
          </motion.div>
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

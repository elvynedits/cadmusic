import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlaylistStore, Playlist } from '../store/playlistStore';
import { usePlayerStore, Song } from '../store/playerStore';
import { useLikedSongsStore } from '../store/likedSongsStore';
import { Play, Heart, Plus, MoreHorizontal, ArrowLeft, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import AddToPlaylistModal from '../components/AddToPlaylistModal';

export default function PlaylistScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playlists, removeSongFromPlaylist } = usePlaylistStore();
  const { play, addToQueue } = usePlayerStore();
  const { isLiked, likeSong, unlikeSong } = useLikedSongsStore();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  useEffect(() => {
    if (id) {
      const found = playlists.find(p => p.id === id);
      setPlaylist(found || null);
    }
  }, [id, playlists]);

  if (!playlist) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <p className="text-gray-400">Playlist not found.</p>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      play(playlist.songs[0]);
      playlist.songs.slice(1).forEach(song => addToQueue(song));
    }
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

  const handleRemoveSong = (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    removeSongFromPlaylist(playlist.id, songId);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32">
      {/* Header */}
      <div className="relative pt-20 pb-8 px-4 sm:px-6 overflow-hidden">
        {/* Blurred Background */}
        {playlist.songs && playlist.songs.length > 0 && (
          <div 
            className="absolute inset-0 z-0 opacity-30 blur-3xl scale-110"
            style={{
              backgroundImage: `url(${playlist.songs[0].thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A] z-0" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-6 relative z-10">
          <button 
            onClick={() => navigate('/library')}
            className="absolute top-6 left-4 sm:left-6 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors backdrop-blur-md"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="w-48 h-48 sm:w-60 sm:h-60 bg-[#1C1C1E] shadow-2xl rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
            {playlist.songs && playlist.songs.length > 0 ? (
              <img src={playlist.songs[0].thumbnail} alt="Playlist Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-6xl">🎵</span>
            )}
          </div>
          
          <div className="flex-1">
            <p className="text-[13px] font-semibold uppercase tracking-widest text-[#FF2D55] mb-2">Playlist</p>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 tracking-tight truncate">{playlist.name}</h1>
            <p className="text-gray-300 text-[15px] font-medium">
              {playlist.songs?.length || 0} songs
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-4">
        <button 
          onClick={handlePlayAll}
          disabled={!playlist.songs || playlist.songs.length === 0}
          className="w-14 h-14 rounded-full bg-[#FF2D55] text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
        >
          <Play className="w-6 h-6 fill-current ml-1" />
        </button>
      </div>

      {/* Song List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {playlist.songs && playlist.songs.length > 0 ? (
          <div className="flex flex-col gap-2">
            {playlist.songs.map((song, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={song.videoId}
                className="group flex items-center gap-4 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => { play(song); addToQueue(song); }}
              >
                <div className="w-8 text-center text-gray-500 text-[15px] font-medium group-hover:hidden">{i + 1}</div>
                <div className="w-8 flex justify-center hidden group-hover:flex">
                  <Play className="w-4 h-4 text-white fill-current" />
                </div>

                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                  <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                    onClick={(e) => handleRemoveSong(e, song.videoId)}
                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-[#FF2D55] transition-colors"
                    title="Remove from playlist"
                  >
                    <Trash2 className="w-5 h-5" />
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
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">It's a bit empty here...</h3>
            <p className="text-gray-400">Let's find some songs for your playlist.</p>
            <button 
              onClick={() => navigate('/search')}
              className="mt-6 bg-[#FF2D55] text-white px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform"
            >
              Search for songs
            </button>
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

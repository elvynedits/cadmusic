import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus } from 'lucide-react';
import { usePlaylistStore } from '../store/playlistStore';
import { Song } from '../store/playerStore';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
}

export default function AddToPlaylistModal({ isOpen, onClose, song }: AddToPlaylistModalProps) {
  const { playlists, addSongToPlaylist } = usePlaylistStore();

  if (!song) return null;

  const handleAddToPlaylist = (playlistId: string) => {
    addSongToPlaylist(playlistId, song);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#1A1A1A] rounded-2xl shadow-2xl overflow-hidden border border-white/10"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Add to Playlist</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {playlists.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">You don't have any playlists yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => handleAddToPlaylist(playlist.id)}
                      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group text-left"
                    >
                      <div>
                        <h3 className="text-white font-medium group-hover:text-[#00D4FF] transition-colors">{playlist.name}</h3>
                        <p className="text-sm text-gray-400">{playlist.songs?.length || 0} songs</p>
                      </div>
                      <Plus className="w-5 h-5 text-gray-400 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

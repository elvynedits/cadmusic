import React, { useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { useLikedSongsStore } from '../../store/likedSongsStore';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Volume2, MessageCircle, Heart, Share, MoreHorizontal, ListMusic, Mic2 } from 'lucide-react';
import { motion, AnimatePresence, usePanGesture } from 'motion/react';
import AddToPlaylistModal from '../AddToPlaylistModal';

export default function PlayerExpanded() {
  const { currentSong, isPlaying, play, pause, next, previous, volume, setVolume, isExpanded, setIsExpanded, currentTime, duration, seek } = usePlayerStore();
  const { isLiked, likeSong, unlikeSong } = useLikedSongsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  if (!currentSong) return null;

  const toggleLike = () => {
    if (isLiked(currentSong.videoId)) {
      unlikeSong(currentSong.videoId);
    } else {
      likeSong(currentSong);
    }
  };

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-[#121212] flex flex-col"
        >
          {/* Background Gradient */}
          <div 
            className="absolute inset-0 opacity-60 blur-[120px] transform-gpu pointer-events-none"
            style={{
              background: `radial-gradient(circle at top right, ${currentSong.thumbnail} 0%, transparent 70%)`,
            }}
          />
          
          <div className="relative z-10 flex flex-col h-full p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-8">
              <button onClick={() => setIsExpanded(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </button>
              <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <MoreHorizontal className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center overflow-hidden min-h-0">
              <motion.div
                drag="y"
                dragConstraints={{ top: -300, bottom: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y < -100) setShowLyrics(true);
                  else if (info.offset.y > 100) setShowLyrics(false);
                }}
                className="relative flex-1 flex flex-col justify-center"
              >
                <AnimatePresence mode="wait">
                  {!showLyrics ? (
                    <motion.div
                      key="album-art"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex flex-col items-center"
                    >
                      <img
                        src={currentSong.thumbnail}
                        alt={currentSong.title}
                        className="w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-2xl shadow-2xl mb-6 sm:mb-10"
                        referrerPolicy="no-referrer"
                      />
                      <div className="w-full text-left max-w-[280px] sm:max-w-[320px]">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 truncate">{currentSong.title}</h2>
                        <p className="text-lg sm:text-xl text-white/60 truncate">{currentSong.artist}</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="lyrics"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="h-[300px] sm:h-[400px] overflow-y-auto text-white/50 text-xl sm:text-2xl font-bold space-y-4 sm:space-y-6 text-center"
                    >
                      <p>Wait till I get my hands on him</p>
                      <p className="text-white">I'ma tell him off</p>
                      <p>too for how long</p>
                      <p>he kept me</p>
                      <p>waiting,</p>
                      <p>anticipating</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="mt-auto pb-4 sm:pb-8">
              <div className="w-full mb-4 sm:mb-6">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[10px] sm:text-xs text-white/50 mt-2 font-medium">
                  <span>{formatTime(currentTime)}</span>
                  <span>-{formatTime((duration || 0) - currentTime)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between w-full mb-4 sm:mb-6">
                <button onClick={previous} className="text-white hover:text-white/70 transition-colors">
                  <SkipBack className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
                </button>
                <button
                  onClick={() => isPlaying ? pause() : play(currentSong)}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-black flex items-center justify-center transition-transform hover:scale-105"
                >
                  {isPlaying ? <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" /> : <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />}
                </button>
                <button onClick={next} className="text-white hover:text-white/70 transition-colors">
                  <SkipForward className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
                </button>
              </div>

              <div className="flex items-center justify-between w-full">
                <button onClick={() => setShowLyrics(!showLyrics)} className={`p-2 rounded-full transition-colors ${showLyrics ? 'bg-white/20 text-white' : 'text-white/50'}`}>
                  <Mic2 className="w-5 h-5" />
                </button>
                <button onClick={toggleLike} className={`p-2 rounded-full transition-colors ${isLiked(currentSong.videoId) ? 'text-[#FF2D55]' : 'text-white/50'}`}>
                  <Heart className={`w-5 h-5 ${isLiked(currentSong.videoId) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
          <AddToPlaylistModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            song={currentSong} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

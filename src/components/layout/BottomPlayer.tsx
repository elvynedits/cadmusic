import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { Play, Pause, SkipForward } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export default function BottomPlayer() {
  const { currentSong, isPlaying, play, pause, next, setIsExpanded, streamUrl, currentTime, duration, setCurrentTime, setDuration } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && streamUrl) {
        audioRef.current.play().catch(e => {
          console.error('Playback failed:', e);
          toast.error('Failed to play audio');
          pause();
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, streamUrl]);

  useEffect(() => {
    // Reset audio when song changes
    if (audioRef.current && streamUrl) {
      audioRef.current.src = streamUrl;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [streamUrl]);

  if (!currentSong) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-[80px] left-3 right-3 sm:left-auto sm:right-auto sm:w-[360px] sm:bottom-20 z-50 flex justify-center pointer-events-none"
    >
      <div 
        onClick={() => setIsExpanded(true)}
        className="w-full max-w-[360px] bg-white/60 dark:bg-[#1C1C1E]/60 backdrop-blur-3xl rounded-[24px] p-2 pr-4 shadow-xl border border-white/20 dark:border-white/10 flex items-center gap-3 cursor-pointer pointer-events-auto transition-transform hover:scale-[1.02]"
      >
        {streamUrl && (
          <audio
            ref={audioRef}
            src={streamUrl}
            onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            onEnded={next}
            onError={(e) => {
              console.error('Audio playback error');
              toast.error('Failed to play song. It might be restricted or unavailable.');
              pause();
            }}
            autoPlay
          />
        )}

        <img
          src={currentSong.thumbnail}
          alt={currentSong.title}
          className="w-10 h-10 rounded-[16px] object-cover shadow-sm"
          referrerPolicy="no-referrer"
        />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <span className="text-[9px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Now Playing
          </span>
          <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
            {currentSong.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isPlaying) {
                pause();
              } else {
                play(currentSong);
              }
            }}
            className="text-gray-900 dark:text-white hover:scale-110 transition-transform"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              next();
            }} 
            className="text-gray-900 dark:text-white hover:scale-110 transition-transform"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

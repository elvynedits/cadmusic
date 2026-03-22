import { create } from 'zustand';
import toast from 'react-hot-toast';
import { useRecentlyPlayedStore } from './recentlyPlayedStore';
import { auth } from '../firebase';
import { saveToHistory } from '../services/firebaseService';

export interface Song {
  videoId: string;
  title: string;
  artist: string;
  duration: number;
  thumbnail: string;
}

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isExpanded: boolean;
  streamUrl: string | null;
  
  play: (song?: Song) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  setPlaybackRate: (rate: number) => void;
  addToQueue: (song: Song) => void;
  clearQueue: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsExpanded: (expanded: boolean) => void;
  fetchStreamUrl: (videoId: string) => Promise<void>;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  playbackRate: 1,
  isExpanded: false,
  streamUrl: null,

  play: async (song?: Song) => {
    if (song) {
      set({ currentSong: song, isPlaying: true, currentTime: 0, streamUrl: null });
      useRecentlyPlayedStore.getState().addRecentSong(song);
      if (auth.currentUser) {
        saveToHistory(auth.currentUser.uid, song).catch(console.error);
      }
      await get().fetchStreamUrl(song.videoId);
    } else {
      // If no song provided, resume the current song
      const { currentSong: current } = get();
      if (current) {
        set({ isPlaying: true });
      }
    }
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  next: async () => {
    const { queue, currentIndex } = get();
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextSong = queue[nextIndex];
      set({ currentIndex: nextIndex, currentSong: nextSong, isPlaying: true, currentTime: 0, streamUrl: null });
      if (auth.currentUser) {
        saveToHistory(auth.currentUser.uid, nextSong).catch(console.error);
      }
      await get().fetchStreamUrl(nextSong.videoId);
    }
  },

  previous: async () => {
    const { queue, currentIndex, currentTime } = get();
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevSong = queue[prevIndex];
      set({ currentIndex: prevIndex, currentSong: prevSong, isPlaying: true, currentTime: 0, streamUrl: null });
      if (auth.currentUser) {
        saveToHistory(auth.currentUser.uid, prevSong).catch(console.error);
      }
      await get().fetchStreamUrl(prevSong.videoId);
    }
  },

  seek: (time) => set({ currentTime: time }),
  setVolume: (vol) => set({ volume: vol }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  
  addToQueue: (song) => {
    set((state) => ({ queue: [...state.queue, song] }));
    toast.success('Added to queue');
  },
  clearQueue: () => set({ queue: [], currentIndex: -1 }),
  
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setIsExpanded: (expanded) => set({ isExpanded: expanded }),

  fetchStreamUrl: async (videoId) => {
    try {
      const { API_ENDPOINTS } = await import('../config/apiConfig');
      const response = await fetch(API_ENDPOINTS.STREAM(videoId));
      if (!response.ok) {
        throw new Error(`Stream fetch failed: ${response.status}`);
      }
      const data = await response.json();
      if (data.streamUrl) {
        set({ streamUrl: data.streamUrl });
      } else {
        set({ streamUrl: null });
        toast.error('Could not get stream URL');
      }
    } catch (error) {
      console.error('Error fetching stream:', error);
      set({ streamUrl: null });
    }
  },
}));

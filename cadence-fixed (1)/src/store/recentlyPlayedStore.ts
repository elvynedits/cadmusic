import { create } from 'zustand';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { useAuthStore } from './authStore';
import { Song } from './playerStore';

interface RecentlyPlayedState {
  recentSongs: Song[];
  isLoading: boolean;
  loadRecentSongs: () => void;
  addRecentSong: (song: Song) => Promise<void>;
}

export const useRecentlyPlayedStore = create<RecentlyPlayedState>((set, get) => ({
  recentSongs: [],
  isLoading: false,

  loadRecentSongs: () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });
    const recentRef = collection(db, 'users', user.uid, 'recentlyPlayed');
    const q = query(recentRef, orderBy('playedAt', 'desc'), limit(20));
    
    onSnapshot(q, (snapshot) => {
      const recentSongs = snapshot.docs.map(doc => doc.data() as Song);
      set({ recentSongs, isLoading: false });
    });
  },

  addRecentSong: async (song) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const songRef = doc(db, 'users', user.uid, 'recentlyPlayed', song.videoId);
      await setDoc(songRef, {
        ...song,
        playedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to add recent song:', error);
    }
  },
}));

import { create } from 'zustand';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from './authStore';
import { Song } from './playerStore';
import toast from 'react-hot-toast';

interface LikedSongsState {
  likedSongs: Song[];
  isLoading: boolean;
  loadLikedSongs: () => void;
  likeSong: (song: Song) => Promise<void>;
  unlikeSong: (videoId: string) => Promise<void>;
  isLiked: (videoId: string) => boolean;
}

export const useLikedSongsStore = create<LikedSongsState>((set, get) => ({
  likedSongs: [],
  isLoading: false,

  loadLikedSongs: () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });
    const likedRef = collection(db, 'users', user.uid, 'likedSongs');
    
    onSnapshot(likedRef, (snapshot) => {
      const likedSongs = snapshot.docs.map(doc => doc.data() as Song);
      set({ likedSongs, isLoading: false });
    });
  },

  likeSong: async (song) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      toast.error('Please sign in to like songs');
      return;
    }

    try {
      const songRef = doc(db, 'users', user.uid, 'likedSongs', song.videoId);
      await setDoc(songRef, {
        ...song,
        likedAt: serverTimestamp(),
      });
      toast.success('Added to Liked Songs');
    } catch (error) {
      console.error('Failed to like song:', error);
      toast.error('Failed to like song');
    }
  },

  unlikeSong: async (videoId) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const songRef = doc(db, 'users', user.uid, 'likedSongs', videoId);
      await deleteDoc(songRef);
      toast.success('Removed from Liked Songs');
    } catch (error) {
      console.error('Failed to unlike song:', error);
      toast.error('Failed to unlike song');
    }
  },

  isLiked: (videoId) => {
    return get().likedSongs.some(song => song.videoId === videoId);
  },
}));

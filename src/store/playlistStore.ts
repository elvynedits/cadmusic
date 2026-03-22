import { create } from 'zustand';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuthStore } from './authStore';
import { Song } from './playerStore';
import toast from 'react-hot-toast';

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  createdAt: any;
}

interface PlaylistState {
  playlists: Playlist[];
  isLoading: boolean;
  loadPlaylists: () => void;
  createPlaylist: (name: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, song: Song) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [],
  isLoading: false,

  loadPlaylists: () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });
    const playlistsRef = collection(db, 'users', user.uid, 'playlists');
    
    onSnapshot(playlistsRef, (snapshot) => {
      const playlists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Playlist[];
      set({ playlists, isLoading: false });
    });
  },

  createPlaylist: async (name) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const playlistsRef = collection(db, 'users', user.uid, 'playlists');
      await addDoc(playlistsRef, {
        name,
        songs: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Playlist created');
    } catch (error) {
      console.error('Failed to create playlist:', error);
      toast.error('Failed to create playlist');
    }
  },

  deletePlaylist: async (id) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const playlistRef = doc(db, 'users', user.uid, 'playlists', id);
      await deleteDoc(playlistRef);
      toast.success('Playlist deleted');
    } catch (error) {
      console.error('Failed to delete playlist:', error);
      toast.error('Failed to delete playlist');
    }
  },

  addSongToPlaylist: async (playlistId, song) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const playlistRef = doc(db, 'users', user.uid, 'playlists', playlistId);
      await updateDoc(playlistRef, {
        songs: arrayUnion(song),
        updatedAt: serverTimestamp(),
      });
      toast.success('Added to playlist');
    } catch (error) {
      console.error('Failed to add song to playlist:', error);
      toast.error('Failed to add to playlist');
    }
  },

  removeSongFromPlaylist: async (playlistId, songId) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const playlist = get().playlists.find(p => p.id === playlistId);
      if (!playlist) return;

      const songToRemove = playlist.songs.find(s => s.videoId === songId);
      if (!songToRemove) return;

      const playlistRef = doc(db, 'users', user.uid, 'playlists', playlistId);
      await updateDoc(playlistRef, {
        songs: arrayRemove(songToRemove),
        updatedAt: serverTimestamp(),
      });
      toast.success('Removed from playlist');
    } catch (error) {
      console.error('Failed to remove song from playlist:', error);
      toast.error('Failed to remove from playlist');
    }
  },
}));

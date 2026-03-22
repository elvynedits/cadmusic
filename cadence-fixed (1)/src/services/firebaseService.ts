import { db, doc, setDoc, arrayUnion, updateDoc, serverTimestamp } from '../firebase';
import { Song } from '../store/playerStore';

export const saveToHistory = async (userId: string, song: Song) => {
  try {
    const historyRef = doc(db, 'users', userId, 'history', song.videoId);
    await setDoc(historyRef, {
      ...song,
      playedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
};

export const addToPlaylist = async (userId: string, playlistId: string, song: Song) => {
  try {
    const playlistRef = doc(db, 'users', userId, 'playlists', playlistId);
    await updateDoc(playlistRef, {
      songs: arrayUnion(song),
    });
  } catch (error) {
    console.error('Failed to add to playlist:', error);
  }
};

export const createPlaylist = async (userId: string, name: string) => {
  try {
    const playlistRef = doc(db, 'users', userId, 'playlists', name);
    await setDoc(playlistRef, {
      name,
      songs: [],
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to create playlist:', error);
  }
};

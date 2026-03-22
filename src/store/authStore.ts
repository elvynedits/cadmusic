import { create } from 'zustand';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, db, doc, setDoc, serverTimestamp } from '../services/firebase';
import toast from 'react-hot-toast';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuthListener: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      toast.success(`Welcome, ${user.displayName}!`);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Failed to sign in');
    }
  },

  loginWithEmail: async (email, pass) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      toast.success(`Welcome back!`);
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  },

  signupWithEmail: async (email, pass, name) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const user = result.user;
      
      await updateProfile(user, { displayName: name });
      
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        displayName: name,
        email: user.email,
        photoURL: null,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      toast.success(`Welcome, ${name}!`);
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast.error(error.message || 'Failed to sign up');
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, isAuthenticated: false });
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to sign out');
    }
  },

  initAuthListener: () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        set({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },
}));

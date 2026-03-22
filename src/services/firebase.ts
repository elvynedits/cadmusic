import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, onSnapshot, addDoc, deleteDoc, updateDoc, serverTimestamp, orderBy, limit, arrayUnion, arrayRemove } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBiedxRcuQAzF6s_v3AVVcH9plBM1RQD30",
  authDomain: "candenceapp.firebaseapp.com",
  projectId: "candenceapp",
  storageBucket: "candenceapp.firebasestorage.app",
  messagingSenderId: "803206832785",
  appId: "1:803206832785:web:a7de402087335478761530",
  measurementId: "G-W2FMR90B58"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, doc, setDoc, getDoc, collection, query, where, onSnapshot, addDoc, deleteDoc, updateDoc, serverTimestamp, orderBy, limit, arrayUnion, arrayRemove };

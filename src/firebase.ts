import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0024092746",
  appId: "1:175173697304:web:b2dce80d284e8e34a7686d",
  apiKey: "AIzaSyDapIGbG8HzxUNb6BYPxlDVheTOi-twNt0",
  authDomain: "gen-lang-client-0024092746.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-jme3labaghitjme3-a174a9a9-df89-4fb5-9fa4-5e32ddfbba4f",
  storageBucket: "gen-lang-client-0024092746.firebasestorage.app",
  messagingSenderId: "175173697304",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-jme3labaghitjme3-a174a9a9-df89-4fb5-9fa4-5e32ddfbba4f");

const provider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);

export { onAuthStateChanged, doc, getDoc, setDoc, updateDoc };

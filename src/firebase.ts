import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAb7TVdIQjgr20qCJYSC1w-N9n0btYAVY8',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'maison-noir-a6dbb.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'maison-noir-a6dbb',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'maison-noir-a6dbb.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '703287771935',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:703287771935:web:bd609c1bce39beb5f2262a',
};

const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);
const app = isFirebaseConfigured
  ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig))
  : null;

export const auth: Auth | null = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

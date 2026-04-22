import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Prevent crashes during build-time prerendering if env vars are missing
const app = !getApps().length
  ? (firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null)
  : getApp();

// USE THIS EXACT LINE. Map the specific AI-Studio provisioned Database ID.
const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || "(default)";

export const db = app ? getFirestore(app, databaseId) : null as unknown as Firestore;
export const storage = app ? getStorage(app) : null as unknown as FirebaseStorage;
export const auth = app ? getAuth(app) : null as unknown as Auth;

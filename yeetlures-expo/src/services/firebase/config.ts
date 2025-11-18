/**
 * Firebase Configuration
 *
 * IMPORTANT: Replace these values with your actual Firebase project credentials
 * Get these from Firebase Console > Project Settings > General > Your apps
 */

import { FirebaseOptions } from '@react-native-firebase/app';

export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'your-app.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your-app.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: process.env.FIREBASE_APP_ID || 'YOUR_APP_ID',
};

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  CATCHES: 'catches',
  LURES: 'lures',
  USER_LURE_NOTES: 'user_lure_notes',
  FORECASTS: 'forecasts',
  ANALYTICS: 'analytics',
} as const;

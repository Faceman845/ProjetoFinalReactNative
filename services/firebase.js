import { initializeApp } from 'firebase/app';
//@ts-ignore
import {getReactNativePersistence} from '@firebase/auth/dist/rn/index.js'

import {initializeAuth} from 'firebase/auth';

import { GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBNCp4Mc1oR71VXxFzHyusqFrICkSkNOys",
  authDomain: "projetofinal-a7ab8.firebaseapp.com",
  projectId: "projetofinal-a7ab8",
  storageBucket: "projetofinal-a7ab8.firebasestorage.app",
  messagingSenderId: "600857194384",
  appId: "1:600857194384:web:5c2a19120ba8f928aa4d15"
};

const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { googleProvider, db };
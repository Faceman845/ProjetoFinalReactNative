import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth } from 'firebase/auth';
//@ts-ignore
import { getReactNativePersistence as rnPersistence } from '@firebase/auth/dist/rn/index.js';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNCp4Mc1oR71VXxFzHyusqFrICkSkNOys",
  authDomain: "projetofinal-a7ab8.firebaseapp.com",
  projectId: "projetofinal-a7ab8",
  storageBucket: "projetofinal-a7ab8.firebasestorage.app",
  messagingSenderId: "600857194384",
  appId: "1:600857194384:web:5c2a19120ba8f928aa4d15"
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = initializeAuth(app, {
  persistence: rnPersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);


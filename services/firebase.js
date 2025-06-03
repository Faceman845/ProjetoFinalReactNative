import { initializeApp, getApp, getApps} from 'firebase/app';
import {getReactNativePersistence} from '@firebase/auth/dist/rn/index.js'
import {initializeAuth, signInWithCredential, GoogleAuthProvider} from 'firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
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

let app;
if (getApps().length === 0) { // Linha 18 (aproximadamente) que estava causando o erro
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

console.log("Firebase App instance:", app);
console.log("ReactNativeAsyncStorage object:", ReactNativeAsyncStorage);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export {GoogleSignin, statusCodes, signInWithCredential, googleProvider, db };
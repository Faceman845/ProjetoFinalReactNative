import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBNCp4Mc1oR71VXxFzHyusqFrICkSkNOys",
  authDomain: "projetofinal-a7ab8.firebaseapp.com",
  projectId: "projetofinal-a7ab8",
  storageBucket: "projetofinal-a7ab8.firebasestorage.app",
  messagingSenderId: "600857194384",
  appId: "1:600857194384:web:5c2a19120ba8f928aa4d15"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };
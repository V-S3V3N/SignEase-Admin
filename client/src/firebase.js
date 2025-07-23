// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDykh9KlYbsHlM9o6eRFsclHSP3EyCY5ck",
  authDomain: "signease-8dcd6.firebaseapp.com",
  projectId: "signease-8dcd6",
  storageBucket: "signease-8dcd6.firebasestorage.app",
  messagingSenderId: "455122959166",
  appId: "1:455122959166:web:78d17587bbbb4b86820a6f",
  measurementId: "G-FMV14NVE77"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { auth, db, analytics, storage };

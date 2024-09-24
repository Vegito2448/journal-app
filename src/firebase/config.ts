import 'firebase/auth';
import 'firebase/firestore';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3hgRC3YTEmF--B-0-rXVhwswCug7YowQ",
  authDomain: "sql-practice-98b86.firebaseapp.com",
  projectId: "sql-practice-98b86",
  storageBucket: "sql-practice-98b86.appspot.com",
  messagingSenderId: "563996578550",
  appId: "1:563996578550:web:c0ed9b2f532fcf0a3012d7",
  measurementId: "G-G60V7JE2BR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
auth.useDeviceLanguage();
const googleProvider = new GoogleAuthProvider();

googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

export {
  app, auth, db,
  googleProvider
};


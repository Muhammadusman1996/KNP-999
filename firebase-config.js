// Firebase Console > Project settings > Your apps > Web app
// Paste your Firebase web app config here. Do not put admin passwords in this file.

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
window.KNP_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDfWumo5MJODWla0d37_bxzOod1SGXkQAc",
  authDomain: "knp-999.firebaseapp.com",
  projectId: "knp-999",
  storageBucket: "knp-999.firebasestorage.app",
  messagingSenderId: "321761157666",
  appId: "1:321761157666:web:e3f7670d0397652107a07b",
  measurementId: "G-QV30BR2QHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);{
  apiKey: "AIzaSyDfWumo5MJODWla0d37_bxzOod1SGXkQAc",
  authDomain: "knp-999.firebaseapp.com",
  projectId: "knp-999",
  storageBucket: "knp-999.firebasestorage.app",
  messagingSenderId: "321761157666",
  appId: "1:321761157666:web:e3f7670d0397652107a07b",
  measurementId: "G-QV30BR2QHG"
};
// Enter the same email used for the admin account in Firebase Authentication.
window.KNP_ADMIN_EMAIL = "ms603329@gmail.com";

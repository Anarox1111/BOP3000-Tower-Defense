// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4BuxypZ2hZymL4XofVxHjzCIvbXorD8s",
  authDomain: "bop3000-7cd12.firebaseapp.com",
  projectId: "bop3000-7cd12",
  storageBucket: "bop3000-7cd12.firebasestorage.app",
  messagingSenderId: "388606687101",
  appId: "1:388606687101:web:0895edb33a8ae5679f7e14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 
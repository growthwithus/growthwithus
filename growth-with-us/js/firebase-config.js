// ------------------------------------------------------------------
// GANTI seluruh isi firebaseConfig ini dengan config dari project
// Firebase kamu sendiri (Firebase Console > Project settings > SDK setup).
// ------------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsmAShGtgJRxi1hqBwvzJIgAq2Rov_qA8",
  authDomain: "growthwithus-1de72.firebaseapp.com",
  projectId: "growthwithus-1de72",
  storageBucket: "growthwithus-1de72.firebasestorage.app",
  messagingSenderId: "974071737958",
  appId: "1:974071737958:web:eb606856f7dd55baf5c7a7"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

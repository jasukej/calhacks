// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVH6OBtQvn9UPhwNNpucoJvpuxszvlapc",
  authDomain: "calhacks2024-95001.firebaseapp.com",
  projectId: "calhacks2024-95001",
  storageBucket: "calhacks2024-95001.appspot.com",
  messagingSenderId: "125003080400",
  appId: "1:125003080400:web:8dd19c570697edf4bb34d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
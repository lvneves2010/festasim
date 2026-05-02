// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASSVbUIDd94jtKDubCmvZc1yaAYK-Xes4",
  authDomain: "festasim-11275.firebaseapp.com",
  projectId: "festasim-11275",
  storageBucket: "festasim-11275.firebasestorage.app",
  messagingSenderId: "1036624108542",
  appId: "1:1036624108542:web:9ae64563560848d7b27eaf"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
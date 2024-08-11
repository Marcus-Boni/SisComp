import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDvx3fuROEyOB5RBGhIlfXdP8qsPPVkdVI",
  authDomain: "sistema-de-compras-6c186.firebaseapp.com",
  projectId: "sistema-de-compras-6c186",
  storageBucket: "sistema-de-compras-6c186.appspot.com",
  messagingSenderId: "707656035264",
  appId: "1:707656035264:web:bf25583aee86054d843625"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

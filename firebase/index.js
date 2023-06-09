import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, EmailAuthProvider, updatePassword, reauthenticateWithCredential } from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocs, collection, query, where, orderBy, addDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyDjoPIRG6i3-eI7W9YFuXickVTk552GuHw',
    authDomain: 'englishlearning-21a2d.firebaseapp.com',
    databaseURL: 'https://englishlearning-21a2d-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'englishlearning-21a2d',
    storageBucket: 'englishlearning-21a2d.appspot.com',
    messagingSenderId: '29748544211',
    appId: '1:29748544211:web:192618e1d880d26ea58a26',
    measurementId: 'G-GFQMF3YHEC',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default db;
export { auth, doc, getDoc, getDocs, collection, query, where, orderBy, addDoc, signInWithEmailAndPassword, EmailAuthProvider, updatePassword, reauthenticateWithCredential, deleteDoc };

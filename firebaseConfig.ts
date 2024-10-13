import { getApps , initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword  } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAuth, initializeAuth, getReactNativePersistence, onAuthStateChanged } from "firebase/auth";
import {getDatabase} from 'firebase/database';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';




// Вставьте сюда ваши настройки Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCYAHPzi9DmqNfwS2XdmanoO3GbmNWs8B4',
  authDomain: 'petmeetar.firebaseapp.com',
  databaseURL: "https://petmeetar-default-rtdb.firebaseio.com",
  projectId: 'petmeetar',
  storageBucket: 'petmeetar.appspot.com',
  messagingSenderId: '938397449309',
  appId: '1:938397449309:web:2e2ea7017eedbfbb4be1b4',
  measurementId: 'G-9WZKC73K6S',
};
let app;
let auth;

if (getApps().length===0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  app = getApps()[0];
  auth = getAuth(app);
}
const database = getDatabase(app);
const storage = getStorage(app);
export {database, storage };

export const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
    console.log('User signed outd!')
  } catch (error) {
    throw error;
  }
}

export const createUserWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await firebaseCreateUserWithEmailAndPassword(auth, email, password);
    //await sendEmailVerification(userCredential.user);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const onAuthStateChangedListener = (callback: any) => {
  onAuthStateChanged(auth, callback);
};



export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.idToken;
    if (!idToken) {
      throw new Error('No ID token returned');
    }
    const credential = GoogleAuthProvider.credential(idToken);
    return await signInWithCredential(auth, credential);
  } catch (error) {
    throw error;
  }
};

export const getCurrentAuth = () => {
  return auth;
}
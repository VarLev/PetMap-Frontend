import { initializeApp } from 'firebase/app';
import {signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeAuth, getReactNativePersistence } from "firebase/auth";


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


const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const createUserWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await firebaseCreateUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

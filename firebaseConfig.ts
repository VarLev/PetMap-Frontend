import { getApps , initializeApp } from 'firebase/app';
import { getStorage, ref, listAll, getDownloadURL, StorageReference} from 'firebase/storage';
import { signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword, sendEmailVerification  } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAuth, initializeAuth, getReactNativePersistence, onAuthStateChanged } from "firebase/auth";
import {getDatabase} from 'firebase/database';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import i18n from './i18n';




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
    // После входа можно проверить подтверждена ли почта:
    if (!userCredential.user.emailVerified) {
     // Повторно отправляем письмо для подтверждения
     await resendVerificationEmail();

     // Выбрасываем ошибку, которую можно перехватить в UI и показать сообщение пользователю
     throw new Error( i18n.t('verification')  );
    }
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
    await sendEmailVerification(userCredential.user);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const resendVerificationEmail = async () => {
  const currentUser = auth.currentUser;
  if (currentUser && !currentUser.emailVerified) {
    await sendEmailVerification(currentUser);
  }
};


export const onAuthStateChangedListener = (callback: any) => {
  onAuthStateChanged(auth, callback);
};



export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo?.data?.idToken;
    if (!idToken) {
      throw new Error('Не возможно войти через Google аккаунт, попробуйте другие способы хода.');
    }
    const credential = GoogleAuthProvider.credential(idToken);
    return await signInWithCredential(auth, credential);
  } catch (error) {
    throw error;
  }
};

export const getFoldersInDirectory = async (directory: string): Promise<StorageReference[]> => {
  const directoryRef = ref(storage, directory);
  const folderList = await listAll(directoryRef);
  return folderList.prefixes;
};


export const getFilesInDirectory = async (directory: string): Promise<string[]> => {
  try {
    const directoryRef = ref(storage, directory);
    const folderList = await listAll(directoryRef);
    // Фильтруем только файлы с расширением .html
    const htmlFiles = folderList.items.filter((itemRef) => itemRef.name.endsWith('.html'));

    // Получаем содержимое каждого html файла
    const fileContents = await Promise.all(
      htmlFiles.map(async (itemRef) => {
        const fileUrl = await getDownloadURL(itemRef); // Получаем ссылку для доступа к файлу
        const response = await fetch(fileUrl); // Загружаем файл
        if (!response.ok) {
          throw new Error(`Ошибка загрузки файла ${itemRef.name}: ${response.statusText}`);
        }
        return await response.text(); // Возвращаем содержимое файла как текст
      })
    );

    return fileContents;
  } catch (error) {
    throw error;
  }
};

export const getFileUrl = async (filePath: string): Promise<string> => {
  const fileRef = ref(storage, filePath);
  return await getDownloadURL(fileRef);
};

export const getCurrentAuth = () => {
  return auth;
}
import { getApps , initializeApp } from 'firebase/app';
import { getStorage, ref, listAll, getDownloadURL, StorageReference} from 'firebase/storage';
import { signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, OAuthProvider  } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAuth, initializeAuth, getReactNativePersistence, onAuthStateChanged } from "firebase/auth";
import {getDatabase, onDisconnect, serverTimestamp, set, ref as refDb, update} from 'firebase/database';
import { GoogleAuthProvider, signInWithCredential, OAuthProvider as AppleAuthProvider } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; 

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
const firestore = getFirestore(app);

export {database, storage };

export const syncPetProfile = async (pet: any): Promise<void> => {
  try {
    // Преобразуем объект в "plain" объект
    const plainPet = JSON.parse(JSON.stringify(pet));
    const petDocRef = doc(firestore, 'petProfiles', plainPet.id);
    await setDoc(petDocRef, plainPet, { merge: true });
  } catch (error) {
    console.error('Ошибка при синхронизации профиля питомца в Firestore:', error);
    throw error;
  }
};

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


export const signInWithApple = async () => {
  try {
    
    // Если expo-apple-authentication поддерживает передачу nonce, можно его передать:
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      // nonce: rawNonce, // раскомментируйте, если библиотека поддерживает nonce
    });

    if (!appleCredential.identityToken) {
      throw new Error('Apple Sign-In не удался: отсутствует identity token.');
    }

    const provider = new OAuthProvider('apple.com');

    // Вызов метода credential на экземпляре, а не на классе!
    const firebaseCredential = provider.credential({
      idToken: appleCredential.identityToken,
      // Если nonce не используется, можно передать undefined.
      // Обычно в rawNonce следует передать сгенерированный nonce, если вы его используете.
      rawNonce: appleCredential.authorizationCode || undefined,
    });



    return await signInWithCredential(auth, firebaseCredential);
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

/**
 * Установить статус пользователя (online/offline) и прописать время последнего изменения.
 */
export const setUserStatus = async (userId: string, status: boolean) => {
  try {
    const userStatusRef = refDb(database, `users/${userId}`);
    await update(userStatusRef, {
      isOnline: status,
      lastSeen: serverTimestamp(),
    });
  } catch (error) {
    // Обрабатываем ошибку при установке статуса
    console.error('Ошибка при установке статуса пользователя:', error);
    throw error;
  }
};

/**
 * Инициализировать onDisconnect для пользователя – 
 * если соединение с Firebase прервётся (пользователь убил приложение, потерял интернет),
 * то статус автоматически станет "offline".
 */
export const initOnDisconnect = async (userId: string) => {
  try {
    const userStatusRef = refDb(database, `users/${userId}`);
    await onDisconnect(userStatusRef).update({
      isOnline: false,
      lastSeen: serverTimestamp(),
    });
  } catch (error) {
    console.error('Ошибка при инициализации onDisconnect:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

export const getCurrentAuth = () => {
  return auth;
}
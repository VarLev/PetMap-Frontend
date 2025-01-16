import { database } from '@/firebaseConfig';
import { get, ref } from 'firebase/database';

export async function getUserStatus(userId: string): Promise<boolean | undefined> {
  try {
    const userRef = ref(database, `users/${userId}/isOnline`);
    const snapshot = await get(userRef);
    let status: boolean = false;

    if (snapshot.exists()) {
      const val = snapshot.val();
      status = val === true;
    }

    return status;
  } catch (error) {
    console.error('Ошибка при получении статуса пользователя:', error);
  }
}

export async function getUserLastOnlineStatus(userId: string): Promise<Date | undefined> {
  try {
    const userRef = ref(database, `users/${userId}/lastSeen`);
    const snapshot = await get(userRef);
    let status: Date | undefined = undefined;

    if (snapshot.exists()) {
      const val = snapshot.val();
      status = val ? new Date(val) : undefined;
    }

    return status;
  } catch (error) {
    console.error('Ошибка при получении статуса пользователя:', error);
  }
}
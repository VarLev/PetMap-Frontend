import { database } from "@/firebaseConfig";
import { get, ref } from "firebase/database";

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
import { database } from '@/firebaseConfig';
import i18n from '@/i18n';
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

export async function getUserLastOnlineStatus(userId: string): Promise<string | undefined> {
  try {
    const userRef = ref(database, `users/${userId}/lastSeen`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      // Данных нет, возвращаем undefined
      return undefined;
    }

    const val = snapshot.val();
    if (!val) {
      return undefined;
    }

    // Парсим дату последней активности
    const lastSeenDate = new Date(val);

    // Возвращаем отформатированную строку вида "X ч. Y мин. назад" или "X дн. назад"
    return formatLastSeenTime(lastSeenDate);
  } catch (error) {
    console.error('Ошибка при получении статуса пользователя:', error);
    return undefined;
  }
}

function formatLastSeenTime(lastSeenDate: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - lastSeenDate.getTime();

  // Если по каким-то причинам дата больше текущей (из будущего) или совпадает, отображаем "Только что"
  if (diffMs <= 0) {
    return `${i18n.t('chat.time.lessThanAMinute')}`;
  }
  
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 60) {
    // Менее 60 минут назад
    return `${diffMinutes} ${i18n.t('chat.time.m')}. ${i18n.t('chat.time.ago')}`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    // Менее 24 часов назад
    const remainMinutes = diffMinutes % 60;
    return `${diffHours} ${i18n.t('chat.time.h')}. ${remainMinutes} ${i18n.t('chat.time.m')}. ${i18n.t('chat.time.ago')}`;
  }

  // Больше суток — показываем количество дней
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ${i18n.t('chat.time.d')}. ${i18n.t('chat.time.ago')}`;
}
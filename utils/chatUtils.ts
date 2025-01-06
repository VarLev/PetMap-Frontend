import UserStore from '@/stores/UserStore';

export function generateChatIdForTwoUsers(user1Id: string, user2Id: string): string {
  return [user1Id, user2Id].sort().join('_');
}

export function generateChatData(chatId: string, currentUserId: string, otherUserId: string, otherUser: IChatUser, lastMessages?:string): IChat {
  return {
    id: chatId,
    participants: [
      {
        key: currentUserId,
        value: {
          id: currentUserId,
          name: UserStore.currentUser?.name ?? '',
          thumbnailUrl: UserStore.currentUser?.thumbnailUrl ?? '',
          isOnline: UserStore.currentUser?.isOnline ?? false,
        },
      },
      {
        key: otherUserId,
        value: {
          id: otherUserId,
          name: otherUser?.name ?? '',
          thumbnailUrl: otherUser?.thumbnailUrl ?? '',
          isOnline: otherUser?.thumbnailUrl ? true : false,
        },
      },
    ],
    lastMessage: lastMessages,
    lastCreatedAt: Date.now(),
  };
}

export async function translateText(originalText: string, targetLanguage: string) {
  try {
    // Ваш реальный API или библиотека для перевода:
    // Здесь — просто «фиктивная» реализация
    const response = await fetch('https://my-translate-api.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: originalText,
        target: targetLanguage,
      }),
    })
    const data = await response.json()
    return data?.translatedText ?? originalText
  } catch (error) {
    console.error('Ошибка при переводе:', error)
    return originalText // при ошибке возвращаем оригинал
  }
}
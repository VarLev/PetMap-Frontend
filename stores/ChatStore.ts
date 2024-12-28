import { makeAutoObservable, runInAction } from 'mobx';
import { database } from '@/firebaseConfig';
import { ref, get, push, update, query, orderByChild, onValue, remove, set } from 'firebase/database';
import userStore from '@/stores/UserStore';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { randomUUID } from 'expo-crypto';
import { getPushTokenFromServer, sendPushNotification } from '@/hooks/notifications';
import { IUserChat } from '@/dtos/Interfaces/user/IUserChat';
import apiClient from '@/hooks/axiosConfig';
import { handleAxiosError } from '@/utils/axiosUtils';
import mapStore from './MapStore';
import { ChatType } from '@/dtos/enum/ChatType';


class ChatStore {
  chats: IChat[] = [];
  sortedChats: IChat[] = [];
  messages: MessageType.Any[] = [];
  lastMessage: { [key: string]: string } = {};
  lastSeen: { [key: string]: number } = {};
  allMessages: MessageType.Any[] = [];
  advrtId: string | undefined = '';
  lastCreatedAt: { [key: string]: number } = {};
  blacklist: { userId: string; blockedUserId: string }[] = [];
  currentChatOtherUserFmcToken: string | undefined = '';

  constructor() {
    makeAutoObservable(this);
  }

  setOtherUserFmcToken(token: string | null | undefined) {
    runInAction(() => {
      this.currentChatOtherUserFmcToken = token ?? '';
    });
  }

  getOtherUserFmcToken() {
    return this.currentChatOtherUserFmcToken;
  }

  async fetchChats() {
    const userId = userStore.currentUser?.id;
    if (!userId) return;

    const chatsRef = ref(database, 'chats');
    const snapshot = await get(chatsRef);

    if (!snapshot.exists()) {
      runInAction(() => {
        this.chats = [];
      });
      return;
    }

    const data = snapshot.val(); // Объект, где ключ — chatId
    const chatsList: IChat[] = [];

    // 1. Собираем все otherUserId, чтобы одним запросом загрузить инфо о пользователях
    const userIdsNeeded = new Set<string>();

    for (const chatId in data) {
      const chatData = data[chatId];
      if (!chatData?.participants) continue;

      const participantIds = Object.keys(chatData.participants);
      const otherUserId = participantIds.find((id) => id !== userId);
      const currentUserId = participantIds.find((id) => id === userId);

      // Если действительно чат для текущего пользователя
      // (вместо этого можно сделать условие participantIds.includes(userId))
      if (currentUserId && otherUserId) {
        userIdsNeeded.add(otherUserId);
      }
    }

    // 2. ОДИН запрос ко всем юзерам
    const usersRef = ref(database, 'users');
    const usersSnap = await get(usersRef);
    const usersData = usersSnap.exists() ? usersSnap.val() : {};

    // 3. Формируем массив чатов (IChat), собирая данные о каждом участнике
    for (const chatId in data) {
      const chatData = data[chatId] as IChat;
      const participantsObj = chatData?.participants;
      if (!participantsObj) continue;

      // Переводим объект участников в массив { key, value: IChatUser }
      const participantsArray: IChat['participants'] = Object.entries(participantsObj).map(
        ([participantId, rawParticipant]) => {
          const userFromUsersData = usersData[participantId] || {};
          const chatUser: IChatUser = {
            id: participantId,
            firstName: userFromUsersData.firstName,
            imageUrl: userFromUsersData.imageUrl,
            isOnline: userFromUsersData.isOnline || false,
            lastSeen: userFromUsersData.lastSeen || 0,
            lastMessage: userFromUsersData.lastMessage || '',
          };
          return {
            key: participantId,
            value: chatUser,
          };
        }
      );
      // Собираем сам чат
      const chatObj: IChat = {
        id: chatId,
        lastMessage: chatData.lastMessage || '',
        lastCreatedAt: chatData.lastCreatedAt || 0,
        participants: participantsArray,
        lastSeen: chatData.lastSeen || 0,
      };
      chatsList.push(chatObj);
      // Если у вас в chatStore есть какое-то поле lastMessage, обновляем
      runInAction(() => {
        chatStore.lastMessage[chatId] = chatData.lastMessage || 'Нет сообщений';
      });
    }


    // 4. Обновляем стейт в одном runInAction (чтобы MobX среагировал разом)
    runInAction(() => {
      this.chats = chatsList;
    });
  }

  async createNewChat(otherUser: IUserChat): Promise<string | undefined> {
    const userId = userStore.currentUser?.id;
    if (!userId) {
      console.error('Текущий пользователь не найден');
      return;
    }
  
    // 1. Сортируем массив [userId, otherUser.id] (например, по алфавиту),
    // чтобы получить единый chatId для пары пользователей.
    const sortedIds = [userId, otherUser.id].sort();
    const chatId = sortedIds.join('_'); 
    // Пример: если userId='abc', otherUser.id='xyz', то chatId='abc_xyz'.
  
    // 2. Проверяем, существует ли уже такой чат
    const chatRef = ref(database, `chats/${chatId}`);
    const snapshot = await get(chatRef);
    if (snapshot.exists()) {
      // Чат уже есть, просто возвращаем его
      console.log(`Чат ${chatId} уже существует`);
      return chatId;
    }
  
    // 3. Чата нет, создаём новую запись
    const now = Date.now();
    
    // Заполняем данные о каждом участнике
    // Предположим, вы храните IChatUser в /chats/.../participants/{userId}
    const currentUserData = {
      id: userId,
      firstName: userStore.currentUser?.name ?? 'NoName',
      imageUrl: userStore.currentUser?.thumbnailUrl ?? '',
      isOnline: true,  // или другая логика
      lastSeen: now,
      lastMessage: '',
      fmcToken: userStore.currentUser?.fmcToken ?? null,
    };
    console.log('currentUserData:', currentUserData);
  
    const otherUserData = {
      id: otherUser.id,
      firstName: otherUser.name ?? 'NoName',
      imageUrl: otherUser.thumbnailUrl ?? '',
      isOnline: false, // пока не знаем, он не в сети
      lastSeen: 0,
      lastMessage: '',
      fmcToken: otherUser.fmcToken ?? null,
    };

    console.log('otherUserData:', otherUserData);
  
    const newChatData = {
      lastMessage: '',
      lastCreatedAt: now,
      participants: {
        [userId]: currentUserData,
        [otherUser.id]: otherUserData,
      },
    };
  
    // Формируем объект для пакетного обновления
    const updates: Record<string, unknown> = {};
    updates[`chats/${chatId}`] = newChatData;
  
    try {
      // 4. Сохраняем новый чат в Firebase
      await update(ref(database), updates);
      console.log(`Создан новый чат: ${chatId}`);
    } catch (error) {
      console.error('Ошибка при создании чата:', error);
      throw error;
    }
  
    // При желании, сразу же обновляем локальный стор
    runInAction(() => {
      // Если вам нужно добавить созданный чат в this.chats
      // (зависит от того, как устроен ваш ChatStore)
      // Пример:
      // chatStore.chats.push({
      //   id: chatId,
      //   lastMessage: '',
      //   lastCreatedAt: now,
      //   participants: [
      //     { key: userId, value: currentUserData },
      //     { key: otherUser.id, value: otherUserData },
      //   ],
      //   lastSeen: 0,
      // });
  
      // Или если нужно сохранить fmcToken другого пользователя в сторе
      // chatStore.setOtherUserFmcToken(otherUser.fmcToken);
    });
  
    // 5. Возвращаем chatId
    return chatId;
  }

  async getChatById(chatId: string): Promise<IChat | null> {
    try {
      const chatRef = ref(database, `chats/${chatId}`);
      const snapshot = await get(chatRef);
      
      if (!snapshot.exists()) {
        console.log(`Чат с id "${chatId}" не найден`);
        return null;
      }
  
      // Просто возвращаем «как есть» данные из Firebase
      return snapshot.val();
    } catch (error) {
      console.error('Ошибка при получении чата:', error);
      return null;
    }
  }

  async sendInviteMessage(chatId: string, otherUser: IUserChat) {
    const userId = userStore.currentUser?.id;
    // const recipientExpoPushToken = userStore.users.find(
    //   (user) => user.id === otherUser.id
    // )?.fmcToken;
    if (!userId) return;

    const initialMessage: MessageType.Custom = {
      id: randomUUID(), // используем уникальный идентификатор для сообщения
      author: {
        id: userId,
      },
      createdAt: Date.now(),
      type: 'custom',
      metadata: {
        userId: userStore.currentUser?.id,
        userName: userStore.currentUser?.name,
        userAvatar: userStore.currentUser?.thumbnailUrl,
        advrtId: mapStore.currentWalkId,
        visibleToUserId: otherUser.id, // ID пользователя, которому нужно показать кнопки
      },
    };
    console.log('initialMessage:', mapStore.currentWalkId);

    try {
      await push(ref(database, `messages/${chatId}`), initialMessage);
      console.log('Initial message sent');
      await update(ref(database, `chats/${chatId}`), {
        lastCreatedAt: initialMessage.createdAt,
      });
      await this.setLastSeen();
      console.log('Last seen updated');
      runInAction(() => {
        chatStore.lastCreatedAt[chatId] = Date.now();
      });

      console.log('otherUser:', otherUser);
      if (otherUser.fmcToken) {
        await sendPushNotification(otherUser.fmcToken, 'Приглашение на прогулку', userStore?.currentUser?.name ?? 'Пользователь', {
          chatId,
        });
      }
    } catch (error) {
      console.error('Error sending initial message:', error);
    }
  }

  async sendMessage(chat: IChat, text: string): Promise<{chatType :ChatType, thisChatId:string} | undefined> {
    // 1. Проверяем, авторизован ли текущий пользователь
    const userId = userStore.getCurrentUserId();
    if (!userId) {
      console.error('User is not defined');
      return;
    }
  
    // 2. Проверяем, есть ли чат в локальном сторе
    let existingChat = this.chats.find((c) => c.id === chat?.id);
    let chatId = chat?.id??'';
    let chatType = ChatType.ChatExists;
    // 3. Если чата нет — создаём новый (только если participants заполнены)
    if (!existingChat) {
      // Убедимся, что у chat есть участники (а не пустой объект/массив)
      if (!chat.participants || chat.participants.length < 2) {
        console.error('Невозможно создать чат: отсутствуют участники');
        return;
      }
      const user = await userStore.getUserById(chat.participants.find((p) => p.key!==userId)?.value?.id!);

      if (!user) {
        console.error('Не удалось найти другого участника');
        return;
      }

      const otherUdserChat: IUserChat = {
        id: user.id,
        name: user.name,
        thumbnailUrl: user.thumbnailUrl,
        fmcToken: user.fmcToken,
      }

      const newChatId = await this.createNewChat(otherUdserChat);
      if (!newChatId) {
        console.error('Не удалось создать чат');
        return;
      }
      chatId = newChatId;
      // Обновим локально
      runInAction(() => {
        this.chats.push({
          ...chat,
          id: newChatId,
        });
        existingChat = this.chats[this.chats.length - 1];
      });
      chatType = ChatType.NewChat;
    }
  
    // 4. Находим «другого» участника (кроме текущего пользователя)
    const otherParticipant = (existingChat || chat).participants.find(
      (p) => p.key !== userId
    );
    if (!otherParticipant) {
      console.error('Не удалось найти другого участника');
      return;
    }
    const otherUser = otherParticipant.value;
  
    // Генерируем ключ для сообщения
    const newMessageKey = push(ref(database, `messages/${chatId}`)).key;
    if (!newMessageKey) {
      console.error('Ошибка при генерации ключа для сообщения');
      return;
    }
  
    // 5. Формируем само сообщение
    const now = Date.now();
    const textMessage: MessageType.Text = {
      id: newMessageKey,
      type: 'text',
      text,
      createdAt: now,
      author: {
        id: userId,
        firstName: userStore.currentUser?.name ?? 'Anonymous',
        imageUrl: userStore.currentUser?.thumbnailUrl ?? '',
      },
    };
  
    // 6. Пакетное обновление Firebase
    const updates: Record<string, unknown> = {};
    updates[`messages/${chatId}/${newMessageKey}`] = textMessage;
    updates[`chats/${chatId}/lastMessage`] = text;
    updates[`chats/${chatId}/lastCreatedAt`] = now;
    updates[`users/${userId}/lastSeen`] = now; // если нужно
  
    try {
      await update(ref(database), updates);
    } catch (error) {
      console.error('Ошибка при пакетном обновлении:', error);
      return ;
    }
  
    // 7. Отправляем пуш, если у другого пользователя есть токен
    const fcmToken = this.getOtherUserFmcTokenByUserId(otherUser.id!);
    if (fcmToken) {
      try {
        sendPushNotification(fcmToken, 'Новое сообщение', text, { chatId });
      } catch (err) {
        console.error('Ошибка при отправке пуш-уведомления:', err);
      }
    }
  
    // 8. Обновляем локальный стор (MobX)
    runInAction(() => {
      this.updateChat(chatId, {
        lastMessage: text,
        lastCreatedAt: now,
      });
      this.lastSeen[userId] = now;
      this.lastMessage[chatId] = text;
    });

    return {chatType, thisChatId: chatId};
  }

  updateChat(chatId: string, updatedFields: Partial<IChat>) {
    runInAction(() => {
      const chatIndex = this.chats.findIndex((chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        this.chats[chatIndex] = {
          ...this.chats[chatIndex],
          ...updatedFields,
        };
        //this.sortChats(); // Сортируем чаты после обновления
      }
    });
  }

  fetchMessages(chatId: string) {
    const messagesRef = ref(database, `messages/${chatId}`);
    const q = query(messagesRef, orderByChild('createdAt'));

    onValue(q, (snapshot) => {
      const messagesList: MessageType.Any[] = [];
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        //console.log('childSnapshot.key:', childSnapshot.key);
        if (message && childSnapshot.key) {
          messagesList.push({
            id: childSnapshot.key, // Убедитесь, что `id` существует
            author: message.author,
            createdAt: message.createdAt,
            metadata: message.metadata,
            text: message.text,
            type: message.type,
          });
        } else {
          console.error('Invalid message data or missing key:', childSnapshot.val());
        }
      });
      runInAction(() => {
        this.messages = messagesList.reverse(); // Обратный порядок для правильного отображения
      });
    });
  }




  async getOtherUserFmcTokenByUserId(otherUserId: string): Promise<string | null> {
    const userRef = ref(database, `users/${otherUserId}`);
    const snapshot = await get(userRef);
    console.log('snapshot:', snapshot.val());
    if (snapshot.exists()) {
      return snapshot.val().fmcToken;
    }else{
      return null;
    }
  }

 
  getLastMessageFromStore(chatId: string) {
    const message = this.lastMessage[chatId];
    return message;
  }

  async getLastMessage(chatId: string) {
    try {
      const data = ref(database, `chats/${chatId}`);
      const snapshot = await get(data);

      if (snapshot.exists()) {
        const lastMessage = snapshot.val().lastMessage;

        // Обновляем MobX-стор
        runInAction(() => {
          this.lastMessage[chatId] = lastMessage;
        });

        return lastMessage;
      } else {
        console.warn(`No last message found for chat ID: ${chatId}`);
        return null; // Если данных нет
      }
    } catch (error) {
      console.error(`Failed to fetch last message for chat ID: ${chatId}`, error);
      throw error; // Перебрасываем ошибку, если нужно обрабатывать её выше
    }
  }

  async getLastSeen(userId: string) {
    const data = ref(database, `users/${userId}`);
    const snapshot = await get(data);
    if (snapshot.exists()) {
      const lastSeen = snapshot.val().lastSeen;

      runInAction(() => {
        this.lastSeen[userId] = lastSeen;
      });
      return lastSeen;
    }
  }

  async setLastSeen() {
    const userId = userStore.currentUser?.id;
    if (!userId) {
      console.error('User is not defined');
      return;
    }
    const timestamp = Date.now();
    await update(ref(database, `users/${userId}`), {
      lastSeen: timestamp,
    });

    runInAction(() => {
      this.lastSeen[userId] = timestamp;
    });
  }

  async deleteChat(chatId: string) {
    const userId = userStore.currentUser?.id;
    if (!userId) {
      console.error('User is not defined');
      return;
    }
    console.log('chatId:', chatId);
    const chatRef = ref(database, `chats/${chatId}`);
    const messagesRef = ref(database, `messages/${chatId}`);

    try {
      await remove(chatRef);
      await remove(messagesRef);
      runInAction(() => {
        this.chats = this.chats.filter((chat) => chat.id !== chatId);
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  }

  async loadBlacklist() {
    try {
      const userId = userStore.currentUser?.id; // Текущий пользователь
      if (!userId) {
        console.error('Пользователь не авторизован');
        return;
      }

      // Получаем ссылку на blacklist в базе данных
      const blacklistRef = ref(database, `/blacklist`);
      const snapshot = await get(blacklistRef);

      if (snapshot.exists()) {
        // Указываем тип данных, возвращаемых Firebase
        const data = snapshot.val() as Record<string, Record<string, boolean>>;

        // Преобразуем данные из объекта в массив
        const formattedBlacklist = Object.entries(data).flatMap(([userId, blockedUsers]) =>
          Object.keys(blockedUsers).map((blockedUserId) => ({
            userId,
            blockedUserId,
          }))
        );

        // Обновляем состояние в MobX
        runInAction(() => {
          this.blacklist = formattedBlacklist;
        });

        console.log('Blacklist loaded successfully:', this.blacklist);
      } else {
        console.log('Blacklist is empty in the database.');
        runInAction(() => {
          this.blacklist = [];
        });
      }
    } catch (error) {
      console.error('Ошибка при загрузке blacklist:', error);
    }
  }

  async addBlacklist(otherUserId: string) {
    try {
      const userId = userStore.currentUser?.id; // Текущий пользователь
      if (!userId) {
        console.error('Пользователь не авторизован');
        return;
      }

      const data = this.chats;
      if (!data || data.length === 0) {
        console.error('Чат не найден');
        return;
      }

      const blockUserId = otherUserId; // Другой пользователь
      if (!blockUserId) {
        console.error('ID пользователя для блокировки не найдено');
        return;
      }

      // Текущий пользователь блокирует другого пользователя
      await set(ref(database, `/blacklist/${userId}/${blockUserId}`), true);
      console.log('Пользователь заблокирован:', blockUserId);

      runInAction(() => {
        this.blacklist.push({ userId, blockedUserId: blockUserId });
        console.log('blockstate state', this.blacklist);
      });
    } catch (error) {
      console.error('Ошибка при добавлении пользователя в черный список:', error);
    }
  }

  async removeBlacklist(otherUserId: string) {
    try {
      const userId = userStore.currentUser?.id; // Текущий пользователь
      if (!userId) {
        console.error('Пользователь не авторизован');
        return;
      }

      const data = this.chats;
      if (!data || data.length === 0) {
        console.error('Чат не найден');
        return;
      }

      const blockUserId = otherUserId; // Другой пользователь
      if (!blockUserId) {
        console.error('ID пользователя для разблокировки не найдено');
        return;
      }

      // Текущий пользователь разблокирует другого пользователя
      await remove(ref(database, `/blacklist/${userId}/${blockUserId}`));

      runInAction(() => {
        // Удаляем запись из массива
        this.blacklist = this.blacklist.filter((entry) => !(entry.userId === userId && entry.blockedUserId === blockUserId));
        console.log('Updated blacklist state:', this.blacklist);
      });
    } catch (error) {
      console.error('Ошибка при удалении пользователя из черного списка:', error);
    }
  }

  checkBlocked(userId: string, otherUserId: string): boolean {
    return this.blacklist.some((entry) => entry.userId === userId && entry.blockedUserId === otherUserId);
  }

  checkIfIBlocked(otherUserId: string): boolean {
    const userId = userStore.currentUser?.id; // Текущий пользователь
    if (!userId || !otherUserId) return false;

    // Ищем в массиве запись, где другой пользователь заблокировал текущего
    return this.blacklist.some((entry) => entry.userId === otherUserId && entry.blockedUserId === userId);
  }

  setSelectedAdvrtId(id: string) {
    runInAction(() => {
      this.advrtId = id;
    });
  }

  getSortChats() {
    // Сортируем чаты по lastCreatedAt, чтобы самые последние чаты были в начале
    const sortedChats = chatStore.chats.slice().sort((a, b) => b.lastCreatedAt - a.lastCreatedAt);
    // Обновляем ChatStore.sortedChats с использованием runInAction
    runInAction(() => {
      this.sortedChats = sortedChats;
    });

    return sortedChats;
  }

  clearMessages() {
    runInAction(() => {
      this.messages = [];
    });
  }
}

const chatStore = new ChatStore();
export default chatStore;


// async declineUserJoinWalk(walkId: string, userId: string) {
//   try {
//     const response = await apiClient.patch(`walkadvrt/decline/${walkId}`, {
//       userId: userId,
//     });
//     return response.data;
//   } catch (error) {
//     return handleAxiosError(error);
//   }
// }

// async acceptUserJoinWalk(walkId: string, userId: string, chatId: string) {
//   try {
//     const userId2fmcToken = await getPushTokenFromServer(userId);
//     if (userId2fmcToken) {
//       await sendPushNotification(
//         userId2fmcToken,
//         'Ваш запрос на присоединение к прогулке принят',
//         userStore?.currentUser?.name ?? 'Пользователь',
//         { chatId }
//       );
//     }
//     const response = await apiClient.patch(`walkadvrt/accept/${walkId}`, {
//       userId: userId, // Передаем как объект
//     });
//     return response.data;
//   } catch (error) {
//     return handleAxiosError(error);
//   }
// }


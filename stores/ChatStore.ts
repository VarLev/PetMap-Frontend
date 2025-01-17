import { makeAutoObservable, runInAction } from 'mobx';
import { database } from '@/firebaseConfig';
import { ref, get, push, update, query, orderByChild, onValue, remove, set, off, equalTo } from 'firebase/database';
import userStore from '@/stores/UserStore';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { getPushTokenFromServer, sendPushNotification } from '@/hooks/notifications';

import { ChatType, SendMessageOptions } from '@/dtos/enum/ChatType';
import { generateChatIdForTwoUsers } from '@/utils/chatUtils';
import { getUserStatus } from '@/utils/userUtils';
import apiClient from '@/hooks/axiosConfig';


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

  subscribeToChats() {
    // Предположим, что в `chats/{chatId}/participants/{userId}` хранится значение true,
    // если пользователь `userId` участвует в чате.
    const chatsRef = ref(database, 'chats');
    
    // Формируем запрос: ищем все записи, где `participants/{userId} === true`
    const userChatsQuery = query(
      chatsRef,
      orderByChild(`participants/${userStore.getCurrentUserId()}`),
      equalTo(true)
    );

    // Подписка на изменения
    const callback = async (snapshot: any) => {
      if (!snapshot.exists()) {
        runInAction(() => {
          this.chats = [];
        });
        return;
      }
    
      const data = snapshot.val();
      const updatedChats = this.transformChats(data);
    
      // 1. Получаем всех пользователей одной выборкой
      const usersSnap = await get(ref(database, 'users'));
      const allUsers = usersSnap.exists() ? usersSnap.val() : {};
    
      // 2. Пробегаемся по updatedChats и для каждого участника подтягиваем name, avatar
      updatedChats.forEach((chat) => {
        chat.participants.forEach((p) => {
          const userId = p.key;
          const uData = allUsers[userId];
          if (uData) {
            p.value.name = uData.name || '';
            p.value.avatar = uData.avatar || '';
            // ... и так далее
          }
        });
      });
    
      runInAction(() => {
        this.chats = updatedChats;
      });
    };

    // Ставим слушатель
    onValue(userChatsQuery, callback);

    // Возвращаем функцию «отписки»
    return () => {
      off(userChatsQuery, 'value', callback);
    };
  }

  transformChats(data: any): IChat[] {
    const result: IChat[] = [];
    for (const chatId in data) {
      const chatData = data[chatId];
      // ... Собираем IChat
      // например:
      result.push({
        id: chatId,
        lastMessage: chatData.lastMessage || '',
        lastCreatedAt: chatData.lastCreatedAt || 0,
        participants: this.transformParticipants(chatData.participants), 
        lastSeen: chatData.lastSeen,
      });
    }
    return result;
  }

  // Аналогичный метод для участников
  transformParticipants(participantsObj: any): { key: string; value: IChatUser }[] {
    if (!participantsObj) return [];
    return Object.keys(participantsObj).map((userId) => {
      // participantsObj[userId] == true  (если вы храните только ID)
      return {
        key: userId,
        value: {
          id: userId,
          name: '', // потом, если нужно, подтягиваете из /users и т.д.
        } as IChatUser,
      };
    });
  }


  async fetchChats() {
    const userId = userStore.currentUser?.id;
    if (!userId) return;
  
    const chatsRef = ref(database, 'chats');
    const snapshot = await get(chatsRef);
  
    // Если чатов нет
    if (!snapshot.exists()) {
      runInAction(() => {
        this.chats = [];
      });
      return;
    }
  
    // Все чаты в виде объекта: { [chatId]: { participants: { userA: true, userB: true }, ... } }
    const data = snapshot.val();
    const chatsList: IChat[] = [];
  
    // Шаг 2. Делаем один запрос ко всем пользователям
    const usersRef = ref(database, 'users');
    const usersSnap = await get(usersRef);
    const usersData = (usersSnap.exists() ? usersSnap.val() : {});
  
    // Шаг 3. Формируем массив чатов, собирая данные о каждом участнике
    for (const chatId in data) {
      const chatData = data[chatId]; // сырые данные чата
      if (!chatData?.participants) continue;
      const participantIds = Object.keys(chatData.participants);
      //console.log('Пользователь', userId);
      //console.log('Участники чата', chatId, participantIds);
      if (!participantIds.includes(userId)) {
        //console.log('Пропускаем чат, так как текущий пользователь не участвует');
        // пропускаем чат, если этот юзер не участвует
        continue;
      }
  
      // Преобразуем { userA: true, userB: true } в [{ key, value: IChatUser }, ...]
      const participantsArray: { key: string; value: IChatUser }[] = Object.keys(chatData.participants).map(
        (participantId) => {
          // Пытаемся найти данные пользователя в usersData
          const rawUserData = usersData[participantId] || {};
  
          const chatUser: IChatUser = {
            id: participantId,
            name: rawUserData.name ?? '...', // или rawUserData.firstName
            avatar: rawUserData.avatar ?? '',
            isOnline: rawUserData.isOnline ?? false,
            lastSeen: rawUserData.lastSeen ?? 0,
            lastMessage: rawUserData.lastMessage ?? '',
          };
  
          return {
            key: participantId,
            value: chatUser,
          };
        }
      );
  
      // Собираем сам чат в формате IChat
      const chatObj: IChat = {
        id: chatId,
        lastMessage: chatData.lastMessage || '',
        lastCreatedAt: chatData.lastCreatedAt || 0,
        participants: participantsArray,
        lastSeen: chatData.lastSeen || 0,
      };
  
      chatsList.push(chatObj);
  
      // Если нужно сохранить lastMessage отдельно, можно это делать прямо здесь
      // либо после цикла, но обычно достаточно один раз
      runInAction(() => {
        chatStore.lastMessage[chatId] = chatData.lastMessage || 'Нет сообщений';
      });
    }
  
    // Шаг 4. Обновляем стейт в одном runInAction (чтобы MobX среагировал разом)
    runInAction(() => {
      const pinnedChat = chatsList.find(chat => chat.id === process.env.EXPO_PUBLIC_AI_CHAT_ID!);
      const otherChats = chatsList.filter(chat => chat.id !== process.env.EXPO_PUBLIC_AI_CHAT_ID!);
      this.chats = pinnedChat ? [pinnedChat, ...otherChats] : otherChats;
    });
  }

  async createNewChat(otherUser: IChatUser): Promise<string | undefined> {
    const userId = userStore.currentUser?.id;
    if (!userId) {
      console.error('Текущий пользователь не найден');
      return;
    }
  
    // 1. Генерируем единый chatId для пары пользователей (по алфавиту)
    const chatId = generateChatIdForTwoUsers(userId, otherUser.id);
  
    // 2. Проверяем, существует ли уже такой чат
    const chatRef = ref(database, `chats/${chatId}`);
    const snapshot = await get(chatRef);
    if (snapshot.exists()) {
      // Чат уже есть, возвращаем его
      console.log(`Чат ${chatId} уже существует`);
      return chatId;
    }
  
    // 3. Чата нет, создаём новую запись
    const now = Date.now();
  
    // В chats/... сохраняем только ID участников
    const newChatData = {
      id: chatId,
      lastSeen: 0,
      lastMessage: '',
      lastCreatedAt: now,
      participants: {
        [userId]: true,
        [otherUser.id]: true,
      },
    };
  
    // Дополнительно, если нужно обновить /users для обоих
    // (В реальном приложении часто вы уже храните данные в /users/{userId},
    //  но если хотите заодно убедиться, что там «свежая» информация — можно так)
    const currentUserUpdates = {
      name: userStore.currentUser?.name ?? 'NoName',
      avatar: userStore.currentUser?.thumbnailUrl ?? '',
      lastSeen: now,
      fmcToken: userStore.currentUser?.fmcToken ?? null,
      // при желании можно хранить isOnline, etc.
    };
  
    const otherUserUpdates = {
      name: otherUser.name ?? 'NoName',
      avatar: otherUser.avatar ?? '',
      lastSeen: 0,    // например, 0, если мы не знаем, когда он был онлайн
      fmcToken: otherUser.fmcToken ?? null,
      // ...
    };

    console.log('currentUserUpdates:', currentUserUpdates);
    console.log('otherUserUpdates:', otherUserUpdates);
  
    // Подготавливаем объект для пакетного обновления
    const updates: Record<string, unknown> = {};
  
    // Сохраняем «минимальные» данные о чате
    updates[`chats/${chatId}`] = newChatData;
  
    // Обновляем или создаём запись в /users/${userId} и /users/${otherUser.id}
    // (при желании, если нужна актуализация именно в этот момент)
    updates[`users/${userId}/name`] = currentUserUpdates.name ?? 'NoName';
    updates[`users/${userId}/avatar`] = currentUserUpdates.avatar ?? '';
    updates[`users/${userId}/fmcToken`] = currentUserUpdates.fmcToken ?? null;

    updates[`users/${otherUser.id}/name`] = otherUserUpdates.name;
    updates[`users/${otherUser.id}/avatar`] = otherUserUpdates.avatar;
    updates[`users/${otherUser.id}/fmcToken`] = otherUserUpdates.fmcToken ?? null;
  
    try {
      // Пакетное обновление
      await update(ref(database), updates);
    } catch (error) {
      console.error('Ошибка при создании чата:', error);
      throw error;
    }
  
    return chatId;
  }

  async getChatById(chatId: string): Promise<IChat | null> {
    try {
      // 1. Загружаем данные чата
      const chatRef = ref(database, `chats/${chatId}`);
      const snapshot = await get(chatRef);
  
      if (!snapshot.exists()) {
        console.log(`Чат с id "${chatId}" не найден`);
        return null;
      }
  
      // «Сырой» объект чата (пример: { lastMessage: '', participants: { user1: true, user2: true } })
      const chatData = snapshot.val(); 
  
      // Если в чате нет participants, возвращаем null или кидаем ошибку
      if (!chatData.participants) {
        console.log(`У чата "${chatId}" нет участников`);
        return null;
      }
  
      // 2. Собираем userIds из participants
      // По условию вы храните: { [userId]: true, [otherUserId]: true, ... }
      const participantIds = Object.keys(chatData.participants);
  
      // 3. Загружаем всех пользователей одним запросом
      const usersRef = ref(database, 'users');
      const usersSnap = await get(usersRef);
      if (!usersSnap.exists()) {
        console.log('Не удалось получить пользователей');
        return null;
      }
      const allUsersData = usersSnap.val(); // Объект с данными по всем пользователям
  
      // 4. Превращаем participantIds в массив { key, value: IChatUser }[]
      // Подразумеваем, что в /users/{userId} хранятся нужные поля.
      const participantsArray: { key: string; value: IChatUser }[] = participantIds.map((userId) => {
        const userData = allUsersData[userId];
        if (!userData) {
          // Если пользователь не найден в /users (что странно), вернём «заглушку»
          return {
            key: userId,
            value: {
              id: userId,
              name: '...',
              thumbnailUrl: '',
            },
          };
        }
  
        // Сопоставляем с вашим интерфейсом IChatUser
        const chatUser: IChatUser = {
          id: userId,
          name: userData.name || 'NoName', 
          avatar: userData.avatar || '',     
          isOnline: userData.isOnline || false, 
          lastSeen: userData.lastSeen || 0,
          lastMessage: userData.lastMessage || '',
        };
        return { key: userId, value: chatUser };
      });
  
      // 5. Формируем итоговый объект IChat
      const chatObj: IChat = {
        id: chatId,
        lastMessage: chatData.lastMessage || '',
        lastCreatedAt: chatData.lastCreatedAt || 0,
        participants: participantsArray,
        lastSeen: chatData.lastSeen || 0, 
      };
  
      return chatObj;
    } catch (error) {
      console.error('Ошибка при получении чата:', error);
      return null;
    }
  }

  async sendMessageUniversal(
    chat: IChat | null,
    textOrPayload: string,           // Если isInvite=false, это текст
                                     // Если isInvite=true, можем хранить заглушку, а реальная информация в inviteMetadata
    options?: SendMessageOptions
  ): Promise<{ chatType: ChatType; thisChatId: string } | undefined> {
  
    const userId = userStore.getCurrentUserId();
    if (!userId) {
      console.error('User is not defined');
      return;
    }
  
    // 1. Проверяем, есть ли чат
    let existingChat = this.chats.find((c) => c.id === chat?.id);
    let chatId = chat?.id ?? '';
    let chatType = ChatType.ChatExists;
  
    // 2. Если чата нет — создаём
    if (!existingChat) {
      // Проверяем, есть ли участники
      if (!chat?.participants || chat.participants.length < 2) {
        console.error('Невозможно создать чат: отсутствуют участники');
        return;
      }
      // Ищем "другого" участника (не userId)
      const otherParticipantId = chat.participants.find((p) => p.key !== userId)?.value?.id;
      if (!otherParticipantId) {
        console.error('Не удалось найти второго участника');
        return;
      }
      // Берём инфу о другом пользователе (для создания чата)
      const otherUserData = await userStore.getUserById(otherParticipantId);
      if (!otherUserData) {
        console.error('Не удалось найти данные другого участника');
        return;
      }
      const otherUserChat: IChatUser = {
        id: otherUserData.id,
        name: otherUserData.name?? '...',
        avatar: otherUserData.thumbnailUrl?? 'https://avatar.iran.liara.run/public',
        fmcToken: otherUserData.fmcToken,
      };
      
  
      const newChatId = await this.createNewChat(otherUserChat);
      if (!newChatId) {
        console.error('Не удалось создать чат');
        return;
      }
  
      chatId = newChatId;
      chatType = ChatType.NewChat;
  
      // Добавляем в локальный стор (при желании) 
      runInAction(() => {
        this.chats.push({
          ...chat,
          id: newChatId,
        });
        existingChat = this.chats[this.chats.length - 1];
      });
    }
  
    // 3. Находим «другого» участника
    const otherParticipant = (existingChat || chat)?.participants.find(p => p.key !== userId);
    if (!otherParticipant) {
      console.error('Не удалось найти другого участника');
      return;
    }
    const otherUser = otherParticipant.value;
    console.log('otherParticipant:', otherParticipant);
    // 4. Генерируем ключ сообщения
    const newMessageKey = push(ref(database, `messages/${chatId}`)).key;
    if (!newMessageKey) {
      console.error('Ошибка при генерации ключа для сообщения');
      return;
    }
  
    const now = Date.now();
  
    // 5. Формируем само сообщение
    let newMessage: MessageType.Custom | MessageType.Text;
  
    if (options?.isInvite) {
      // Кастомное сообщение (приглашение)
      const metadata = {
        userId,
        userName: userStore.currentUser?.name,
        userAvatar: userStore.currentUser?.thumbnailUrl,
        ...options.inviteMetadata, 
        // например, { advrtId: mapStore.currentWalkId, visibleToUserId: otherUser.id }
      };
  
      newMessage = {
        id: newMessageKey,
        author: {
          id: userId,
          firstName: userStore.currentUser?.name ?? 'Anonymous',
          imageUrl: userStore.currentUser?.thumbnailUrl ?? '',
        },
        createdAt: now,
        type: 'custom',
        metadata,
      };
    } else {
      // Обычное текстовое сообщение
      newMessage = {
        id: newMessageKey,
        type: 'text',
        text: textOrPayload, // просто строка
        createdAt: now,
        author: {
          id: userId,
          firstName: userStore.currentUser?.name ?? 'Anonymous',
          imageUrl: userStore.currentUser?.thumbnailUrl ?? '',
        },
      };
    }
  
    // 6. Пакетное обновление Firebase
    const updates: Record<string, unknown> = {};
    updates[`messages/${chatId}/${newMessageKey}`] = newMessage;
    
    // Для удобства: если это текстовое сообщение, запишем в lastMessage,
    // если "invite" (custom), можно записывать другое поле или и вовсе пусто
    if (!options?.isInvite) {
      // если обычное сообщение
      updates[`chats/${chatId}/lastMessage`] = (newMessage as MessageType.Text).text;
    } else {
      // Можно сохранить "Приглашение" как lastMessage или вообще не трогать.
      updates[`chats/${chatId}/lastMessage`] = 'Приглашение на прогулку';
    }
  
    updates[`chats/${chatId}/lastCreatedAt`] = now;
    updates[`users/${userId}/lastSeen`] = now;
  
    try {
      await update(ref(database), updates);
    } catch (error) {
      console.error('Ошибка при пакетном обновлении:', error);
      return;
    }
  
    // 7. Отправляем пуш (если есть токен)
    let pushTitle = 'Новое сообщение';
    let pushBody = textOrPayload;
    
    if (options?.isInvite) {
      pushTitle = 'Приглашение на прогулку';
      // Например, отправим «(имя пользователя) приглашает вас на прогулку»
      pushBody = `${userStore.currentUser?.name ?? 'Кто-то'} приглашает вас на прогулку`;
    }
  
    const fcmToken = await this.getOtherUserFmcTokenByUserId(otherUser.id!);
    console.log('otherUser.id:', otherUser.id);
    console.log('fcmToken:', fcmToken);
    if (fcmToken) {
      try {
        await sendPushNotification(
          fcmToken,
          pushTitle,
          typeof pushBody === 'string' ? pushBody : '',
          { chatId }
        );
      } catch (err) {
        console.error('Ошибка при отправке пуш-уведомления:', err);
      }
    }
  
    // 8. Обновляем локальный стор
    runInAction(() => {
      // Если обычное сообщение — обновим lastMessage в сторе
      // Если invite — решение за вами, записать «Приглашение» или нет
      const lastMsg = !options?.isInvite
        ? (newMessage as MessageType.Text).text
        : 'Приглашение на прогулку';
  
      this.updateChat(chatId, {
        lastMessage: lastMsg,
        lastCreatedAt: now,
      });
      this.lastSeen[userId] = now;
      this.lastMessage[chatId] = lastMsg;
    });
  
    return { chatType, thisChatId: chatId };
  }

  /**
   * Загрузить (однократно) из Firebase статус пользователя по userId.
   * Сохранить в usersStatus (MobX будет реактивно обновлять UI).
   */
  async getUserStatus(userId: string): Promise<boolean  | undefined> {
    return getUserStatus(userId);
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

  async ensureAssistantChatExists(userId: string) {
    const AI_ASSISTANT_CHAT_ID = process.env.EXPO_PUBLIC_AI_CHAT_ID!; // статический ID для бота
    const AI_ASSISTANT_BOT_ID = process.env.EXPO_PUBLIC_AI_BOT_ID!;

    const assistantUserRef = ref(database, `users/${AI_ASSISTANT_BOT_ID}`);
    const assistantUserSnap = await get(assistantUserRef);
    if (!assistantUserSnap.exists()) {
      const assistantData  = {
        id: AI_ASSISTANT_BOT_ID,
        name: 'PetAI Assistant',
        avatar: 'https://firebasestorage.googleapis.com/v0/b/petmeetar.appspot.com/o/assets%2Fimages%2FuserAvatars%2Fai_assistent.webp?alt=media&token=8d1bf432-5006-4ef9-84f0-9ec45191d1aa',
        isOnline: true,
        // ... при необходимости другие поля
      };
      await set(assistantUserRef, assistantData);
    }

    // Ссылка на чат в Firebase (чтобы проверить, существует ли)
    const chatRef = ref(database, `chats/${AI_ASSISTANT_CHAT_ID}`);
    const snap = await get(chatRef);
  
    if (!snap.exists()) {
      

      const newChatData = {
        id:AI_ASSISTANT_BOT_ID,
        lastMessage: 'Hi! How can I help you?',
        lastCreatedAt: Date.now(),
        lastSeen: 0, // или любое подходящее вам значение
        participants: {
          [userId]: true,       // текущий пользователь
          [AI_ASSISTANT_BOT_ID]: true,  // ассистент
        },
      };

      await set(chatRef, newChatData);
    } else {
      // Если чат уже есть, можно, например, убедиться, что текущий пользователь числится в `participants`
      const existingChatData = snap.val();
      if (!existingChatData.participants[userId]) {
        // Если по каким-то причинам текущего пользователя нет — добавим
        const updatedParticipants = { ...existingChatData.participants, [userId]: true };
        await update(chatRef, { participants: updatedParticipants });
      }
    }
  }

  async sendChatToAiAssistant(conversationHistory: IChatAIMessage[]): Promise<string | null> 
  {
    const chatId = process.env.EXPO_PUBLIC_AI_CHAT_ID

    try {
      // 1. Найдём последнее сообщение пользователя
      //    Обычно это последнее по списку с role = 'user'
      const lastUserMessage = conversationHistory[conversationHistory.length - 1]
      if (lastUserMessage?.role !== 'user') {
        console.warn('В конце истории нет сообщения от пользователя')
        return null
      }

      // 2. Сохраним это сообщение в Firebase (аналогично sendMessageUniversal)
      const userId = userStore.currentUser?.id ?? 'unknownUser'
      const now = Date.now()
      const newMessageKey = push(ref(database, `messages/${chatId}`)).key
      if (!newMessageKey) {
        console.error('Не удалось сгенерировать ключ для сообщения')
        return null
      }

      const userMsg: MessageType.Text = {
        id: newMessageKey,
        type: 'text',
        text: lastUserMessage.content,
        createdAt: now,
        author: {
          id: userId,
          firstName: userStore.currentUser?.name ?? 'Anonymous',
          imageUrl: userStore.currentUser?.thumbnailUrl ?? '',
        },
      }

      // Пакетное обновление
      const updates: Record<string, unknown> = {}
      updates[`messages/${chatId}/${newMessageKey}`] = userMsg
      updates[`chats/${chatId}/lastMessage`] = userMsg.text
      updates[`chats/${chatId}/lastCreatedAt`] = now
      updates[`users/${userId}/lastSeen`] = now

      await update(ref(database), updates)

      // Сразу обновим локальный стор
      runInAction(() => {
        this.messages.unshift(userMsg) // или push в конец, в зависимости от логики
        this.lastMessage[chatId!] = userMsg.text
      })

      // 3. Теперь отправляем запрос на бэкенд для получения ответа ассистента
      const requestBody = {
        messages: conversationHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      }

      const response = await apiClient.post('/chatgpt/askai', requestBody, {
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.status !== 200) {
        console.error(
          'Ошибка при обращении к AI-ассистенту:',
          response.status,
          response.statusText
        )
        return null
      }

      // 4. Парсим ответ (предположим, вы возвращаете { answer: "..." })
      const data = response.data
      const assistantText = data?.answer || null

      console.log('Ответ AI-ассистента:', assistantText)
      return assistantText
    } catch (error) {
      console.error('Ошибка при отправке разговора AI-ассистенту:', error)
      return null
    }
  
  }

  async addAssistantMessage(chatId: string, assistantReply: string) {
    try {
      // 1. Генерируем ключ для сообщения
      const newMessageKey = push(ref(database, `messages/${chatId}`)).key
      if (!newMessageKey) {
        console.error('Ошибка: не удалось создать ключ для бот-сообщения')
        return
      }
  
      // 2. Формируем новое сообщение
      const now = Date.now()
      const AI_BOT_ID = process.env.EXPO_PUBLIC_AI_BOT_ID || 'AI_ASSISTANT_BOT_ID'
      const newMessage: MessageType.Text = {
        id: newMessageKey,
        type: 'text',
        text: assistantReply,
        createdAt: now,
        author: {
          id: AI_BOT_ID,
          firstName: 'PetAI Assistant',
          imageUrl: 'https://firebasestorage.googleapis.com/v0/b/petmeetar.appspot.com/o/assets%2Fimages%2FuserAvatars%2Fai_assistent.webp?alt=media&token=8d1bf432-5006-4ef9-84f0-9ec45191d1aa', // или укажите URL аватара бота
        },
      }
  
      // 3. Подготавливаем пакет обновлений
      const updates: Record<string, unknown> = {}
      updates[`messages/${chatId}/${newMessageKey}`] = newMessage
      updates[`chats/${chatId}/lastMessage`] = newMessage.text
      updates[`chats/${chatId}/lastCreatedAt`] = now
  
      // При желании обновите lastSeen для бота, 
      // хотя это не всегда нужно, но для единообразия:
      updates[`users/${AI_BOT_ID}/lastSeen`] = now
  
      // 4. Пакетное обновление в Realtime Database
      await update(ref(database), updates)
  
      // 5. Обновляем локальный стор (MobX), чтобы UI отобразил сообщение немедленно
      runInAction(() => {
        // Вставляем сообщение в начало или конец массива — как вам удобнее
        this.messages.unshift(newMessage)
        this.lastMessage[chatId] = newMessage.text
      })
  
    } catch (error) {
      console.error('Ошибка при добавлении бот-сообщения:', error)
    }
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


import { makeAutoObservable, runInAction } from "mobx";
import { database } from "@/firebaseConfig";
import {
  ref,
  get,
  push,
  update,
  query,
  orderByChild,
  onValue,
  remove,
  set,
} from "firebase/database";
import userStore from "@/stores/UserStore";
import { MessageType } from "@flyerhq/react-native-chat-ui";
import { IUser } from "@/dtos/Interfaces/user/IUser";
import { randomUUID } from "expo-crypto";
import { sendPushNotification } from "@/hooks/notifications";

interface Chat {
  id: string;
  thumbnailUrl?: string;
  otherUserName?: string;
  otherUserId?: string;
  lastMessage: string;
  participants: { [key: string]: boolean };
  lastSeen?: number;
}

interface Message {
  author: { id: string };
  createdAt: number;
  text: string;
  type: string;
}

class ChatStore {
  chats: Chat[] = [];
  messages: MessageType.Any[] = [];
  lastMessage: { [key: string]: string } = {};
  lastSeen: { [key: string]: number } = {};

  constructor() {
    makeAutoObservable(this);
  }

  async fetchChats() {
    const userId = userStore.currentUser?.id;
    if (!userId) return;

    const chatsRef = ref(database, "chats");
    const snapshot = await get(chatsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const chatsList: Chat[] = [];

      for (const chatId in data) {
        const chatData = data[chatId];
        const participantIds = Object.keys(chatData.participants);
        const otherUserId = participantIds.find((id) => id !== userId);
        const currentUserId = participantIds.find((id) => id === userId);

        if (currentUserId && otherUserId) {
          const userSnapshot = await get(ref(database, `users/${otherUserId}`));
          const otherUserName = userSnapshot.val().name;
          const thumbnailUrl = userSnapshot.val().avatar;
          chatsList.push({
            id: chatId,
            lastMessage: chatData.lastMessage,
            // lastSeen: chatData.lastSeen,
            participants: chatData.participants,
            otherUserName: otherUserName,
            otherUserId: otherUserId,
            thumbnailUrl,
          });
        }
      }

      runInAction(() => {
        this.chats = chatsList;
      });
    }
  }

  async createNewChat(
    otherUser: IUser,
    initalMessage?: string
  ): Promise<string | undefined> {
    const userId = userStore.currentUser?.id;
    if (!userId) return;

    const chatId = userId + otherUser.id;

    if (!chatId) {
      throw new Error("Unable to generate chat ID");
    }

    const newChatData = {
      lastMessage: "Чат начат",
      participants: {
        [userId]: true,
        [otherUser.id]: true,
      },
    };
    const userId1 = userStore.currentUser?.id;
    const userId2 = otherUser?.id;

    console.log("fmcTokenCurrentUser:", userStore.currentUser?.fmcToken);
    console.log("fmcTokenOtherUser:", otherUser?.fmcToken);

    const newUserData1 = {
      name: userStore.currentUser?.name,
      avatar: userStore.currentUser?.thumbnailUrl,
      lastSeen: Date.now(),
    };
    const newUserData2 = {
      name: otherUser?.name,
      avatar: otherUser?.thumbnailUrl,
    };

    const updates: { [key: string]: any } = {};
    updates[`/chats/${chatId}`] = newChatData;

    updates[`/users/${userId1}`] = newUserData1;

    updates[`/users/${userId2}`] = newUserData2;

    try {
      await update(ref(database), updates);

      runInAction(() => {
        // Проверяем, существует ли уже объект с таким chatId в массиве this.chats
        const existingChat = this.chats.find((chat) => chat.id === chatId);

        // Если такого chatId еще нет, добавляем новый объект в массив
        if (!existingChat) {
          this.chats.push({
            id: chatId,
            lastMessage: newChatData.lastMessage,

            participants: newChatData.participants,
            otherUserName: otherUser?.name!,
            thumbnailUrl: otherUser?.thumbnailUrl!,
          });
        }
      });

      await this.sendInviteMessage(chatId, otherUser?.id);

      return chatId;
    } catch (error) {
      console.error("Ошибка создания чата:", error);
      throw error;
    }
  }

  async sendInviteMessage(chatId: string, otherUserId: string | undefined) {
    const userId = userStore.currentUser?.id;
    const recipientExpoPushToken = userStore.users.find(
      (user) => user.id === otherUserId
    )?.fmcToken;
    if (!userId) return;

    const initialMessage: MessageType.Custom = {
      id: randomUUID(), // используем уникальный идентификатор для сообщения
      author: {
        id: userId,
      },
      createdAt: Date.now(),
      type: "custom",
      metadata: {
        userId: userStore.currentUser?.id,
        userName: userStore.currentUser?.name,
        userAvatar: userStore.currentUser?.thumbnailUrl,
      },
    };

    try {
      await push(ref(database, `messages/${chatId}`), initialMessage);
      console.log("Initial message sent");
      if (recipientExpoPushToken) {
        await sendPushNotification(
          recipientExpoPushToken,
          "Приглашение на прогулку",
          userStore?.currentUser?.name ?? "Пользователь",
          { chatId }
        );
      }
    } catch (error) {
      console.error("Error sending initial message:", error);
    }
  }

  async sendMessage(
    chatId: string,
    text: string,
    otherUserId: string | undefined
  ) {
    const userId = userStore.currentUser?.id;
    const recipientExpoPushToken = userStore.users.find(
      (user) => user.id === otherUserId
    )?.fmcToken;

    if (!userId) {
      console.error("User is not defined");
      return;
    }

    const textMessage: Message = {
      author: { id: userId },
      createdAt: Date.now(),
      text,
      type: "text",
    };

    try {
      // Отправляем сообщение
      await push(ref(database, `messages/${chatId}`), textMessage);
      console.log("Message sent:", textMessage);

      // Обновляем последнее сообщение в чате
      await update(ref(database, `chats/${chatId}`), {
        lastMessage: text,
      });
      await update(ref(database, `users/${userId}`), {
        lastSeen: Date.now(),
      });

      // Отправляем push-уведомление, если есть токен получателя
      if (recipientExpoPushToken) {
        await sendPushNotification(
          recipientExpoPushToken,
          "Новое сообщение",
          text,
          { chatId }
        );
      }

      // Обновляем локальное состояние lastMessage и lastSeen в chatStore
      runInAction(() => {
        chatStore.lastMessage[chatId] = text;
        chatStore.lastSeen[userId] = Date.now();
        console.log("lastSeen from chatStore:", chatStore.lastMessage[chatId]);
      });
    } catch (error) {
      console.error("Error during sendMessage:", error);
    }
  }

  fetchMessages(chatId: string) {
    const messagesRef = ref(database, `messages/${chatId}`);
    const q = query(messagesRef, orderByChild("createdAt"));

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
          console.error(
            "Invalid message data or missing key:",
            childSnapshot.val()
          );
        }
      });
      runInAction(() => {
        this.messages = messagesList.reverse(); // Обратный порядок для правильного отображения
      });
    });
  }

  async getLastMessage(chatId: string) {
    const data = ref(database, `chats/${chatId}`);
    const snapshot = await get(data);

    if (snapshot.exists()) {
      const lastMessage = snapshot.val().lastMessage;

      runInAction(() => {
        this.lastMessage[chatId] = lastMessage;
      });
      return lastMessage;
    }
  }

  async deleteChat(chatId: string) {
    const userId = userStore.currentUser?.id;
    if (!userId) {
      console.error("User is not defined");
      return;
    }
    console.log("chatId:", chatId);
    const chatRef = ref(database, `chats/${chatId}`);
    const messagesRef = ref(database, `messages/${chatId}`);

    try {
      await remove(chatRef);
      await remove(messagesRef);
      runInAction(() => {
        this.chats = this.chats.filter((chat) => chat.id !== chatId);
      });
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  }

  async addBlacklist() {
    try {
      const userId = userStore.currentUser?.id; // Текущий пользователь
      if (!userId) {
        console.error("Пользователь не авторизован");
        return;
      }

      const data = this.chats;
      if (!data || data.length === 0) {
        console.error("Чат не найден");
        return;
      }

      const blockUserId = data[0]?.otherUserId; // Другой пользователь
      if (!blockUserId) {
        console.error("ID пользователя для блокировки не найдено");
        return;
      }

      // Текущий пользователь блокирует другого пользователя
      await set(ref(database, `/blacklist/${userId}/${blockUserId}`), true);
      console.log("Пользователь заблокирован:", blockUserId);
    } catch (error) {
      console.error(
        "Ошибка при добавлении пользователя в черный список:",
        error
      );
    }
  }

  async removeBlacklist() {
    try {
      const userId = userStore.currentUser?.id; // Текущий пользователь
      if (!userId) {
        console.error("Пользователь не авторизован");
        return;
      }
      const data = this.chats;
      if (!data || data.length === 0) {
        console.error("Чат не найден");
        return;
      }
      const blockUserId = data[0]?.otherUserId; // Другой пользователь
      if (!blockUserId) {
        console.error("ID пользователя для разблокировки не найдено");
        return;
      }
      // Текущий пользователь разблокирует другого пользователя
      await remove(ref(database, `/blacklist/${userId}/${blockUserId}`));
    } catch (error) {
      console.error(
        "Ошибка при удалении пользователя из черного списка:",
        error
      );
    }
  }

  async checkBlocked() {
    try {
      const userId = userStore.currentUser?.id; // Текущий пользователь
      if (!userId) {
        console.error("Пользователь не авторизован");
        return false;
      }

      const chatData = this.chats;
      if (!chatData || chatData.length === 0) {
        console.error("Чат не найден");
        return false;
      }

      const blockUserId = chatData[0]?.otherUserId; // Другой пользователь
      if (!blockUserId) {
        console.error(
          "ID другого пользователя для проверки блокировки не найдено"
        );
        return false;
      }
      // Проверяем, заблокировал ли другой пользователь текущего пользователя
      const data = ref(database, `/blacklist/${blockUserId}/${userId}`);
      const snapshot = await get(data);

      if (snapshot.exists()) {
        return true;
      } else return false;
    } catch (error) {
      console.error("Ошибка при проверке статуса блокировки:", error);
      return false;
    }
  }

  async chekIfIBlocked() {
    try {
      const userId = userStore.currentUser?.id; // Текущий пользователь
      if (!userId) {
        console.error("Пользователь не авторизован");
        return false;
      }

      const chatData = this.chats;
      if (!chatData || chatData.length === 0) {
        console.error("Чат не найден");
        return false;
      }

      const blockUserId = chatData[0]?.otherUserId; // Другой пользователь
      if (!blockUserId) {
        console.error(
          "ID другого пользователя для проверки блокировки не найдено"
        );
        return false;
      }

      // Проверяем, заблокировал ли другой пользователь текущего пользователя
      const data = ref(database, `/blacklist/${userId}/${blockUserId}`);
      const snapshot = await get(data);
      if (snapshot.exists()) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Ошибка при проверке статуса блокировки:", error);
      return false;
    }
  }

  clearMessages() {
    runInAction(() => {
      this.messages = [];
    });
  }
}

const chatStore = new ChatStore();
export default chatStore;

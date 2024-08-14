import { makeAutoObservable, runInAction } from 'mobx';
import { database } from '@/firebaseConfig';
import { ref, get, push, update, query, orderByChild, onValue, off } from 'firebase/database';
import userStore from '@/stores/UserStore';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import * as Crypto from 'expo-crypto';


interface Chat {
  id: string;
  thumbnailUrl?: string;
  otherUserName?: string;
  lastMessage: string;
  participants: { [key: string]: boolean };
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
  //currentUser = userStore.currentUser; 
 

  constructor() {
    makeAutoObservable(this);
  }

  async fetchChats() {
    const userId = userStore.currentUser?.id;
    if (!userId) return;

    const chatsRef = ref(database, 'chats');
    const snapshot = await get(chatsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const chatsList: Chat[] = [];

      for (const chatId in data) {
        const chatData = data[chatId];
        const participantIds = Object.keys(chatData.participants);
        const otherUserId = participantIds.find(id => id !== userId);
        const currentUserId = participantIds.find(id => id === userId);

        if (currentUserId && otherUserId) {
          const userSnapshot = await get(ref(database, `users/${otherUserId}`));
          const otherUserName = userSnapshot.val().name;
          const thumbnailUrl = userSnapshot.val().avatar;
          chatsList.push({
            id: chatId,
            lastMessage: chatData.lastMessage,
            participants: chatData.participants,
            otherUserName: otherUserName,
            thumbnailUrl
          });
        }
      }

      runInAction(() => {
        this.chats = chatsList;
      });
    }
  }

  async createNewChat(otherUser: IUser, initalMessage?: string): Promise<string | undefined> {
    const userId = userStore.currentUser?.id;
    if (!userId) return;

    
    const chatId = userId+otherUser.id;

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

    const newUserData1 ={
      name: userStore.currentUser?.name,
      avatar: userStore.currentUser?.thumbnailUrl,
    }
    const newUserData2 ={
      name: otherUser?.name,
      avatar: otherUser?.thumbnailUrl,
    }
   
    
    const updates: { [key: string]: any } = {};
    updates[`/chats/${chatId}`] = newChatData;

    updates[`/users/${userId1}`] = newUserData1;

    updates[`/users/${userId2}`] = newUserData2;


    try {
      await update(ref(database), updates);
      
      runInAction(() => {
         // Проверяем, существует ли уже объект с таким chatId в массиве this.chats
        const existingChat = this.chats.find(chat => chat.id === chatId);

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

      await this.sendInviteMessage(chatId);

      return chatId;
    } catch (error) {
      console.error("Ошибка создания чата:", error);
      throw error;
    }
  }

  async sendInviteMessage(chatId: string) {
    const userId = userStore.currentUser?.id;
    if (!userId) return;
  
    const initialMessage: MessageType.Custom = {
      id:  Crypto.randomUUID(), // используем уникальный идентификатор для сообщения
      author: {
        id: userId,
      },
      createdAt: Date.now(),
      type: 'custom',
      metadata: {
        userId: userStore.currentUser?.id,
        userName: userStore.currentUser?.name,
        userAvatar: userStore.currentUser?.thumbnailUrl,
      },
    };
  
    try {
      await push(ref(database, `messages/${chatId}`), initialMessage);
      console.log('Initial message sent');
    } catch (error) {
      console.error('Error sending initial message:', error);
    }
  }

  sendMessage(chatId: string, text: string) {
    const userId = userStore.currentUser?.id;
    if (!userId) {
      console.error("User is not defined");
      return;
    }
   
    const textMessage: Message= {
      author: { id: userId },
      createdAt: Date.now(),
      text,
      type: 'text',
    };
    
    push(ref(database, `messages/${chatId}`), textMessage)
      .then(() => console.log('Message sent:', textMessage))
      .catch(error => console.error('Error sending message:', error));
    console.log('MMMMMessage sent:', textMessage);
  }

  fetchMessages(chatId: string) {
    
    const messagesRef = ref(database, `messages/${chatId}`);
    const q = query(messagesRef, orderByChild('createdAt'));

    onValue(q, snapshot => {
      const messagesList: MessageType.Any[] = [];
      snapshot.forEach(childSnapshot => {
        const message = childSnapshot.val();
        console.log('childSnapshot.key:', childSnapshot.key);
      if (message && childSnapshot.key) {
        messagesList.push({
          id: childSnapshot.key,  // Убедитесь, что `id` существует
          author: message.author,
          createdAt: message.createdAt,
          metadata: message.metadata,
          text: message.text,
          type: message.type,
        });
      } else {
        console.error("Invalid message data or missing key:", childSnapshot.val());
      }
    });
      runInAction(() => {
        this.messages = messagesList.reverse(); // Обратный порядок для правильного отображения
      });
    });
  }

  

  clearMessages() {
    runInAction(() => {
      this.messages = [];
    });
  }
}

const chatStore = new ChatStore();
export default chatStore;

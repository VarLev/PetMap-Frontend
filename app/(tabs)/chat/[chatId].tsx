import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { database } from '../../../firebaseConfig';
import { ref, query, orderByChild, onValue, off, push } from 'firebase/database';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Chat, MessageType } from '@flyerhq/react-native-chat-ui';
import userStore from '@/stores/UserStore';

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16)
    const v = c === 'x' ? r : (r % 4) + 8
    return v.toString(16)
  })
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<MessageType.Any[]>([]);
  const userUid = userStore.currentUser?.firebaseUid;
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  const user = { id: userUid || 'defaultUserId' };

  useEffect(() => {
    if (!chatId || !userUid) return;

    const messagesRef = ref(database, `messages/${chatId}`);
    const q = query(messagesRef, orderByChild('createdAt'));
    const onValueChange = onValue(q, snapshot => {
      const messagesList: MessageType.Any[] = [];
      snapshot.forEach(childSnapshot => {
        const message = childSnapshot.val();
        console.log('Message snapshot:', message); // Логирование сообщения
        if (message) {
          messagesList.push({
            id: childSnapshot.key,
            author: { id: message.authorId },
            createdAt: message.createdAt,
            text: message.text,
            type: message.type,
          });
        } else {
          console.error('Invalid message data:', childSnapshot.key, childSnapshot.val());
        }
      });
      console.log('Messages list:', messagesList); // Логирование списка сообщений
      setMessages(messagesList.reverse()); // Обратный порядок для правильного отображения
    });

    return () => {
      off(messagesRef, 'value', onValueChange);
    };
  }, [chatId, userUid]);

  const handleSendPress = (message: MessageType.PartialText) => {
    if (!userUid) return;

    const textMessage = {
      authorId: userUid,
      createdAt: Date.now(),
      text: message.text,
      type: 'text',
    };
    push(ref(database, `messages/${chatId}`), textMessage).then(() => {
      console.log('Message sent:', textMessage);
    }).catch((error) => {
      console.error('Error sending message:', error);
    });
  };

  if (!userUid) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaProvider>
      <Chat
        messages={messages}
        onSendPress={handleSendPress}
        user={user}
      />
    </SafeAreaProvider>
  );
};

export default ChatScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { database } from '../../../firebaseConfig';
import { ref, onValue, get } from 'firebase/database';
import { useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import userStore from '@/stores/UserStore';

interface Chat {
  id: string;
  lastMessage: string;
  participants: { [key: string]: boolean };
  otherUserName: string;
}

const ChatListScreen: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const userUid = userStore.currentUser?.firebaseUid;
  const router = useRouter();

  useEffect(() => {
    if (!userUid) return;

    const fetchChats = async () => {
      const chatsRef = ref(database, 'chats');
      const snapshot = await get(chatsRef);
      const chatsList: Chat[] = [];

      if (snapshot.exists()) {
        const data = snapshot.val();
        for (const chatId in data) {
          const chatData = data[chatId];
          const participantIds = Object.keys(chatData.participants);
          const otherUserId = participantIds.find(id => id !== userUid);

          if (otherUserId) {
            const userSnapshot = await get(ref(database, `users/${otherUserId}`));
            const otherUserName = userSnapshot.val().name;
            chatsList.push({
              id: chatId,
              lastMessage: chatData.lastMessage,
              participants: chatData.participants,
              otherUserName
            });
          }
        }
        setChats(chatsList);
      }
    };

    fetchChats();
  }, [userUid]);

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity onPress={() => router.push(`/chat/${item.id}`)}>
      <View style={styles.chatItem}>
        <Text style={styles.chatTitle}>{item.otherUserName}</Text>
        <Text style={styles.chatLastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#555',
  },
});

export default ChatListScreen;

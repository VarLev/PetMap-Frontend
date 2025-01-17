import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import ChatStore from '@/stores/ChatStore';
import UserStore from '@/stores/UserStore';
import EmptyChatScreen from '@/components/chat/chatList/EmptyChatScreen';
import ChatListItem from '@/components/chat/chatList/ChatListItem';

const ChatListView: React.FC = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>(UserStore.getCurrentUserId()!);
  //const [chats, setChats] = useState<IChat[]>([]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      await ChatStore.ensureAssistantChatExists(currentUserId);
      await ChatStore.fetchChats();
      //setChats(ChatStore.chats);
    } catch (err) {
      setError('');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Подписываемся на изменения в чатах
    const unsubscribe = ChatStore.subscribeToChats();

    // Возвращаем функцию, которая "отпишется" при размонтиовании
    return () => unsubscribe && unsubscribe();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  // 1. Если идёт загрузка (и при этом нет ошибки) —
  //    показываем индикатор.
  if (isLoading && !isRefreshing) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  // 2. Если при загрузке случилась ошибка —
  //    показываем сообщение об ошибке.
  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{error}</Text>
      </View>
    );
  }

  // 4. Если нет ошибки, нет загрузки и есть чаты —
  //    показываем шапку и список.
  return (
    <View className="h-full bg-white">
      <FlatList
        data={ChatStore.chats}
        ListEmptyComponent={
          <View className="h-full">
            <EmptyChatScreen />
          </View>}
        renderItem={({ item }) =>
          <ChatListItem item={item} currentUserId={currentUserId} />
        }
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#6200ee']} />}
        contentContainerStyle={{ paddingBottom: 85 }}
      />
    </View>
  );
});

export default ChatListView;

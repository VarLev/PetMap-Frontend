import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import ChatStore from '@/stores/ChatStore';
import { Divider, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const ChatListScreen: React.FC = observer(() => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      await ChatStore.fetchChats();
    } catch (err) {
      setError('Failed to load chats');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const handleDelete = (chatId: string) => {
    Alert.alert(
      "Удалить чат",
      "Вы уверены, что хотите удалить этот чат?",
      [
        { text: "Отмена", style: "cancel" },
        { text: "Удалить", onPress: async () => await deleteChat(chatId) }
      ]
    );
  };

  const deleteChat = async (chatId: string) => {
    console.log('Deleting chat', ChatStore.chats);
    await ChatStore.deleteChat(chatId);
  };

  const renderItem = ({ item }: { item: typeof ChatStore.chats[0] }) => (
    <TouchableOpacity onPress={() => router.push(`/chat/${item?.id}?otherUserId=${item.otherUserId}`)} className='bg-violet-300'>
      <View className='flex-row justify-between p-1 ml-4 items-center h-17 bg-gray-100 rounded-l-xl'>
        <View className='flex-row items-center'>
          <Image source={{ uri: item?.thumbnailUrl ?? 'https://i.pravatar.cc/200' }} className='rounded-xl h-16 w-16' />
          <Text className='text-indigo-800 pl-4 text-xl font-nunitoSansBold'>{item.otherUserName}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item?.id)} className='p-2'>
          <Ionicons name="trash" size={24} color="grey" />
        </TouchableOpacity>
      </View>
      <Divider bold className='bg-gray-400' />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Loading chats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View className='h-full'>
      <FlatList 
        data={ChatStore.chats}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#6200ee']}
          />
        }
      />
      <Surface elevation={5} className='h-24 bg-white' children={undefined} />
    </View>
  );
});

export default ChatListScreen;

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import ChatStore from '@/stores/ChatStore';
import { Divider } from 'react-native-paper';
import ChatMenu from '@/components/chat/ChatMenu';
import EmptyChatScreen from '@/components/chat/EmptyChatScreen';
import { shortenName } from '@/utils/utils';
import { encode as btoa } from 'base-64';
import SkeletonCard from '@/components/custom/cards/SkeletonCard';

const ChatListItem: React.FC<{
  item: (typeof ChatStore.chats)[0];
  lastMessage: string;
}> = ({ item, lastMessage }) => {
  const router = useRouter();

  const handleOpenChat = () => {
    const encodedAvatarUrl = item.thumbnailUrl ? btoa(item.thumbnailUrl) : '';
    router.push({
      pathname: '/chat/[chatId]',
      params: {
        chatId: item.id,
        otherUserId: item.otherUserId,
        otherUserName: item.otherUserName,
        avatarUrl: encodedAvatarUrl,
      },
    });
    console.log('open chat: ', item.id);
  };

  return (
    <TouchableOpacity onPress={handleOpenChat}>
      <View className="flex-row justify-between p-1 pl-3 items-center h-17 bg-white rounded-l-xl">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleOpenChat}>
            <Image
              source={{
                uri: item?.thumbnailUrl ?? 'https://i.pravatar.cc/200',
              }}
              className="rounded-xl h-16 w-16"
            />
          </TouchableOpacity>
          <View className="flex-col pl-4 ">
            <Text className="text-black text-[16px] font-nunitoSansBold">{shortenName(item.otherUserName)}</Text>
            <Text className="text-gray-600">{shortenName(lastMessage) ?? 'Загрузка...'}</Text>
          </View>
        </View>
        <ChatMenu chatId={item?.id} otherUserId={item.otherUserId} />
      </View>
      <Divider bold className="bg-gray-400" />
    </TouchableOpacity>
  );
};

const ChatListScreen: React.FC = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

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
  useEffect(() => {
    fetchData();
    setIsEmpty(ChatStore.chats.length === 0);
  }, [ChatStore.chats.length]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{error}</Text>
      </View>
    );
  }
  const renderSkeletons = () => (
    <FlatList
      data={[...Array(5).keys()]} // Создаем 5 элементов для отображения скелетонов
      keyExtractor={(item) => item.toString()}
      renderItem={() => (
        <View className="items-center bg-white">
          <SkeletonCard />
        </View>
      )}
    />
  );

  return (

      <View className="h-full">
       
        {isLoading ? (
          renderSkeletons() // Показываем скелетоны, если идет загрузка
        ) : isEmpty ? (
          <EmptyChatScreen /> // Пустое состояние
        ) : (
          <FlatList
            data={ChatStore.sortedChats}
            renderItem={({ item }) => <ChatListItem item={item} lastMessage={ChatStore.lastMessage[item.id]} />}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#6200ee']} />}
            contentContainerStyle={{ paddingBottom: 85 }}
          />
        )}
      </View>
 
  );
});

export default ChatListScreen;

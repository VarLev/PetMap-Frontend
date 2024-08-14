import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, FlatList, TouchableOpacity,Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ChatStore from '@/stores/ChatStore';
import { Divider, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const ChatListScreen: React.FC = observer(() => {
  const router = useRouter();

  useEffect(() => {
    ChatStore.fetchChats();
  }, []);

  const handleDelete = () => {
    Alert.alert(
      "Удалить чат",
      "Вы уверены, что хотите удалить этот чат?",
      [
        { text: "Отмена", style: "cancel" },
        { text: "Удалить", onPress: () => {} }
      ]
    );
  };

  const renderItem = ({ item }: { item: typeof ChatStore.chats[0] }) => (
    <TouchableOpacity onPress={() => router.push(`/chat/${item?.id}`)} className='bg-violet-300'>
    <View className='flex-row justify-between p-1 ml-4 items-center h-17 bg-gray-100 rounded-l-xl'>
      <View className='flex-row items-center'>
        <Image source={{ uri: item?.thumbnailUrl ?? 'https://i.pravatar.cc/200' }} className='rounded-xl h-16 w-16' />
        <Text className='text-indigo-800 pl-4 text-xl font-nunitoSansBold'>{item.otherUserName}</Text>
      </View>
      <TouchableOpacity onPress={handleDelete} className='p-2'>
        <Ionicons name="trash" size={24} color="grey" />
      </TouchableOpacity>
    </View>
    <Divider bold className='bg-gray-400'/>
  </TouchableOpacity>
  );

  return (
    <View className='h-full'>
      <FlatList 
        data={ChatStore.chats}
        renderItem={renderItem}
        keyExtractor={item => item.id}

      />
      <Surface elevation={5} className='h-24 bg-white' children={undefined}/>
    </View>
  );
});



export default ChatListScreen;

import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Divider } from 'react-native-paper';
import ChatMenu from '@/components/chat/chatList/ChatMenu';
import { shortenName } from '@/utils/utils';
import { router } from 'expo-router';
import AvatarWithStatus from '@/components/custom/avatars/AvatarWithStatus';



interface ChatListItemProps {
  item: IChat;
  currentUserId: string;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ item, currentUserId}) => {
  const [recipient, setRecipient] = useState<IChatUser | null>(null);

  

  useEffect(() => {
    if (!item.participants) {
      setRecipient(null);
      return;
    }
    if (Array.isArray(item.participants)){
      const foundParticipant = item.participants?.find(p => p.key !== currentUserId);
      //console.log('foudndParticipant', foundParticipant);
      setRecipient(foundParticipant?.value ?? null);
    }
  }, [currentUserId, item.participants]);
  

  const handleOpenChat = () => {
    if (!recipient) return;
    router.push(`(chat)/${item.id}`);
  };

  if (!recipient) {
    return null;
  }

  return (
    <>
      <View className="flex-row justify-between p-1 ml-4 items-center h-17 bg-gray-100 rounded-l-xl">
        <TouchableOpacity activeOpacity={0.8} onPress={handleOpenChat}>
        <View className="flex-row items-center">
          {/* Аватарка + индикатор статуса */}
          <AvatarWithStatus onPress={handleOpenChat} imageUrl={recipient.avatar}  isOnline={recipient.isOnline}/>

          {/* Имя пользователя и последнее сообщение */}
          <View className="flex-col pl-4">
            <Text className="text-black text-[16px] font-nunitoSansBold">
              {shortenName(recipient?.name?? 'PetOwner')}
            </Text>
            <Text className="text-gray-600">
              {shortenName(item.lastMessage) || '...'}
            </Text>
          </View>
        </View>
        </TouchableOpacity>
        {/* Кнопка «меню» (удалить чат и т.д.) */}
        {item.id !== (process.env.EXPO_PUBLIC_AI_CHAT_ID+currentUserId) && <ChatMenu chatId={item.id} otherUserId={recipient?.id} />}
      </View>
      <Divider bold className="bg-gray-400" />
      </>
  );
};

export default ChatListItem;
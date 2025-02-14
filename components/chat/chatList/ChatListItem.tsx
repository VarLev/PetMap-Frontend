import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Divider } from 'react-native-paper';
import ChatMenu from '@/components/chat/chatList/ChatMenu';
import { shortenName } from '@/utils/utils';
import { router } from 'expo-router';
import AvatarWithStatus from '@/components/custom/avatars/AvatarWithStatus';
import ChatStore from '@/stores/ChatStore';

interface ChatListItemProps {
  item: IChat;
  currentUserId: string;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ item, currentUserId }) => {
  const [recipient, setRecipient] = useState<IChatUser | null>(null);

  useEffect(() => {
    if (!item.participants) {
      setRecipient(null);
      return;
    }
    if (Array.isArray(item.participants)) {
      const foundParticipant = item.participants.find(p => p.key !== currentUserId);
      setRecipient(foundParticipant?.value ?? null);
    }
  }, [currentUserId, item.participants]);

  const handleOpenChat = async () => {
    if (!recipient) return;
    router.push(`(chat)/${item.id}`);
  
    if (item.lastMessageAuthor !== currentUserId)
      await ChatStore.markChatAsRead(item.id);
  };

  if (!recipient) {
    return null;
  }

  // Вычисляем, является ли чат непрочитанным.
  // Если последнее сообщение отправлено не текущим пользователем и его время (lastCreatedAt)
  // больше, чем время последнего прочтения (lastRead), то чат помечается как непрочитанный.
  const isUnread =
    item.lastMessageAuthor !== currentUserId &&
    item.lastCreatedAt > (item.lastSeen || 0);

  // Выбираем стили контейнера в зависимости от статуса непрочитанности
  const containerStyle = `flex-row justify-between p-1 ml-4 items-center h-17 ${isUnread ? 'bg-blue-100' : 'bg-gray-100'
    } rounded-l-xl`;

  return (
    <>
      <View className={containerStyle}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleOpenChat}>
          <View className="flex-row items-center w-80">
            {/* Аватар с индикатором статуса */}
            <AvatarWithStatus
              onPress={handleOpenChat}
              imageUrl={recipient.avatar}
              isOnline={recipient.isOnline}
            />
            {/* Имя пользователя и последнее сообщение */}
            <View className="flex-col pl-4  w-80">
              <Text className={`text-[16px] ${isUnread ? 'font-nunitoSansBold' : 'font-nunitoSansRegular'} text-black`}>
                {shortenName(recipient.name ?? 'PetOwner')}
              </Text>
              <Text className={`text-gray-600  w-80 ${isUnread ? 'font-nunitoSansBold' : 'font-nunitoSansRegular'}`}>
                {shortenName(item.lastMessage,35) || '...'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {item.id !== (process.env.EXPO_PUBLIC_AI_CHAT_ID + currentUserId) && (
          <ChatMenu chatId={item.id} otherUserId={recipient.id} />
        )}
      </View>
      <Divider bold className="bg-gray-400" />
    </>
  );
};

export default ChatListItem;

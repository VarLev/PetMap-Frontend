import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { BackHandler, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ChatStore from '@/stores/ChatStore';
import { Chat, MessageType } from '@flyerhq/react-native-chat-ui';
import UserStore from '@/stores/UserStore';
import CustomMessageComponent from '@/components/chat/CustomMessageComponent';
import mapStore from '@/stores/MapStore';

const ChatScreen: React.FC = observer(() => {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const userId = UserStore.currentUser?.id;
  const router = useRouter();

  useEffect(() => {
    if (chatId) {
      ChatStore.fetchMessages(chatId);
    }

    const backAction = () => {
      router.replace('/chat/');
      mapStore.setBottomSheetVisible(false)  // Возвращаемся на предыдущий экран
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => {
      ChatStore.clearMessages();
    }; 
    
  }, [chatId]);

  const renderMessage = (message: MessageType.Custom) => {
    return <CustomMessageComponent message={message} />; 
  };


  const handleSendPress = (message: MessageType.PartialText) => {
    if (chatId && UserStore.currentUser) {
      ChatStore.sendMessage(chatId, message.text);
      console.log('ChatStore.messages', ChatStore.messages)
    } else {
      console.error("User or chat ID is not available");
    }
  };

  if (!userId) {
    return <Text>Loading...</Text>;
  }

  return (
    <Chat
      messages={ChatStore.messages as any[]}
      onSendPress={handleSendPress}
      user={{ id: userId }}
      renderCustomMessage={renderMessage}

    />
  );
});

export default ChatScreen;

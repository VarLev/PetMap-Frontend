import React, { useEffect, useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import { BackHandler, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ChatStore from "@/stores/ChatStore";
import { Chat, MessageType, defaultTheme } from "@flyerhq/react-native-chat-ui";
import UserStore from "@/stores/UserStore";
import CustomMessageComponent from "@/components/chat/CustomMessageComponent";
import mapStore from "@/stores/MapStore";
import ChatHeader from "@/components/chat/ChatHeader";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatScreen: React.FC = observer(() => {
  const { chatId, otherUserId } = useLocalSearchParams<{
    chatId: string;
    otherUserId?: string;
  }>();
  const userId = UserStore.currentUser?.id;
  const router = useRouter();
  const [isBlocked, setIsBlocked] = useState(false);

  const checkUserIsBlocked = useCallback(async () => {
    if (!otherUserId) return;
    try {
      const isUserBlocked = await ChatStore.checkBlocked();
      if (isUserBlocked !== isBlocked) {
        setIsBlocked(isUserBlocked);
        console.log("User is blocked?:", isBlocked);
        console.log("ID другого пользователя:", otherUserId);
      }
    } catch (error) {
      console.error("Ошибка при проверке блокировки пользователя:", error);
    }
  }, [otherUserId, isBlocked]);

  useEffect(() => {
    checkUserIsBlocked();
  }, [checkUserIsBlocked]);

  useEffect(() => {
    if (chatId) {
      ChatStore.fetchMessages(chatId);
    }

    const backAction = () => {
      router.replace("/chat/");
      mapStore.setBottomSheetVisible(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
    };
  }, [chatId, router]);

  const renderMessage = useCallback((message: MessageType.Custom) => {
    return <CustomMessageComponent message={message} otherUserId={otherUserId} chatId={chatId} />;
  }, [chatId, otherUserId]);

  const handleSendPress = useCallback(
    (message: MessageType.PartialText) => {
      if (isBlocked || !chatId || !userId) return;
      ChatStore.sendMessage(chatId, message.text, otherUserId);
    },
    [isBlocked, chatId, userId, otherUserId]
  );

  if (!userId) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <ChatHeader item={chatId} />
      <Chat
        locale="ru"
        theme={{
          ...defaultTheme,
          colors: {
            ...defaultTheme.colors,
            inputBackground: "#e8e9eb",
            inputText: "black",
            primary: "#D9CBFF",
          },
          fonts: {
            ...defaultTheme.fonts,
            sentMessageBodyTextStyle: {
              color: "black",
              fontSize: 16,
              fontWeight: "400",
              lineHeight: 24,
            },
            receivedMessageBodyTextStyle: {
              fontSize: 16,
              fontWeight: "400",
              lineHeight: 24,
            },
          },
          borders: {
            ...defaultTheme.borders,
            inputBorderRadius: 10,
            messageBorderRadius: 16,
          },
          insets: {
            ...defaultTheme.insets,
            messageInsetsVertical: 12,
          },
        }}
        messages={ChatStore.messages as any[]}
        onSendPress={handleSendPress}
        user={{ id: userId }}
        renderCustomMessage={renderMessage}
      />
    </SafeAreaView>
  );
});

export default ChatScreen;

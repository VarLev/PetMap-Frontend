import React, { useEffect, useCallback } from "react";
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
  const userId: string | undefined = UserStore.currentUser?.id;
  const router = useRouter();

  const [isBlocked, setIsBlocked] = React.useState(false);

  const checkUserIsBlocked = async (otherUserId: string) => {
    try {
      if (await ChatStore.checkBlocked()) {
        setIsBlocked(true);
        console.log("User is blocked?:", isBlocked);
        console.log("ID другого пользователя:", otherUserId);
      } else {
        setIsBlocked(false);
        console.log("User is blocked?:", isBlocked);
      }
    } catch (error) {
      console.error("Ошибка при проверке блокировки пользователя:", error);
    }
  };

  useEffect(() => {
    if (otherUserId) {
      checkUserIsBlocked(otherUserId);
        }
  }, []);
  useEffect(() => {
    if (chatId) {
      ChatStore.fetchMessages(chatId);
    }

    const backAction = () => {
      router.replace("/chat/");
      mapStore.setBottomSheetVisible(false); // Возвращаемся на предыдущий экран
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
      //ChatStore.clearMessages();
    };
  
  }, [chatId, router]);

  const renderMessage = useCallback((message: MessageType.Custom) => {
    return <CustomMessageComponent message={message} />;
  }, []);

  const handleSendPress = (message: MessageType.PartialText) => {
    if (isBlocked) return;
    if (chatId && UserStore.currentUser) {
      ChatStore.sendMessage(chatId, message.text, otherUserId);
    } else {
      console.error("User or chat ID is not available");
    }
  };

  if (!userId) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <SafeAreaView className="bg-white h-full">
        <ChatHeader item={chatId} />
        <Chat
          locale="ru" // ангийский и испанский есть, нужно только переключить
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
        
            }
          }}
          messages={ChatStore.messages as any[]}
          onSendPress={handleSendPress}
          user={{ id: userId }}
          renderCustomMessage={renderMessage}
        />
      </SafeAreaView>
    </>
  );
});

export default ChatScreen;

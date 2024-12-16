import React, { useEffect, useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { BackHandler, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ChatStore from "@/stores/ChatStore";
import { Chat, MessageType, defaultTheme } from "@flyerhq/react-native-chat-ui";
import UserStore from "@/stores/UserStore";
import CustomMessageComponent from "@/components/chat/CustomMessageComponent";
import mapStore from "@/stores/MapStore";
import ChatHeader from "@/components/chat/ChatHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "@/i18n";



const ChatScreen: React.FC = observer(() => {
  const { chatId, otherUserId } = useLocalSearchParams<{
    chatId: string;
    otherUserId?: string;
  }>();
  const userId = UserStore.currentUser?.id;

  const router = useRouter();
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  useEffect(() => {
    const fetchBlacklist = async () => {
      try {
        await ChatStore.loadBlacklist();
        console.log("Blacklist successfully loaded.");
      } catch (error) {
        console.error("Failed to load blacklist:", error);
      }
    };
  
    fetchBlacklist();
  }, []);


  useEffect(() => {
 
if (!userId || !otherUserId) {
      return;
    }
    
    setIsBlocked(ChatStore.checkIfIBlocked( otherUserId ));
    console.log("is blocked:", isBlocked);
    console.log("blacklist from useEffect:", ChatStore.blacklist);

}, [userId, otherUserId, ChatStore.blacklist]);


  useEffect(() => {
    if (chatId) {
      ChatStore.fetchMessages(chatId);
    }
    

    const backAction = () => {
      router.replace("/chat/");
      mapStore.setBottomSheetVisible(false);
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

  const renderMessage = useCallback(
    (message: MessageType.Custom) => {
      return (
        <CustomMessageComponent
          message={message}
          otherUserId={otherUserId}
          chatId={chatId}
        />
      );
    },
    [chatId, otherUserId]
  );

  const handleSendPress = useCallback(
    (message: MessageType.PartialText) => {
      if (isBlocked) {
        console.log("User is blocked:", isBlocked);
        return;
      }
      if (chatId && UserStore.currentUser) {
        ChatStore.sendMessage(chatId, message.text, otherUserId);
      }
    },
    [isBlocked, chatId, otherUserId]
  );

  if (!userId) {
    return <Text>{i18n.t("chat.loading")}</Text>;
  }


  return (
    <SafeAreaView className="bg-white h-full">
      <ChatHeader item={chatId} />
      <Chat
        locale={i18n.locale as 'en' | 'es' | 'ko' | 'pl' | 'pt' | 'ru' | 'tr' | 'uk' | undefined}
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
            inputBorderRadius: 20,
            messageBorderRadius: 16,
          },
          insets: {
            ...defaultTheme.insets,
            messageInsetsVertical: 12,          
            messageInsetsHorizontal: 16,  
            
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

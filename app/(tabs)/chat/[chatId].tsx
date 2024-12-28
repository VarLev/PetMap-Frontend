import React, { useEffect, useState, useCallback, useRef } from "react";
import { observer } from "mobx-react-lite";
import { BackHandler, Platform, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Chat, MessageType, defaultTheme } from "@flyerhq/react-native-chat-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "@/i18n";
import ChatStore from "@/stores/ChatStore";
import UserStore from "@/stores/UserStore";
import mapStore from "@/stores/MapStore";
import ChatHeader from "@/components/chat/chatView/ChatHeader";
import BottomSheetComponent from "@/components/common/BottomSheetComponent";
import AdvtComponent from "@/components/map/AdvtComponent";
import { IWalkAdvrtDto } from "@/dtos/Interfaces/advrt/IWalkAdvrtDto";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomMessageComponent from "@/components/chat/chatView/CustomMessageComponent";
import { ChatType } from "@/dtos/enum/ChatType";
import { generateChatData } from "@/utils/chatUtils";

const ChatScreen: React.FC = observer(() => {
  const { chatId, otherUserId } = useLocalSearchParams<{chatId: string, otherUserId:string }>();
  const [chat, setChat] = useState<IChat | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string >(UserStore.getCurrentUserId()!);
  const router = useRouter();
  
  const [isBlocked, setIsBlocked] = useState(false);
  const sheetRef = useRef<BottomSheet>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [selectedWalk, setSelectedWalk] = useState<IWalkAdvrtDto | null>(null);
  const [otherUser, setOtherUser] = useState<IChatUser | null>(null);

  // Загружаем чёрный список, FMC-токен и проверяем блокировку
  useEffect(() => {
    const loadData = async () => {
      try { 
        const loadedChat = await ChatStore.getChatById(chatId);
        if(loadedChat){
          // Чат уже существует в базе
          const otherUser = loadedChat?.participants?.find((p) => p.key !== currentUserId)?.value
          if(otherUser){
            setOtherUser(otherUser)
          }
          setChat(loadedChat);
        }
        else {
          // Чат не существует в базе
          const otherUser = await UserStore.getUserById(otherUserId)
          if(otherUser){
            const chatUser: IChatUser = {
              id: otherUser.id,
              firstName: otherUser.name || '',
              imageUrl: otherUser.thumbnailUrl || '',
              isOnline: false
            }
            setOtherUser(chatUser)
          }
          const newChat: IChat = generateChatData(chatId, currentUserId, otherUserId, otherUser);
          setChat(newChat);
          console.log("Chat created", newChat);
        }
        console.log("Chat loaded", loadedChat);
        //await ChatStore.loadBlacklist();
        //const otherUserFmcToken = await ChatStore.getOtherUserFmcTokenByUserId(otherUserId);
        //ChatStore.setOtherUserFmcToken(otherUserFmcToken);

        // if (userId) {
        //   setIsBlocked(ChatStore.checkIfIBlocked(otherUserId));
        // }
      } catch (error) {
        console.error("Failed to load blacklist:", error);
      }
    };
    loadData();
  }, [chatId, otherUserId]);

  // Загружаем сообщения + обработчик кнопки "Назад"
  useEffect(() => {
    if (chatId) {
      ChatStore.fetchMessages(chatId);
    }

    const handleBackPress = () => {
      router.back();
      mapStore.setBottomSheetVisible(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => backHandler.remove();
  }, [chatId, router]);

  const handleSendPress = useCallback(
    async (message: MessageType.PartialText) => {
      if (chatId && UserStore.currentUser) {
        console.log(chat);
        const chatData = await ChatStore.sendMessage(chat!, message.text);
        if(chatData?.chatType === ChatType.NewChat){
          console.log("New chat created", chatData.thisChatId);
          router.replace(`/chat/${chatData.thisChatId}`);
        }
      }
    },
    [chat, chatId, router]
  );

  const handleOpenWalkDetails = useCallback((walk: IWalkAdvrtDto) => {
    setSelectedWalk(walk);
    setIsSheetVisible(true);
    sheetRef.current?.expand();
  }, []);

  const renderMessage = useCallback((message: MessageType.Custom) => {
    return (
      <CustomMessageComponent
        message={message}
        openWalkDitails={handleOpenWalkDetails}
      />
    );
  }, [handleOpenWalkDetails]);

  const handleOpenProfile = useCallback(() => {
    if (otherUser) {
      router.push(`/(tabs)/profile/${otherUser.id}`);
    }
  }, [otherUser, router]);

  if (!currentUserId) {
    return <Text>{i18n.t("chat.loading")}</Text>;
  }

  return (
    <>
      <SafeAreaView className="bg-white h-full">
        <ChatHeader
          userName={otherUser?.firstName ?? "..."}
          avatarUrl={otherUser?.imageUrl}
          onPressAvatar={handleOpenProfile}
        />
       
        <Chat
          locale={i18n.locale as "en" | "es" | "ru" | undefined}
          sendButtonVisibilityMode="always"
          
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
                lineHeight: 18,
                fontFamily: "NunitoSans-Regular",
              },
              receivedMessageBodyTextStyle: {
                fontSize: 16,
                lineHeight: 18,
                fontFamily: "NunitoSans-Regular",
              },
            },
            borders: {
              ...defaultTheme.borders,
              inputBorderRadius: 10,
              messageBorderRadius: 16,
              
            },
            insets: {
              ...defaultTheme.insets,
              messageInsetsVertical: 10,
              messageInsetsHorizontal: 10,
            },
          }}
          messages={ChatStore.messages}
          onSendPress={handleSendPress}
          user={{ id: currentUserId }}
          renderCustomMessage={renderMessage}
          emptyState={() => <Text></Text>}
          {...(Platform.OS === "ios" && { enableAnimation: true })}
          showUserAvatars
          //showUserNames
          timeFormat="HH:mm DD MMM"
        />

      </SafeAreaView>

      {isSheetVisible && (
        <BottomSheetComponent
          ref={sheetRef}
          snapPoints={["40%"]}
          renderContent={selectedWalk ? (
            <AdvtComponent
              advrt={selectedWalk}
              onInvite={() => {}}
              onClose={() => {}}
              isShort
            />
          ) : null}
          onClose={() => {
            setIsSheetVisible(false);
            setSelectedWalk(null);
          }}
          enablePanDownToClose
          initialIndex={0}
        />
      )}
    </>
  );
});

export default ChatScreen;


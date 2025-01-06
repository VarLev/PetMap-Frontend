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
import { generateChatData, translateText } from "@/utils/chatUtils";
import TranslatableTextMessage from "@/components/chat/chatView/TranslatableTextMessage";

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

  const [translatedMessages, setTranslatedMessages] = useState<Record<string, string>>({})
  const [loadingTranslation, setLoadingTranslation] = useState<Record<string, boolean>>({})
  const hasSubscription = UserStore.currentUser?.isPremium ?? false;  

  // Загружаем чёрный список, FMC-токен и проверяем блокировку
  useEffect(() => {
    const loadData = async () => {
      try { 
        console.log("ChatId", chatId);
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
          console.log("otherUserId", otherUserId);
          const otherDbUser = await UserStore.getUserById(otherUserId)
          const otherUserOnlineStatus = await ChatStore.getUserStatus(otherDbUser.id);
          console.log("Other user online status", otherUserOnlineStatus);
          if(otherDbUser){
            const chatUser: IChatUser = {
              id: otherDbUser.id,
              name: otherDbUser.name || '',
              thumbnailUrl: otherDbUser.thumbnailUrl || '',
              isOnline: otherUserOnlineStatus
            }
            setOtherUser(chatUser)
            const newChat: IChat = generateChatData(chatId, currentUserId, otherUserId, chatUser);
            setChat(newChat);
          }
          
        }
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

  // ---------------------------
  // Функции для перевода
  // ---------------------------

  // При нажатии "Перевести"
  const handleTranslatePress = useCallback(async (message: MessageType.Text) => {
    // Ставим флаг загрузки
    setLoadingTranslation((prev) => ({ ...prev, [message.id]: true }))
    try {
      const result = await translateText(message.text, "ru"); // Пример: переводим на русский
      // Сохраняем результат
      setTranslatedMessages((prev) => ({ ...prev, [message.id]: result }))
    } catch (err) {
      console.error("Ошибка при переводе:", err);
    } finally {
      setLoadingTranslation((prev) => ({ ...prev, [message.id]: false }))
    }
  }, []);

   // При нажатии "Показать оригинал"
   const handleShowOriginalPress = useCallback((messageId: string) => {
    setTranslatedMessages((prev) => {
      const updated = { ...prev }
      delete updated[messageId]
      return updated
    })
  }, []);

  // ---------------------------
  // Рендер обычных текстовых сообщений с переводом
  // ---------------------------
  const renderTextMessage = useCallback(
    (message: MessageType.Text, messageWidth: number, showName: boolean) => {
      const translatedText = translatedMessages[message.id]
      const isLoading = loadingTranslation[message.id]

      return (
        <TranslatableTextMessage
          message={message}
          translatedText={translatedText}
          isLoading={isLoading}
          onTranslate={handleTranslatePress}
          onShowOriginal={handleShowOriginalPress}
        />
      )
    },
    [translatedMessages, loadingTranslation]
  )


  const handleSendPress = useCallback(
    async (message: MessageType.PartialText) => {
      if (chatId && UserStore.currentUser) {
        console.log(chat);
        const chatData = await ChatStore.sendMessageUniversal(chat!, message.text);
        if(chatData?.chatType === ChatType.NewChat){
          router.replace(`/[chatId]/${chatData.thisChatId}`);
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
      router.push(`/(user)/${otherUser.id}`);
    }
  }, [otherUser, router]);

  if (!currentUserId) {
    return <Text>{i18n.t("chat.loading")}</Text>;
  }

  return (
    <>
      <SafeAreaView className="bg-white h-full">
        <ChatHeader
          userName={otherUser?.name ?? "..."}
          avatarUrl={otherUser?.thumbnailUrl}
          onPressAvatar={handleOpenProfile}
          isOnline={otherUser?.isOnline}
          hasSubscription={hasSubscription}
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
          // Рендерим КАСТОМНЫЕ сообщения (системные/специальные)
          renderCustomMessage={renderMessage}
          renderTextMessage={renderTextMessage}
          emptyState={() => <Text></Text>}
          {...(Platform.OS === "ios" && { enableAnimation: true })}
          showUserAvatars
          //showUserNames
         
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


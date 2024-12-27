import React, { useEffect, useState, useCallback, useRef } from "react";
import { observer } from "mobx-react-lite";
import { BackHandler, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Chat, MessageType, defaultTheme } from "@flyerhq/react-native-chat-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "@/i18n";
import ChatStore from "@/stores/ChatStore";
import UserStore from "@/stores/UserStore";
import mapStore from "@/stores/MapStore";
import CustomMessageComponent from "@/components/chat/CustomMessageComponent";
import ChatHeader from "@/components/chat/ChatHeader";
import BottomSheetComponent from "@/components/common/BottomSheetComponent";
import AdvtComponent from "@/components/map/AdvtComponent";
import { IWalkAdvrtDto } from "@/dtos/Interfaces/advrt/IWalkAdvrtDto";
import BottomSheet from "@gorhom/bottom-sheet";

const ChatScreen: React.FC = observer(() => {
  const { chatId, otherUserId, otherUserName, avatarUrl } = useLocalSearchParams<{
    chatId: string;
    otherUserId?: string;
    otherUserName?: string;
    avatarUrl?: string;
  }>();
  const router = useRouter();
  const userId = UserStore.currentUser?.id;

  const [isBlocked, setIsBlocked] = useState(false);

  const sheetRef = useRef<BottomSheet>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [selectedWalk, setSelectedWalk] = useState<IWalkAdvrtDto | null>(null);

  // Загружаем чёрный список, FMC-токен и проверяем блокировку
  useEffect(() => {
    if (!otherUserId) return;

    const loadData = async () => {
      try {
        await ChatStore.loadBlacklist();
        if (__DEV__) {
          console.log("Blacklist successfully loaded.");
        }

        console.log("Other user ID:", otherUserId);
        const otherUserFmcToken = await ChatStore.getOtherUserFmcTokenByUserId(otherUserId);
        console.log("Other user FMC token:", otherUserFmcToken);
        ChatStore.setOtherUserFmcToken(otherUserFmcToken);

        if (userId) {
          setIsBlocked(ChatStore.checkIfIBlocked(otherUserId));
        }
      } catch (error) {
        console.error("Failed to load blacklist:", error);
      }
    };
    loadData();
  }, [otherUserId, userId]);

  // Загружаем сообщения + обработчик кнопки "Назад"
  useEffect(() => {
    if (chatId) {
      ChatStore.fetchMessages(chatId);
    }

    const handleBackPress = () => {
      router.replace("/chat/");
      mapStore.setBottomSheetVisible(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => backHandler.remove();
  }, [chatId, router]);

  const handleSendPress = useCallback(
    (message: MessageType.PartialText) => {
      if (isBlocked) {
        console.log("User is blocked.");
        return;
      }
      if (chatId && UserStore.currentUser) {
        ChatStore.sendMessage(chatId, message.text, otherUserId);
      }
    },
    [isBlocked, chatId, otherUserId]
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
    if (otherUserId) {
      router.push(`/(tabs)/profile/${otherUserId}`);
    }
  }, [otherUserId, router]);

  if (!userId) {
    return <Text>{i18n.t("chat.loading")}</Text>;
  }

  return (
    <>
      <SafeAreaView className="bg-white h-full">
        <ChatHeader
          userName={otherUserName ?? ""}
          avatarUrl={avatarUrl}
          onPressAvatar={handleOpenProfile}
        />
        <Chat
          locale={i18n.locale as "en" | "es" | "ru" | undefined}
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
          messages={ChatStore.messages}
          onSendPress={handleSendPress}
          user={{ id: userId }}
          renderCustomMessage={renderMessage}
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
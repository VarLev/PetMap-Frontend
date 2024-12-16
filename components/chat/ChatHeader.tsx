import React, { useMemo, useCallback } from "react";
import { Text, View, Image } from "react-native";
import { Divider, IconButton } from "react-native-paper";
import { router } from "expo-router";
import ChatStore from "@/stores/ChatStore";
import { shortenName } from "@/utils/utils";
import i18n from "@/i18n";

interface ChatHeaderProps {
  item: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ item }) => {
  // Извлекаем данные чата единожды, используя useMemo
  const chatData = useMemo(() => {
    return item ? ChatStore.chats.find((chat) => chat.id === item) : null;
  }, [item]);

  const userId = chatData?.otherUserId;

  // Форматирование времени "last seen" пользователя
  const showLastSeenTime = useCallback((userId?: string) => {
    if (userId) {
      const lastSeen = ChatStore.lastSeen[userId] ?? chatData?.lastCreatedAt;
      if (lastSeen) {
        const now = Date.now();
        const diff = now - lastSeen;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (minutes < 1) {
          return i18n.t("chat.time.lessThanAMinute");
        }

        if (minutes <= 10) return `${i18n.t("chat.time.was")} ${minutes} ${getMinuteLabel(minutes)} ${i18n.t("chat.time.ago")}`;

        if (days > 0) {
          const lastSeenDate = new Date(lastSeen);
          return `${i18n.t("chat.time.was")} ${lastSeenDate.getDate()}${i18n.t("chat.time.d")} ${lastSeenDate.getHours()}${i18n.t("chat.time.h")} ${lastSeenDate.getMinutes()}${i18n.t("chat.time.m")} ${i18n.t("chat.time.ago")}`;
        }

        const lastSeenDate = new Date(lastSeen);
        return i18n.t("chat.time.wasAt", {
          time: `${lastSeenDate.getHours()}:${String(lastSeenDate.getMinutes()).padStart(2, "0")}`,
        });
      }

      return i18n.t("chat.time.wasUnknown");
    }

    return "";
  }, [chatData?.lastCreatedAt]);

  // Функция для получения правильного падежа минут
  const getMinuteLabel = (minutes: number) => {
    if (minutes === 1) return i18n.t("chat.time.minute");
    if (minutes < 5) return i18n.t("chat.time.minutesTwo");
    return i18n.t("chat.time.minutes");
  };

  // Обработчик нажатия кнопки "Назад"
  const handleBack = () => router.push("/(tabs)/chat/");

  const otherUserName = chatData?.otherUserName;

   return (
    <>
      <View className="flex-row items-center justify-start gap-2 py-2 shadow-md">
        <IconButton icon="arrow-left" size={24} onPress={handleBack} />
        <Image
          source={{ uri: chatData?.thumbnailUrl ?? "https://i.pravatar.cc/200" }}
          className="rounded-xl h-16 w-16"
        />
        <View>
          <Text className="text-lg font-nunitoSansBold">{shortenName(otherUserName)}</Text>
          <Text className="text-[13px] font-nunitoSansRegular text-[#87878A]">
            {showLastSeenTime(userId)}
          </Text>
        </View>
      </View>
      <Divider className="w-full" style={{ elevation: 2 }} />
    </>
  );
};

export default ChatHeader;

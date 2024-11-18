import React, { useEffect, useState, useMemo } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { Divider, IconButton } from "react-native-paper";
import { router } from "expo-router";
import ChatStore from "@/stores/ChatStore";

interface ChatHeaderProps {
  item: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ item }) => {
  const [time, setTime] = useState(Date.now());
  // Извлекаем данные чата единожды, используя useMemo
  const chatData = useMemo(() => {
    return item ? ChatStore.chats.find((chat) => chat.id === item) : null;
  }, [item]);

  //const chatData = getChatData();

  const userId = chatData?.otherUserId;

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 60000); // Каждую минуту

    return () => clearInterval(interval); // Очищаем таймер при размонтировании
  }, []);

  const showLastSeenTime = (userId?: string) => {
    if (userId) {
      const lastSeen = ChatStore.lastSeen[userId] ?? chatData?.lastCreatedAt;
      if (lastSeen) {
        const now = Date.now();
        const diff = now - lastSeen;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (minutes < 1) {
          return "менее минуты назад";
        } else if (minutes <= 10) {
          return `Был(а) ${minutes} ${
            minutes === 1 ? "минуту" : minutes < 5 ? "минуты" : "минут"
          } назад`;
        } else if (days > 0) {
          const lastSeenDate = new Date(lastSeen);
          return `Был(а) в ${lastSeenDate.getDate()}д ${lastSeenDate.getHours()}ч ${lastSeenDate.getMinutes()}м `;
        } else {
          const lastSeenDate = new Date(lastSeen);
          return `Был(а) в ${lastSeenDate.getHours()}:${lastSeenDate
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
        }
      }
      return "Был(а): Неизвестно";
    } else {
      console.log("User ID is undefined, cannot retrieve lastSeen");
      return "";
    }
  };

  const handleBack = () => {
    router.push("/(tabs)/chat/");
  };

   return (
    <>
      <View className="flex-row items-center justify-start gap-2 py-2 shadow-md">
        <IconButton icon="arrow-left" size={24} onPress={handleBack} />
        <TouchableOpacity onPress={() => router.push(`/profile/${userId}`)}>
          <Image
            source={{
              uri: chatData?.thumbnailUrl ?? "https://i.pravatar.cc/200",
            }}
            className="rounded-xl h-16 w-16"
          />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-nunitoSansBold">
          {chatData?.otherUserName}
          </Text>
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

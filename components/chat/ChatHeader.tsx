import React, { useEffect, useState } from "react";
import { Text, View, Image } from "react-native";
import { Divider, IconButton } from "react-native-paper";
import { router } from "expo-router";
import { shortenName } from "@/utils/utils";
import { decode as atob } from 'base-64';
import { TouchableOpacity } from "react-native-gesture-handler";

interface ChatHeaderProps {
  userName: string;
  avatarUrl?: string;
  onPressAvatar?: () => void; // Новый проп
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ userName, avatarUrl, onPressAvatar }) => {
  const [decodedAvatarUrl, setDecodedAvatarUrl] = useState<string | undefined>();

  useEffect(() => {
    if (avatarUrl) {
      try {
        const decoded = atob(avatarUrl);
        setDecodedAvatarUrl(decoded);
      } catch (error) {
        console.error("Error decoding avatar URL:", error);
        setDecodedAvatarUrl("https://i.pravatar.cc/200");
      }
    } else {
      setDecodedAvatarUrl("https://i.pravatar.cc/200");
    }
  }, [avatarUrl]);

  // Обработчик нажатия кнопки "Назад"
  const handleBack = () => router.push("/(tabs)/chat/");

  return (
    <>
      <View className="flex-row items-center justify-start gap-2 py-2 shadow-md">
        <IconButton icon="arrow-left" size={24} onPress={handleBack} />
        <TouchableOpacity onPress={onPressAvatar}>
          <Image
            source={{ uri: decodedAvatarUrl }}
            className="rounded-xl h-16 w-16"
          />
        </TouchableOpacity>
        <View>
          <Text className="text-lg font-nunitoSansBold">{shortenName(userName)}</Text>
        </View>
      </View>
      <Divider className="w-full" style={{ elevation: 2 }} />
    </>
  );
};

export default ChatHeader;
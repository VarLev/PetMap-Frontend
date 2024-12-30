import React from "react";
import { Text, View } from "react-native";
import { Divider, IconButton } from "react-native-paper";
import { router } from "expo-router";
import { shortenName } from "@/utils/utils";

import AvatarWithStatus from "@/components/custom/avatars/AvatarWithStatus";

interface ChatHeaderProps {
  userName: string;
  avatarUrl?: string;
  onPressAvatar?: () => void; // Новый проп
  isOnline?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ userName, avatarUrl, onPressAvatar , isOnline}) => {
  
  // Обработчик нажатия кнопки "Назад"
  const handleBack = () => router.replace("/chat");

  return (
    <>
      <View className="flex-row items-center justify-start gap-2 py-2 shadow-md">
        <IconButton icon="arrow-left" size={24} onPress={handleBack} />
        <AvatarWithStatus onPress={onPressAvatar || (() => {})} imageUrl={avatarUrl} isOnline={isOnline}  />
        <View>
          <Text className="text-lg font-nunitoSansBold">{shortenName(userName)}</Text>
        </View>
      </View>
      <Divider className="w-full" style={{ elevation: 2 }} />
    </>
  );
};

export default ChatHeader;
import React, { useEffect, useState } from "react";
import { Text, View, Switch, Alert, BackHandler } from "react-native";
import { Divider, IconButton } from "react-native-paper";
import { router } from "expo-router";
import { shortenName } from "@/utils/utils";

import AvatarWithStatus from "@/components/custom/avatars/AvatarWithStatus";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { BG_COLORS } from "@/constants/Colors";
import uiStore from "@/stores/UIStore";
import i18n from "@/i18n";

interface ChatHeaderProps {
  userName: string;
  avatarUrl?: string;
  onPressAvatar?: () => void; // Новый проп
  isOnline?: boolean;
  lastOnline?: string;
  hasSubscription: boolean; // Новый проп для проверки подписки
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ userName, avatarUrl, onPressAvatar, isOnline, lastOnline, hasSubscription }) => {
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(false);
  
  // Обработчик нажатия кнопки "Назад"
  const handleBack = () =>{
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/chat");
    }
  
    return true;
  }

  // Переключение перевода с проверкой подписки
  const toggleTranslation = () => {
    if (!hasSubscription) {
      router.push("/(paywall)/pay");
      // Alert.alert(
      //   "Подписка",
      //   "Для включения перевода необходимо оформить подписку.",
      //   [
      //     { text: "Посмотреть подписку", onPress: () => router.replace("app/(paywall)"), style:"default" },
      //     { text: "Отмена", style: "cancel" },
          
      //   ]
      // );
      return;
    }
    uiStore.setIsChatTranslatinEnabled(!isTranslationEnabled);
    setIsTranslationEnabled(!isTranslationEnabled);
    
  };

  return (
    <>
      <View className="flex-row items-center justify-between py-2 ">
        <View className="flex-row items-center gap-2">
          <IconButton icon="arrow-left" size={24} onPress={handleBack} />
          <AvatarWithStatus onPress={onPressAvatar || (() => {})} imageUrl={avatarUrl} isOnline={isOnline} />
          <View>
            <Text className="text-lg font-nunitoSansBold">{shortenName(userName)}</Text>
            {isOnline ? 
            <Text className="text-xs font-nunitoSansRegular text-emerald-600">Online</Text>
            :
             <><Text className="text-xs font-nunitoSansRegular">{i18n.t("lastOnline")}</Text><Text className="text-xs font-nunitoSansRegular">{lastOnline}</Text></>}
            
          </View>
        </View>
        <View className="flex-row items-center gap-2 pr-4">
          <FontAwesome6 name="language" size={24} color={BG_COLORS.violet[300]} />
          <Switch
            value={isTranslationEnabled}
            onValueChange={toggleTranslation}
            thumbColor={BG_COLORS.violet[300]}
            trackColor={{ false: BG_COLORS.gray[100], true: BG_COLORS.violet[300] }}
          />
        </View>
      </View>
      <Divider className="w-full" style={{ elevation: 2 }} />
    </>
  );
};

export default ChatHeader;

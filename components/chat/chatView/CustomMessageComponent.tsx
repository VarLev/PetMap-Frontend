import React, { memo, useState, useEffect } from "react";
import { View, Text } from "react-native";
import { MessageType } from "@flyerhq/react-native-chat-ui";
import { IWalkAdvrtDto } from "@/dtos/Interfaces/advrt/IWalkAdvrtDto";
import mapStore from "@/stores/MapStore";

import i18n from "@/i18n";
import CustomButtonOutlined from "@/components/custom/buttons/CustomButtonOutlined";
import petStore from "@/stores/PetStore";
import userStore from "@/stores/UserStore";

interface AdvtProps {
  message: MessageType.Custom;
  openWalkDitails: (walk: IWalkAdvrtDto) => void;
}

// ----------------------------------------------------
// Анимация "TypingDots"
// ----------------------------------------------------
const TypingDots = () => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prev) => {
        switch (prev) {
          case ".":
            return "..";
          case "..":
            return "...";
          case "...":
            return "....";
          case "....":
          return ".....";
          default:
            return ".";
        }
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View className="p-2 bg-[#EEE] rounded-lg flex-row items-center">
      <Text className="text-[#555] text-2xl">{dots}</Text>
    </View>
  );
};

// ----------------------------------------------------
// Основной компонент
// ----------------------------------------------------
const CustomMessageComponent = memo(({ message, openWalkDitails }: AdvtProps) => {
  // Если это "typing-indicator", показываем анимацию точек
  if (message.id === "typing-indicator") {
    return <TypingDots />;
  }

  // Иначе рендерим ваше кастомное сообщение-приглашение
  const advrtId = message.metadata?.advrtId;
  
  const handleAccept = async () => {
   
    //const walk = await mapStore.getWalkAdvrtById(advrtId);
    const walk = mapStore.walkAdvrts.find((advrt) => advrt.id === advrtId);
    
   
    if (walk) {
      openWalkDitails(walk);
    } else {
      console.error("Walk advertisement not found");
    }
  };

  return (
    <>
      <View className="p-4">
        <Text className="color-[#2F00B6] font-nunitoSansBold text-[16px]">
          {i18n.t("chat.invitation")}
        </Text>
      </View>
      <View className="bg-white h-3"></View>
      <View>
        <View className="flex-row justify-between items-center bg-white ">
          <CustomButtonOutlined
            title={i18n.t("chat.check")}
            handlePress={handleAccept}
            containerStyles="flex-1 color-[#2F00B6] -mt-1"
          />
        </View>
      </View>
    </>
  );
});

CustomMessageComponent.displayName = "CustomMessageComponent";
export default CustomMessageComponent;

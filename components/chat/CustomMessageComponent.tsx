import React, { memo } from "react";
import { View, Text } from "react-native";
import { MessageType } from "@flyerhq/react-native-chat-ui";
import { IWalkAdvrtDto } from "@/dtos/Interfaces/advrt/IWalkAdvrtDto";
import mapStore from "@/stores/MapStore";
import CustomButtonOutlined from "../custom/buttons/CustomButtonOutlined";
import i18n from "@/i18n";

interface AdvtProps {
  message: MessageType.Custom;
  openWalkDitails: (walk:IWalkAdvrtDto) => void;
}

const CustomMessageComponent = memo(({ message, openWalkDitails }: AdvtProps) => {
  const advrtId = message.metadata?.advrtId;
  const handleAccept = async () => {
    const walk = await mapStore.getWalkAdvrtById(advrtId);
    console.log(walk);
    openWalkDitails(walk);
    
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
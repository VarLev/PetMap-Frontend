import React, { useState } from "react";
import { FlatList, Pressable, View, Image } from "react-native";
import { femaleAvatars, maleAvatars } from "@/constants/Avatars";
import { Text, Switch } from "react-native-paper";
import i18n from "@/i18n";
import CustomButtonPrimary from "../custom/buttons/CustomButtonPrimary";
import { BG_COLORS } from "@/constants/Colors";

interface AvatarSelectorProps {
  onAvatarSelect: (avatar: number, isMail: boolean) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ onAvatarSelect }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [isMale, setIsMale] = useState(false);

  const handleAvatarSelect = (index: number) => {
    setSelectedAvatar(index);
    onAvatarSelect(index, isMale);
  };

  const handleToggle = () => {
    setSelectedAvatar(null);
    setIsMale(!isMale);
  };

  const avatars = isMale ? maleAvatars : femaleAvatars;

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="flex-row justify-center items-center mb-4">
        <Text className="text-xl mr-2">{i18n.t("avatar.female")}</Text>
        <Switch value={isMale} onValueChange={handleToggle} trackColor={{ false: BG_COLORS.violet[300], true: BG_COLORS.violet[300] }} thumbColor={BG_COLORS.violet[600]}/>
        <Text className="text-xl ml-2">{i18n.t("avatar.male")}</Text>
      </View>

      <Text className="text-center text-xl mb-4">{i18n.t("avatar.selectAvatarTitle")}</Text>
      <Text className=" leading-tight text-md font-nunitoSansRegular text-center">
        {i18n.t("avatar.selectAvatarDescription")}
      </Text>

      <FlatList
      className="self-center"
        data={avatars}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => handleAvatarSelect(index)}
            className={`m-2 p-2 rounded ${
              selectedAvatar === index ? "border-2 border-purple-500" : ""
            }`}
          >
            <Image
              source={item} // Используем item напрямую, так как это объект изображения
              className="w-32 h-32 rounded-full"
            />
          </Pressable>
        )}
        numColumns={2}
        keyExtractor={(_, index) => index.toString()}
      />
      <CustomButtonPrimary
        title={i18n.t("avatar.save")}
        handlePress={() => onAvatarSelect(selectedAvatar || 0, isMale)}
        containerStyles="mt-4"
      />
    </View>
  );
};

export default AvatarSelector;

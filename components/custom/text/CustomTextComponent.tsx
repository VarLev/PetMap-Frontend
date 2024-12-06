import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { IconButton } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import uiStore from "@/stores/UIStore";

interface CustomTextComponentProps {
  text?: string | number | string[] | null;
  leftIcon?: string;
  rightIcon?: string | null;
  onRightIconPress?: () => void;
  maxLines?: number;
  iconSet?:
    | "material"
    | "paper"
    | "fontAwesome"
    | "simpleLine"
    | "ionicons"
    | "materialCommunity";
  separator?: string;
  className_?: string; // Используем className для стилизации через NativeWind
  textStyle?: object;
  enableTranslation?: boolean; // Условная функциональность перевода
}

const CustomTextComponent: React.FC<CustomTextComponentProps> = ({
  text,
  leftIcon,
  rightIcon,
  onRightIconPress,
  maxLines = 2,
  iconSet = "material",
  separator = ", ",
  className_ = "",
  textStyle = {},
  enableTranslation = false,
}) => {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const displayText = Array.isArray(text) ? text.join(separator) : text;

  const handleTranslate = async () => {
    if (!displayText) return;
    setLoading(true);
    try {
      const translated = await uiStore.translateText(displayText.toString());
      setTranslatedText(translated);
    } catch (error) {
      console.error("Ошибка перевода:", error);
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTranslation = () => {
    setTranslatedText(null);
  };

  return (
    <View className={`py-2 flex-row items-center ${className_}`}>
      {leftIcon &&
        (iconSet === "material" ? (
          <MaterialIcons name={leftIcon} size={20} color="#b39ddb" />
        ) : iconSet === "fontAwesome" ? (
          <FontAwesome name={leftIcon} size={20} color="#b39ddb" />
        ) : iconSet === "simpleLine" ? (
          <SimpleLineIcons name={leftIcon} size={20} color="#b39ddb" />
        ) : iconSet === "ionicons" ? (
          <Ionicons name={leftIcon} size={20} color="#b39ddb" />
        ) : iconSet === "materialCommunity" ? (
          <MaterialCommunityIcons
            name={leftIcon as any}
            size={20}
            color="#b39ddb"
          />
        ) : (
          <IconButton icon={leftIcon} size={20} />
        ))}
      <Text
        numberOfLines={maxLines}
        ellipsizeMode="tail"
        className="flex-1 pl-2 text-base font-nunitoSansRegular leading-5"
        style={textStyle}
      >
        {translatedText || displayText}
      </Text>
      {enableTranslation && text && (
        <>
          {!translatedText ? (
            <TouchableOpacity
              onPress={handleTranslate}
              disabled={loading}
              className="h-6 justify-start items-start"
            >
              {!loading ? (
                <MaterialIcons name="g-translate" size={20} color="#b39ddb" />
              ) : (
                <ActivityIndicator size="small" color="#b39ddb" />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleCancelTranslation}
              className="h-6 justify-start items-start"
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color="#b39ddb"
              />
            </TouchableOpacity>
          )}
        </>
      )}
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <MaterialIcons name={rightIcon} size={20} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomTextComponent;

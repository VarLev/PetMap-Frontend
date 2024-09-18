import React from "react";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";

type InputTextProps = {
  value?: string;
  placeholder?: string;
  handleChange?: (text: string) => void;
  handleClick?: () => void;
  containerStyles?: string;
  inputStyles?: string;
  label?: string;
  labelStyles?: string;
  labelInput?: string;
};

const CustomInputText = ({
  value,
  placeholder,
  handleChange,
  handleClick,
  containerStyles,
  inputStyles,
  label,
  labelStyles,
  labelInput,
}: InputTextProps) => {
  return (
    <View className={`w-full ${containerStyles}`}>
      {label && (
        <Text className={` text-base font-nunitoSansRegular ${labelStyles}`}>
          {label}
        </Text>
      )}
      <TextInput
        mode="outlined"
        label={labelInput}
        value={value}
        theme={{ roundness: 10 }}
        placeholder={placeholder}
        onChangeText={handleChange}
        onFocus={handleClick}
        keyboardType="default"
        style={{
          backgroundColor: "white",
          height: 50,
        }}
        outlineColor="#d1d5db" // Цвет рамки при неактивном состоянии
        activeOutlineColor="#6b7280" // Цвет рамки при фокусе
        className={`text-base font-nunitoSansRegular ${inputStyles}`}
      />
    </View>
  );
};

export default CustomInputText;

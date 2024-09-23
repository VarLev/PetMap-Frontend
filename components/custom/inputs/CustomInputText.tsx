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
    // <View className={`w-full ${containerStyles}`}>
    //   {label && <Text className={`text-gray-700 text-base font-nunitoSansRegular mb-2 ${labelStyles}`}>{label}</Text>}
    //   <TextInput
    //     value={value}
    //     placeholder={placeholder}
    //     onChangeText={handleChange}
    //     onFocus={handleClick}

    //     className={`border border-gray-300 text-base font-nunitoSansRegular rounded-lg px-4 py-2 ${inputStyles}`}
    //   />
    // </View>
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
        theme={{ roundness: 8 }}
        placeholder={placeholder}
        onChangeText={handleChange}
        onFocus={handleClick}
        keyboardType="default"
        style={{
          backgroundColor: "white",
          height: 50,
        }}
        outlineStyle= {{borderWidth: 1}}
        outlineColor="#d1d5db" // Цвет рамки при неактивном состоянии
        activeOutlineColor="#ababab" // Цвет рамки при фокусе
        className={`text-base font-nunitoSansRegular ${inputStyles}`}
      />
    </View>
  );
};

export default CustomInputText;

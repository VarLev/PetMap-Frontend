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
  allowOnlyLetters?: boolean; // Новый пропс для ограничения ввода
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
  allowOnlyLetters = false, // По умолчанию отключено
}: InputTextProps) => {
  // Функция обработки ввода
  const handleTextChange = (text: string) => {
    if (allowOnlyLetters) {
      const filteredText = text.replace(/[^a-zA-Zа-яА-ЯёЁ\"\'\.–-\s]/g, ""); // Удаляем все, кроме букв, тире, кавычек и пробелов
      handleChange && handleChange(filteredText);
    } else {
      handleChange && handleChange(text);
    }
  };

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
        theme={{ roundness: 8 }}
        placeholder={placeholder}
        onChangeText={handleTextChange} // Используем обработчик с фильтрацией
        onFocus={handleClick}
        keyboardType="default"
        style={{
          backgroundColor: "white",
          height: 50,
        }}
        outlineStyle={{ borderWidth: 1 }}
        outlineColor="#d1d5db" // Цвет рамки при неактивном состоянии
        activeOutlineColor="#ababab" // Цвет рамки при фокусе
        className={`text-base font-nunitoSansRegular ${inputStyles}`}
      />
    </View>
  );
};

export default CustomInputText;

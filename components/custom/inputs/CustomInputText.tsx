import React from "react";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  // Если у вас есть фиксированный заголовок, можно прибавить его высоту
  const headerOffset = 60; // Замените на фактическую высоту вашего заголовка, если требуется

  // Вычисляем отступ для клавиатуры (для iOS учитываем безопасную зону сверху)
  const keyboardOffset = Platform.OS === "ios" ? insets.top + headerOffset : 0;


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ?"position" : undefined}
      keyboardVerticalOffset={keyboardOffset} // настройте отступ по необходимости
      className={`w-full ${containerStyles}`}
    >
    <View className={`w-full`}>
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
    </KeyboardAvoidingView>
  );
};

export default CustomInputText;

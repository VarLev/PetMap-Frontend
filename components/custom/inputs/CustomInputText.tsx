import React from "react";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Определяем тип для набора разрешённых символов
type AllowedSymbol = 'latin' | 'spanish' | 'cyrillic' | 'social';

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
  allowOnlyLetters?: boolean; // Флаг для ограничения ввода
  allowedSymbols?: AllowedSymbol[]; // Массив разрешённых символов
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
  allowOnlyLetters = false,
  allowedSymbols,
}: InputTextProps) => {
  // Обработчик ввода текста с фильтрацией по разрешённым символам
  const handleTextChange = (text: string) => {
    if (allowOnlyLetters) {
      // Если allowedSymbols не передан или пустой, используем набор по умолчанию
      const allowedSet: AllowedSymbol[] =
        allowedSymbols && allowedSymbols.length ? allowedSymbols : ['latin', 'spanish', 'cyrillic', 'social'];

      let allowedChars = "";
      if (allowedSet.includes('latin')) {
        allowedChars += "a-zA-Z";
      }
      if (allowedSet.includes('spanish')) {
        // Испанские символы: áéíóúÁÉÍÓÚüÜñÑ
        allowedChars += "áéíóúÁÉÍÓÚüÜñÑ";
      }
      if (allowedSet.includes('cyrillic')) {
        allowedChars += "а-яА-Я";
      }
      if (allowedSet.includes('social')) {
        // Символы для соцсетей: . _ -
        allowedChars += "._-";
      }
      // Создаём регулярное выражение для удаления недопустимых символов
      const regex = new RegExp(`[^${allowedChars}\\s-]`, "g");
      const filteredText = text.replace(regex, "");
      handleChange && handleChange(filteredText);
    } else {
      handleChange && handleChange(text);
    }
  };

  const insets = useSafeAreaInsets();
  const headerOffset = 60; // При необходимости можно заменить на высоту вашего заголовка
  const keyboardOffset = Platform.OS === "ios" ? insets.top + headerOffset : 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "position" : undefined}
      keyboardVerticalOffset={keyboardOffset}
      className={`w-full ${containerStyles}`}
    >
      <View className="w-full">
        {label && (
          <Text className={`text-base font-nunitoSansRegular ${labelStyles}`}>
            {label}
          </Text>
        )}
        <TextInput
          mode="outlined"
          label={labelInput}
          value={value}
          theme={{ roundness: 8 }}
          placeholder={placeholder}
          onChangeText={handleTextChange}
          onFocus={handleClick}
          keyboardType="default"
          style={{
            backgroundColor: "white",
            height: 50,
          }}
          outlineStyle={{ borderWidth: 1 }}
          outlineColor="#d1d5db"
          activeOutlineColor="#ababab"
          className={`text-base font-nunitoSansRegular ${inputStyles}`}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CustomInputText;

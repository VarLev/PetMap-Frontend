import React, { useState } from "react";
import { Text, ProgressBar, MD3Colors } from "react-native-paper";
import { View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

function PasswordPrompt({ strengthScore, password }) {
  const passComplexity =
    strengthScore > 0.7
      ? "Надежный"
      : strengthScore >= 0.5
      ? "Средний"
      : "Слабый";

  const getProgressColor = (strengthScore) => {
    if (strengthScore < 0.33) {
      return '#FF6D6D'; // Красный
    } else if (strengthScore < 0.66) {
      return "#FFD700"; // Желтый
    } else {
      return "#ACFFB9"; // Зеленый
    }
  };

  const checkColor = (password, condition) => {
    switch (condition) {
      case 'length':
        return password.length >= 8 ? '#ACFFB9' : '#FF6D6D';
      case 'uppercase':
        return /[A-Z]/.test(password) ? '#ACFFB9' : '#FF6D6D';
      case 'special':
        return /[@$%_*!-]/.test(password) ? '#ACFFB9' : '#FF6D6D';
      case 'digit':
        return /\d/.test(password) ? '#ACFFB9' : '#FF6D6D';
      default:
        return '#FF6D6D';
    }
  };


  return (
    <View>
      <View className="flex-row justify-between my-1 mx-1">
        <Text className="fontnunitoSansRegular">Надежность пароля </Text>
        <Text className="font-nunitoSansBold"> {passComplexity}</Text>
      </View>
      <ProgressBar
        progress={strengthScore}
        color={getProgressColor(strengthScore)}
      />

      <View className="p-2">
        <Text className="text-sm mb-1 font-nunitoSansRegular">
          Рекомендации:
        </Text>
        <View className="ml-2">
          <View className="flex-row items-center mt-1">
            <Icon name="check" color={checkColor(password, 'length')} size={20} />
            <Text className="text-md ml-2 font-nunitoSansRegular">
              Больше 8 символов
            </Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Icon name="check" color={checkColor(password, 'uppercase')} size={20} />
            <Text className="text-md ml-2 font-nunitoSansRegular">
              Большие и прописные буквы
            </Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Icon name="check" color={checkColor(password, 'special')} size={20} />
            <Text className="text-md ml-2 font-nunitoSansRegular">
              Специальные символы @ $ % _ * - !
            </Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Icon name="check" color={checkColor(password, 'digit')} size={20} />
            <Text className="text-md ml-2 font-nunitoSansRegular">Цифры</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default PasswordPrompt;

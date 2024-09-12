import React, { useState } from "react";
import { Text, ProgressBar, MD3Colors } from "react-native-paper";
import { View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

function PasswordPrompt({ strengthScore }) {
  const passComplexity =
    strengthScore > 0.7
      ? "Надежный"
      : strengthScore >= 0.5
      ? "Средний"
      : "Слабый";

  const getProgressColor = (strengthScore) => {
    if (strengthScore < 0.33) {
      return MD3Colors.error50; // Красный
    } else if (strengthScore < 0.66) {
      return "#FFD700"; // Желтый
    } else {
      return "#32CD32"; // Зеленый
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
            <Icon name="check" color={"#ACFFB9"} size={20} />
            <Text className="text-md ml-2 font-nunitoSansRegular">
              Больше 8 символов
            </Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Icon name="check" color={"#ACFFB9"} size={20} />
            <Text className="text-md ml-2 font-nunitoSansRegular">
              Большие и прописные буквы
            </Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Icon name="check" color={"#ACFFB9"} size={20} />
            <Text className="text-md ml-2 font-nunitoSansRegular">
              Специальные символы @ $ % _ * - !
            </Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Icon name="check" color={"#ACFFB9"} size={20} />
            <Text className="text-md ml-2 font-nunitoSansRegular">Цифры</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default PasswordPrompt;

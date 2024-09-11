import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomSegmentedButtonsProps {
  value: number; // Теперь значение - это индекс
  onValueChange: (value: number) => void; // Возвращаем индекс
  showNAButton?: boolean;
  containerStyles?: string;
  buttonClassName?: string;
}

const CustomSegmentedButtons: React.FC<CustomSegmentedButtonsProps> = ({ value, onValueChange, showNAButton = true, containerStyles, buttonClassName }) => {
  const buttons = [
    { label: 'male', icon: 'male-outline' as keyof typeof Ionicons.glyphMap },
    { label: 'female', icon: 'female-outline' as keyof typeof Ionicons.glyphMap },
  ];

  if (showNAButton) {
    buttons.push({ label: 'N/A', icon: 'transgender-outline' as keyof typeof Ionicons.glyphMap });
  }

  return (
    <View className={`flex-row h-[45px] mb-2 border border-gray-300 rounded-lg overflow-hidden ${containerStyles}`}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index} // Используем индекс как ключ
          className={`flex-1 p-2 items-center justify-center border-r border-gray-300 ${
            value === index ? 'bg-indigo-800 border-indigo-800' : 'bg-white'
          } ${index === 0 ? 'rounded-l-lg' : ''} ${index === buttons.length - 1 ? 'rounded-r-lg border-r-0' : ''} ${buttonClassName}`}
          onPress={() => onValueChange(index)} // Передаем индекс наружу
        >
          <Ionicons name={button.icon} size={20} color={value === index ? 'white' : 'black'} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CustomSegmentedButtons;

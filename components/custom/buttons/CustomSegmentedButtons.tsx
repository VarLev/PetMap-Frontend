import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomSegmentedButtonsProps {
  value: string;
  onValueChange: (value: string) => void;
  showNAButton?: boolean;
  containerStyles?: string;
  buttonClassName?: string;
}

const CustomSegmentedButtons: React.FC<CustomSegmentedButtonsProps> = ({ value, onValueChange, showNAButton = true, containerStyles, buttonClassName }) => {
  const buttons = [
    { value: 'male', icon: 'male-outline' as keyof typeof Ionicons.glyphMap },
    { value: 'female', icon: 'female-outline' as keyof typeof Ionicons.glyphMap },
  ];

  if (showNAButton) {
    buttons.push({ value: 'N/A', icon: 'transgender-outline' as keyof typeof Ionicons.glyphMap });
  }

  return (
    <View className={`flex-row h-[45px] mb-2 border border-gray-300 rounded-lg overflow-hidden ${containerStyles}`}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={button.value}
          className={`flex-1 p-2 items-center justify-center border-r border-gray-300 ${
            value === button.value ? 'bg-indigo-800 border-indigo-800' : 'bg-white'
          } ${index === 0 ? 'rounded-l-lg' : ''} ${index === buttons.length - 1 ? 'rounded-r-lg border-r-0' : ''} ${buttonClassName}`}
          onPress={() => onValueChange(button.value)}
        >
          <Ionicons name={button.icon} size={20} color={value === button.value ? 'white' : 'black'} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CustomSegmentedButtons;

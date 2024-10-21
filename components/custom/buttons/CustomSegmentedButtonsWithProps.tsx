import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Button {  
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface CustomSegmentedButtonsProps {
  values: number[]; // Массив выбранных индексов
  onValueChange: (value: number[]) => void; // Возвращаем массив выбранных индексов
  buttons: Button[]; // Кнопки передаются как пропс
  containerStyles?: string;
  buttonClassName?: string;
}

const CustomSegmentedButtonsWithProps: React.FC<CustomSegmentedButtonsProps> = ({
  values,
  onValueChange,
  buttons,
  containerStyles,
  buttonClassName,
}) => {
  const handlePress = (index: number) => {
    if (values.includes(index)) {
      // Если индекс уже есть в массиве, удаляем его
      onValueChange(values.filter((value) => value !== index));
    } else {
      // Иначе добавляем его
      onValueChange([...values, index]);
    }
  };

  return (
    <View className={`flex-row h-[52px] mb-2 border border-gray-500 rounded-lg overflow-hidden ${containerStyles}`}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index} // Используем индекс как ключ
          className={`flex-1 p-2 items-center justify-center border-r border-gray-500 ${
            values.includes(index) ? 'bg-indigo-800 border-indigo-800' : 'bg-white'
          } ${index === 0 ? 'rounded-l-lg' : ''} ${index === buttons.length - 1 ? 'rounded-r-lg border-r-0' : ''} ${buttonClassName}`}
          onPress={() => handlePress(index)} // Передаем индекс наружу
        >
          {button.icon && (
            <Ionicons name={button.icon} size={20} color={values.includes(index) ? 'white' : 'black'} />
          )}
          <Text style={{ color: values.includes(index) ? 'white' : 'black', marginTop: button.icon ? 4 : 0 }}>{button.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CustomSegmentedButtonsWithProps;

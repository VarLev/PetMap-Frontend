import React from 'react';
import { TextInput, View, Text } from 'react-native';

type InputTextProps = {
  value?: string;
  placeholder?: string;
  handleChange?: (text: string) => void;
  handleClick?: () => void;
  containerStyles?: string;
  inputStyles?: string;
  label?: string;
  labelStyles?: string;
};

const CustomInputText = ({ value, placeholder, handleChange, handleClick, containerStyles, inputStyles, label, labelStyles }: InputTextProps) => {
  return (
    <View className={`w-full ${containerStyles}`}>
      {label && <Text className={`text-gray-700 text-base font-nunitoSansRegular mb-2 ${labelStyles}`}>{label}</Text>}
      
      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={handleChange}
        onFocus={handleClick}
        
        className={`border border-gray-300 text-base font-nunitoSansRegular rounded-lg px-4 py-2 ${inputStyles}`}
      />
    </View>
  );
};

export default CustomInputText;

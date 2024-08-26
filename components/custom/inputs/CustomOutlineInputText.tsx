import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
// import { NunitoSans_400Regular, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';


type InputTextProps = {
  value?: string | number;
  placeholder?: string;
  handleChange?: (text: string) => void;
  containerStyles?: string;
  label?: string;
  numberOfLines?: number;
};

const CustomOutlineInputText = ({ value, placeholder, handleChange, containerStyles, label,numberOfLines  }: InputTextProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
      <TextInput
        multiline
        label={label}        
        value={value !== undefined ? String(value) : ''}
      
        placeholder={placeholder}
        onChangeText={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        mode='outlined'
        className={`text-base font-nunitoSansBold rounded-lg bg-white ${containerStyles}`}
        contentStyle={{ fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        style={{ fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        numberOfLines={numberOfLines||1}
        outlineStyle={{
          borderColor: isFocused ? '#7038c9' : '#bababa', // Цвет границы в зависимости от фокуса
        }}
      />  
  );
};

export default CustomOutlineInputText;

import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
// import { NunitoSans_400Regular, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import TextInputMask from 'react-native-text-input-mask';


type InputTextProps = {
  value?: string | number;
  placeholder?: string;
  handleChange?: (text: string) => void;
  containerStyles?: string;
  label?: string;
  numberOfLines?: number;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
};

const CustomOutlineInputText = ({ value, placeholder, handleChange, containerStyles, label,numberOfLines, keyboardType  }: InputTextProps) => {
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
        contentStyle={{ fontFamily: 'NunitoSans_400Regular', fontSize: 16, color: '#363636' }}
        style={{fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        numberOfLines={numberOfLines||1}
        outlineStyle={{
          borderColor: isFocused ? '#7038c9' : '#bababa', // Цвет границы в зависимости от фокуса
        }}
        keyboardType={keyboardType || 'default'}
        dataDetectorTypes={'calendarEvent'}
        
      />  
  );
};

export default CustomOutlineInputText;

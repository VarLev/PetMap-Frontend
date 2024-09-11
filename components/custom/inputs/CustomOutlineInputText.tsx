import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text';

type InputTextProps = {
  value?: string | number;
  placeholder?: string;
  handleChange?: (text: string) => void;
  containerStyles?: string;
  label?: string;
  numberOfLines?: number;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  mask?: string; // Опциональная маска
};

const CustomOutlineInputText = ({
  value,
  placeholder,
  handleChange,
  containerStyles,
  label,
  numberOfLines,
  keyboardType,
  mask // Опциональная маска для поля ввода
}: InputTextProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (text: string) => {
    //const cleanedText = text.replace(/[^0-9]/g, '');
    if (handleChange) {
      handleChange(text);
    }
  };
  
  return (
    <>
      {mask ? (
        <TextInputMask
          type={'custom'}
          options={{
            mask: mask
          }}
          value={value !== undefined ? String(value) : ''}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            fontFamily: 'NunitoSans_400Regular',
            fontSize: 16,
            color: '#363636',
            borderColor: isFocused ? '#7038c9' : '#bababa',
            borderRadius: 5,
            backgroundColor: '#ffffff',
            padding: 10, // добавляем padding для текстового инпута
          }}
          className='mt-4 border'
          keyboardType={keyboardType || 'default'}
        />
      ) : (
        <TextInput
          multiline={!!numberOfLines && numberOfLines > 1}
          label={label}
          value={value !== undefined ? String(value) : ''}
          placeholder={placeholder}
          onChangeText={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          mode="outlined"
          className={`text-base font-nunitoSansBold rounded-lg bg-white ${containerStyles}`}
          contentStyle={{ fontFamily: 'NunitoSans_400Regular', fontSize: 16, color: '#363636' }}
          style={{ fontFamily: 'NunitoSans_400Regular', fontSize: 16}}
          numberOfLines={numberOfLines || 1}
          outlineStyle={{
            borderColor: isFocused ? '#7038c9' : '#bababa', // Цвет границы в зависимости от фокуса
          }}
          keyboardType={keyboardType || 'default'}
          theme={{ 
            fonts: {      
              bodyLarge: { fontFamily: 'NunitoSans_400Regular'  }, 
            } 
          }
        }
        />
      )}
    </>
  );
};

export default CustomOutlineInputText;

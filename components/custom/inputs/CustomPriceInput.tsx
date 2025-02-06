import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { BG_COLORS } from '@/constants/Colors';

type PriceInputProps = {
  value?: string | number;
  placeholder?: string;
  handleChange?: (text: string) => void;
  containerStyles?: string;
  label?: string;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  maxLength?: number;
  onPress?: () => void;
  editable?: boolean;
  /**
   * Символ валюты (например, "$", "€", "ARS$" и т.д.).  
   * По умолчанию — "$".
   */
  currency?: string;
  /**
   * Количество знаков после разделителя (десятичной части).  
   * По умолчанию — 2.
   */
  precision?: number;
};

const CustomPriceInput = ({
  value,
  placeholder,
  handleChange,
  containerStyles,
  label,
  keyboardType,
  maxLength,
  onPress,
  editable = true,
  currency = '$',
  precision = 2,
}: PriceInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  // Опции для маски "money"
  const moneyMaskOptions = {
    precision: precision,
    separator: ".",      // символ-разделитель десятичной части (можно менять в зависимости от локали)
    delimiter: ",",      // разделитель групп разрядов (можно заменить на пробел или точку)
    unit: currency,      // символ валюты
    suffixUnit: "",    // суффикс (если требуется)
    zeroCents: false,    // отображать ли нулевые десятые
  };

  const handleTextChange = (text: string) => {
    // При необходимости можно добавить дополнительную обработку ввода.
    if (handleChange) {
      handleChange(text);
    }
  };

  return (
    <View>
      {label && (
        <Text
          style={{
            color: BG_COLORS.gray[700],
            fontFamily: 'NunitoSans_400Regular',
            fontSize: 12,
            position: 'absolute',
            top: 9,
            left: 8,
            backgroundColor: '#fff',
            paddingHorizontal: 4,
            zIndex: 3001,
          }}
        >
          {label}
        </Text>
      )}
      <TextInputMask
        type={'money'}
        options={moneyMaskOptions}
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
          borderRadius: 8,
          borderWidth: isFocused ? 2 : 1,
          marginTop: 18,
          backgroundColor: '#ffffff',
          padding: 10,
        }}
        className={`text-base font-nunitoSansBold bg-white ${containerStyles}`}
        keyboardType={keyboardType || 'decimal-pad'}
        maxLength={maxLength}
      />
    </View>
  );
};

export default CustomPriceInput;

import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type InputTextProps = TextInputProps & {
  value?: string;
  placeholder?: string;
  handleChange?: (text: string) => void;
  containerStyles?: string;
  inputStyles?: string;
  label?: string;
  labelStyles?: string;
  formatType?: 'text' | 'date';
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
};

const CustomInputTextTypeAndIcon = ({
  value,
  placeholder,
  handleChange,
  containerStyles,
  inputStyles,
  label,
  labelStyles,
  formatType = 'text',
  iconName,
  iconSize = 24,
  iconColor = 'gray',
  ...rest
}: InputTextProps) => {
  return (
    <View className={`w-full ${containerStyles}`}>
      {label && <Text className={`text-gray-700 text-base font-nunitoSansRegular mb-2 ${labelStyles}`}>{label}</Text>}
      <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-2">
        {iconName && <MaterialIcons name={iconName} size={iconSize} color={iconColor} style={{ marginRight: 8 }} />}
        {formatType === 'date' ? (
          <TextInputMask
            type={'datetime'}
            options={{
              format: 'MM/DD/YYYY',
            }}
            value={value}
            placeholder={placeholder}
            onChangeText={handleChange}
            className={`flex-1 ${inputStyles}`}
            {...rest}
          />
        ) : (
          <TextInput
            value={value}
            placeholder={placeholder}
            onChangeText={handleChange}
            className={`flex-1 text-base font-nunitoSansRegular ${inputStyles}`}
            {...rest}
          />
        )}
      </View>
    </View>
  );
};

export default CustomInputTextTypeAndIcon;

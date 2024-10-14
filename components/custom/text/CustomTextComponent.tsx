import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CustomTextComponentProps {
  text?: string | number | string[] | null;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  maxLines?: number;
  iconSet?: 'material' | 'paper' | 'fontAwesome' | 'simpleLine' | 'ionicons' | 'materialCommunity';
  separator?: string;
  className_?: string; // Используем className для стилизации через NativeWind
  textStyle?: object
}

const CustomTextComponent: React.FC<CustomTextComponentProps> = ({
  text,
  leftIcon,
  rightIcon,
  onRightIconPress,
  maxLines = 2, // Устанавливаем максимум 2 строки по умолчанию
  iconSet = 'material',
  separator = ', ',
  className_='', // Используем className для стилизации через NativeWind
  textStyle = {},
}) => {
  const displayText = Array.isArray(text) ? text.join(separator) : text;

  return (
    <View className={`py-2 flex-row items-center ${className_}`}>
      {leftIcon && (
        iconSet === 'material' ? (
          <MaterialIcons name={leftIcon} size={20} color="#b39ddb" />
        ) : iconSet === 'fontAwesome' ? (
          <FontAwesome name={leftIcon} size={20} color="#b39ddb" />
        ) : iconSet === 'simpleLine' ? (
          <SimpleLineIcons name={leftIcon} size={20} color="#b39ddb" />
        ) : iconSet === 'ionicons' ? (
          <Ionicons name={leftIcon} size={20} color="#b39ddb" />
        ) : iconSet === 'materialCommunity' ? (
          <MaterialCommunityIcons name={leftIcon as any} size={20} color="#b39ddb" />
        ) : (
          <IconButton icon={leftIcon} size={20} />
        )
      )}
      <Text
        numberOfLines={maxLines}
        ellipsizeMode="tail"
        style={[{ flex: 1, paddingLeft: 8, fontSize: 16, fontFamily: 'NunitoSans-Regular' }, textStyle]} 
      >
        {displayText}
      </Text>
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <MaterialIcons name={rightIcon} size={20} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomTextComponent;

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CustomTextComponentProps {
  text?: string | string[] | null;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  maxLines?: number;
  iconSet?: 'material' | 'paper' | 'fontAwesome' | 'simpleLine' | 'ionicons'; // Добавляем 'ionicons'
  separator?: string; // Разделитель для массива строк
}

const CustomTextComponent: React.FC<CustomTextComponentProps> = ({
  text,
  leftIcon,
  rightIcon,
  onRightIconPress,
  maxLines = 1,
  iconSet = 'material', // По умолчанию используем Material Icons
  separator = ', ', // По умолчанию разделитель - запятая с пробелом
}) => {
  // Объединяем массив строк в одну строку с разделителем, если text - массив
  const displayText = Array.isArray(text) ? text.join(separator) : text;

  return (
    <View className="p-0 pt-2 pb-2">
      <View className="flex-row items-center">
        {leftIcon && (
          iconSet === 'material' ? (
            <MaterialIcons name={leftIcon} size={20} color="#b39ddb" />
          ) : iconSet === 'fontAwesome' ? (
            <FontAwesome name={leftIcon} size={20} color="#b39ddb" />
          ) : iconSet === 'simpleLine' ? (
            <SimpleLineIcons name={leftIcon} size={20} color="#b39ddb" />
          ) : iconSet === 'ionicons' ? (
            <Ionicons name={leftIcon} size={20} color="#b39ddb" />
          ) : (
            <IconButton icon={leftIcon} size={20} />
          )
        )}
        <Text
          numberOfLines={maxLines}
          ellipsizeMode="tail"
          className="flex-1 pl-2 text-base text-black font-nunitoSansRegular"
        >
          {displayText}
        </Text>
        <TouchableOpacity onPress={onRightIconPress}>
         <MaterialIcons name={rightIcon??''} size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomTextComponent;

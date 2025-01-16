import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { IconButton } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CustomSocialLinkInputProps {
  text?: string | string[] | null;
  leftIcon?: string;
  rightIcon?: string | null;
  onRightIconPress?: () => void;
  maxLines?: number;
  iconSet?: 'material' | 'paper' | 'fontAwesome' | 'simpleLine' | 'ionicons'; // Поддержка разных наборов иконок
  separator?: string; // Разделитель для массива строк
  platform: 'instagram' | 'facebook'; // Определяет, какая соцсеть используется
}

const CustomSocialLinkInput: React.FC<CustomSocialLinkInputProps> = ({
  text,
  leftIcon,
  rightIcon,
  onRightIconPress,
  maxLines = 1,
  iconSet = 'material', // По умолчанию используем Material Icons
  separator = ', ', // По умолчанию разделитель - запятая с пробелом
  platform,
}) => {
  // Объединяем массив строк в одну строку с разделителем, если text - массив
  const displayText = Array.isArray(text) ? text.join(separator) : text;

  const handleOpenLink = () => {
    let url = '';
    if (platform === 'instagram') {
      url = `https://instagram.com/${displayText}`;
    } else if (platform === 'facebook') {
      url = `https://facebook.com/${displayText}`;
    }

    if (url) {
      Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    }
  };

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
        <TouchableOpacity activeOpacity={0.8} onPress={handleOpenLink} style={{ flex: 1 }}>
          <Text
            numberOfLines={maxLines}
            ellipsizeMode="tail"
            className="pl-2 text-base text-black font-nunitoSansRegular"
          >
            {displayText}
          </Text>
        </TouchableOpacity>
        {rightIcon && (
          <TouchableOpacity activeOpacity={0.8} onPress={onRightIconPress}>
            <MaterialIcons name={rightIcon ?? ''} size={20} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomSocialLinkInput;

import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { IconButton } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CustomTextComponentProps {
  text?: string | string[] | null;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  maxLines?: number;
  iconSet?: 'material' | 'paper' | 'fontAwesome' | 'simpleLine' | 'ionicons' | 'materialCommunity';
  separator?: string;
  style?: StyleProp<ViewStyle>; // Добавляем возможность передавать стили для внешнего View
}

const CustomTextComponent: React.FC<CustomTextComponentProps> = ({
  text,
  leftIcon,
  rightIcon,
  onRightIconPress,
  maxLines = 1,
  iconSet = 'material',
  separator = ', ',
  style, // Получаем стили через пропс
}) => {
  const displayText = Array.isArray(text) ? text.join(separator) : text;

  return (
    <View style={[{ paddingVertical: 8, flexDirection: 'row', alignItems: 'center' }, style]}>
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
        style={{ flex: 1, paddingLeft: 8, fontSize: 16, color: 'black', fontFamily: 'NunitoSans-Regular' }}
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

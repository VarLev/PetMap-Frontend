import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import IconSelectorComponent from '../icons/IconSelectorComponent';


interface CustomButtonProps {
  onPress: () => void;
  text: string;
  iconName?: string;
  iconPosition?: 'left' | 'right';
  iconSet?: 'MaterialIcons' | 'FontAwesome' | 'Ionicons' | 'MaterialCommunityIcons';
  buttonStyle?: string;
  textStyle?: string;
}

const CustomButtonWithIcon: React.FC<CustomButtonProps> = ({
  onPress,
  text,
  iconName,
  iconPosition = 'left',
  iconSet = 'MaterialIcons', // По умолчанию MaterialIcons
  buttonStyle = '',
  textStyle = '',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-center p-2 m-1 rounded-full ${buttonStyle}`}
      style={{ elevation: 3 }}
    >
      {iconName && iconPosition === 'left' && (
        <IconSelectorComponent iconSet={iconSet} iconName={iconName} />
      )}
      <Text className={`text-base font-nunitoSansRegular ml-1 ${textStyle}`}>{text}</Text>
      {iconName && iconPosition === 'right' && (
        <IconSelectorComponent iconSet={iconSet} iconName={iconName} />
      )}
    </TouchableOpacity>
  );
};

export default CustomButtonWithIcon;

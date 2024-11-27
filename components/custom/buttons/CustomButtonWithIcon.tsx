import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import IconSelectorComponent from '../icons/IconSelectorComponent';

interface CustomButtonProps {
  onPress: () => void;
  text: string;
  iconName?: string;
  iconPosition?: 'left' | 'right';
  iconSet?: 'MaterialIcons' | 'FontAwesome' | 'Ionicons' | 'MaterialCommunityIcons' | 'SimpleLine';
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
      style={[styles.shadow, { elevation: 3 }]} // Android и iOS стили теней
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

const styles = StyleSheet.create({
  shadow: {
    // iOS тени
    shadowColor: '#000', // Цвет тени
    shadowOffset: { width: 0, height: 1 }, // Смещение тени
    shadowOpacity: 0.3, // Прозрачность тени
    shadowRadius: 1.5, // Радиус размытия

    // Android тени через elevation
    elevation: 3,
  },
});

export default CustomButtonWithIcon;
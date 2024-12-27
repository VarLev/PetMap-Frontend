import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import IconSelectorComponent from '../icons/IconSelectorComponent';

interface CustomButtonProps {
  onPress: () => void;
  text: string;
  iconName?: string;
  iconPosition?: 'left' | 'right';
  iconSet?: 'MaterialIcons' | 'FontAwesome' | 'Ionicons' | 'MaterialCommunityIcons' | 'SimpleLine';
  buttonStyle?: string;
  textStyle?: string;
  /**
   * Индикатор загрузки. Когда true, иконка будет заменена на ActivityIndicator.
   */
  isLoading?: boolean;
}

const CustomButtonWithIcon: React.FC<CustomButtonProps> = ({
  onPress,
  text,
  iconName,
  iconPosition = 'left',
  iconSet = 'MaterialIcons', // По умолчанию MaterialIcons
  buttonStyle = '',
  textStyle = '',
  isLoading = false, // По умолчанию выключен
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center justify-center p-2 m-1 rounded-full ${buttonStyle}`}
      style={[styles.shadow, { elevation: 3 }]}
    >
      {/* ЛЕВАЯ СТОРОНА */}
      {iconName && iconPosition === 'left' && !isLoading && (
        <IconSelectorComponent iconSet={iconSet} iconName={iconName} />
      )}

      {/* Если isLoading == true, показываем индикатор загрузки вместо иконки */}
      {iconPosition === 'left' && isLoading && (
        <ActivityIndicator size="small" color="#000" />
      )}

      <Text className={`text-base font-nunitoSansRegular ml-1 ${textStyle}`}>
        {text}
      </Text>

      {/* ПРАВАЯ СТОРОНА */}
      {iconName && iconPosition === 'right' && !isLoading && (
        <IconSelectorComponent iconSet={iconSet} iconName={iconName} />
      )}
      {iconPosition === 'right' && isLoading && (
        <ActivityIndicator size="small" color="#000" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadow: {
    // iOS тени
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    // Android тени через elevation
    elevation: 3,
  },
});

export default CustomButtonWithIcon;
// CustomButtonWithIcon.tsx
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
   * Индикатор загрузки. Когда true, иконка заменяется на ActivityIndicator.
   */
  isLoading?: boolean;
  /**
   * Свойство для выделения кнопки (например, в режиме toggle).
   */
  selected?: boolean;
}

const CustomButtonWithIcon: React.FC<CustomButtonProps> = ({
  onPress,
  text,
  iconName,
  iconPosition = 'left',
  iconSet = 'MaterialIcons',
  buttonStyle,
  textStyle = '',
  isLoading = false,
  selected = false,
}) => {
  // Определяем дефолтный стиль фона в зависимости от состояния "selected".
  const defaultButtonStyle = selected ? 'bg-violet-200' : 'bg-white';
  // Если передан дополнительный стиль, комбинируем его с дефолтным.
  const combinedButtonStyle = buttonStyle
    ? `${defaultButtonStyle} ${buttonStyle}`
    : defaultButtonStyle;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center justify-center p-2 m-1 rounded-full ${combinedButtonStyle}`}
      style={[styles.shadow, { elevation: 3 }]}
    >
      {/* ЛЕВАЯ СТОРОНА */}
      {iconName && iconPosition === 'left' && !isLoading && (
        <IconSelectorComponent iconSet={iconSet} iconName={iconName} />
      )}
      {iconPosition === 'left' && isLoading && (
        <ActivityIndicator size="small" color="#000" />
      )}

      <Text className={`text-base font-nunitoSansRegular h-6 ml-1 ${textStyle}`} style={{ textAlignVertical: 'center', includeFontPadding: false }}
      >
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
    // iOS-тень
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    // Android-тень через elevation
    elevation: 3,
  },
});

export default CustomButtonWithIcon;

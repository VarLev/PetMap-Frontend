import React, { useEffect } from 'react';
import { Pressable, StyleSheet, PressableProps } from 'react-native';
import { iconsTab } from '@/constants/Icons';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface TabBarButtonProps extends PressableProps {
  isFocused: boolean;
  label: string;
  routeName: string;
  color: string;
  disabled?: boolean; // новое свойство для блокировки нажатия
}

const TabBarButton: React.FC<TabBarButtonProps> = ({ isFocused, label, routeName, color, disabled, ...props }) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.3]);
    const top = interpolate(scale.value, [0, 1], [0, 1]);

    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return {
      opacity,
    };
  });

  return (
    <Pressable
      {...props}
      style={[styles.container, disabled && styles.disabled]} // меняем стиль при disabled
      disabled={disabled} // блокируем нажатие, если disabled === true
    >
      <Animated.View style={[animatedIconStyle, routeName === 'map' && styles.mapIconContainer]}>
        {iconsTab[routeName]({ color })}
      </Animated.View>
      {/* Можно также отобразить текст с анимацией, если потребуется */}
      {/* <Animated.Text style={[{ color, fontSize: 11 }, animatedTextStyle]}>
          {label}
      </Animated.Text> */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  mapIconContainer: {
    width: 50, 
    height: 50,
    marginBottom: 3, 
    borderRadius: 25, 
    backgroundColor: '#F5ECFF',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5, // визуально индицируем, что кнопка заблокирована
  },
});

export default TabBarButton;

import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface SlidingOverlayProps {
  visible: boolean;
  children?: React.ReactNode; // Добавляем возможность передавать контент
}

const SlidingOverlay: React.FC<SlidingOverlayProps> = ({ visible, children }) => {
  const translateX = useSharedValue(width);

  useEffect(() => {
    translateX.value = withTiming(visible ? 0 : width, { duration: 500 });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      className='absolute bg-white h-full w-full'
      style={[{ zIndex: 1 }, animatedStyle]}
      pointerEvents="auto" // Отключаем взаимодействие с выезжающим элементом
    >
      {children}
    </Animated.View>
  );
};

export default SlidingOverlay;

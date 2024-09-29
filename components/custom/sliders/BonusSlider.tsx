import React, { useRef, useEffect } from 'react';
import { View, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CustomSliderProps {
  min: number;
  max: number;
  value: number;

}

const BonusSlider: React.FC<CustomSliderProps> = ({ min, max, value }) => {
  const sliderWidth = 300; // ширина слайдера

  // Функция для преобразования значения в позицию
  const valueToPosition = (val: number) => {
    return ((val - min) / (max - min)) * sliderWidth;
  };

  

  const pan = useRef(new Animated.Value(valueToPosition(value))).current;
  const animatedWidth = useRef(new Animated.Value(valueToPosition(value))).current;
  const gradientAnimation = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    // Анимация изменения ширины заполненной части
    Animated.timing(animatedWidth, {
      toValue: valueToPosition(value),
      duration: 800,
      useNativeDriver: false,
    }).start();

    Animated.timing(pan, {
      toValue: valueToPosition(value),
      duration: 800,
      useNativeDriver: false,
    }).start();

    // Анимация градиента, которая будет двигаться внутри заполненной части
    Animated.loop(
      Animated.timing(gradientAnimation, {
        toValue: valueToPosition(value),
        duration: 1000,
        useNativeDriver: false,
      })
    ).start();

    console.log("Bonuses", value);

  }, [value]);

  

  return (
    <View className="mx-6 h-8 justify-center">
      {/* Пустая часть слайдера (светлосалатовый цвет) */}
      <View className="absolute w-full h-4 rounded-full bg-[#DFFFE4] border border-emerald-200" />

      {/* Заполненная часть слайдера (темносалатовый цвет с анимацией градиента) */}
      <Animated.View
        className="absolute h-4 rounded-full bg-[#97FFA7]"
        style={{
          width: animatedWidth,
        }}
      >
        <Animated.View
          style={{
            width: animatedWidth, // ширина заполненной части
            transform: [{ translateX: gradientAnimation }],
          }}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0)']}
            start={[0, 0]}
            end={[1, 0]}
            style={{ width: '30%', height: '100%' }}
          />
        </Animated.View>
      </Animated.View>

      {/* Бегунок */}
      <View style={{ width: sliderWidth }}>
      <Animated.View
        className="absolute top-[-16px]"
        style={{
          transform: [{ translateX: pan }],
        }}
      >
        <View className="-ml-2 w-7 h-8 flex items-center justify-center">
          <Image
            source={require('@/assets/images/bonuse.png')} // замените на путь к вашему изображению
            className="w-7 h-7"
          />
        </View>
      </Animated.View>
    </View>
    </View>
  );
};

export default BonusSlider;

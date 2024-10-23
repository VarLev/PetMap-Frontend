import IconSelectorComponent from '@/components/custom/icons/IconSelectorComponent';
import { MapPointType } from '@/dtos/enum/MapPointType';
import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';

interface MapPointIconWithAnimationProps {
  mapPointType: MapPointType;
  isSelected: boolean;
}

const MapPointIconWithAnimation: React.FC<MapPointIconWithAnimationProps> = ({ mapPointType, isSelected }) => {
  const animationValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isSelected) {
      // Зацикленная анимация прыжка маркера, если он выбран
      Animated.loop(
        Animated.sequence([
          Animated.spring(animationValue, {
            toValue: 1.25, // Увеличение масштаба для эффекта прыжка
            
            speed: 20,
         
            useNativeDriver: true,
          }),
          Animated.spring(animationValue, {
            toValue: 0.8, // Возврат к изначальному размеру
            useNativeDriver: true,
            speed: 20,
          }),
        ])
      ).start();
    } else {
      // Сбрасываем анимацию, если маркер не выбран
      Animated.spring(animationValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelected]);

  const renderIcon = () => {
    switch (mapPointType) {
      case MapPointType.Danger:
        return (
          <View className='bg-rose-500 rounded-full h-6 w-6 justify-center items-center'>
            <IconSelectorComponent
              iconName='alert-circle-outline'
              iconSet='Ionicons'
              size={15}
              color='white'
            />
          </View>
        );
      case MapPointType.Other:
        return (
          <View className='bg-blue-500 rounded-full h-6 w-6 justify-center items-center'>
            <IconSelectorComponent
              iconName='tree-outline'
              iconSet='Ionicons'
              size={15}
              color='white'
            />
          </View>
        );
      case MapPointType.Playground:
        return (
          <View className='bg-blue-500 rounded-full h-6 w-6 justify-center items-center'>
            <IconSelectorComponent
              iconName='basketball-outline'
              iconSet='Ionicons'
              size={15}
              color='white'
            />
          </View>
        );
      case MapPointType.DogArea:
        return (
          <View className='bg-blue-500 rounded-full h-6 w-6 justify-center items-center'>
            <IconSelectorComponent
              iconName='select-place'
              iconSet='MaterialCommunityIcons'
              size={15}
              color='white'
            />
          </View>
        );
      case MapPointType.Cafe:
        return (
          <View className='bg-blue-500 rounded-full h-6 w-6 justify-center items-center'>
            <IconSelectorComponent
              iconName='cafe-outline'
              iconSet='Ionicons'
              size={15}
              color='white'
            />
          </View>
        );
      case MapPointType.Restaurant:
        return (
          <View className='bg-blue-500 rounded-full h-6 w-6 justify-center items-center'>
            <IconSelectorComponent
              iconName='restaurant-outline'
              iconSet='Ionicons'
              size={15}
              color='white'
            />
          </View>
        );
      case MapPointType.Veterinary:
        return (
          <View className='bg-blue-500 rounded-full h-6 w-6 justify-center items-center'>
            <IconSelectorComponent
              iconName='heart-outline'
              iconSet='Ionicons'
              size={15}
              color='white'
            />
          </View>
        );
      case MapPointType.PetStore:
        return (
          <View className='bg-blue-500 rounded-full h-6 w-6 justify-center items-center'>
            <IconSelectorComponent
              iconName='storefront-outline'
              iconSet='Ionicons'
              size={20}
              color='white'
            />
          </View>
        );
      default:
        return (
          <View className='bg-white border-2 border-violet-400 rounded-full h-6 w-6 justify-center items-center'>
            <IconSelectorComponent
              iconName='leaf-outline'
              iconSet='Ionicons'
              size={15}
              color='#383838'
            />
          </View>
        );
    }
  };

  return (
    <Animated.View className='h-8 w-8 justify-center items-center' style={{ transform: [{ scale: animationValue }] }}>
      {renderIcon()}
    </Animated.View>
  );
};

export default MapPointIconWithAnimation;

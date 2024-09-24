import IconSelectorComponent from '@/components/custom/icons/IconSelectorComponent';
import { MapPointType } from '@/dtos/enum/MapPointType';
import React from 'react';
import { View } from 'react-native';


interface MapPointIconProps {
  mapPointType: MapPointType;
}

const MapPointIcon: React.FC<MapPointIconProps> = ({ mapPointType }) => {
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
              iconName='flower-outline'
              iconSet='Ionicons'
              size={15}
              color='#383838'
            />
          </View>
        );
    }
  };

  return <>{renderIcon()}</>;
};

export default MapPointIcon;

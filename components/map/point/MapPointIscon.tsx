import IconSelectorComponent from '@/components/custom/icons/IconSelectorComponent';
import { MapPointType } from '@/dtos/enum/MapPointType';
import React from 'react';
import { View } from 'react-native';

interface MapPointIconProps {
  mapPointType: MapPointType;
  isSelected: boolean;
}

const MapPointIcon: React.FC<MapPointIconProps> = ({ mapPointType, isSelected }) => {
  const renderIcon = () => {
    const backgroundColor = isSelected ? 'bg-white' : 'bg-white';
    const borderColor = isSelected ? 'border-2 border-indigo-700' : 'border-2 border-violet-400';

    switch (mapPointType) {
      case MapPointType.Danger:
        return (
          <View className={`${backgroundColor} ${borderColor} rounded-full h-6 w-6 justify-center items-center`}>
            <IconSelectorComponent
              iconName='alert-circle-outline'
              iconSet='Ionicons'
              size={15}
              color={isSelected ? '#383838' : '#383838'}
            />
          </View>
        );
      case MapPointType.Other:
        return (
          <View className={`${backgroundColor} ${borderColor} rounded-full h-6 w-6 justify-center items-center`}>
            <IconSelectorComponent
              iconName='tree-outline'
              iconSet='Ionicons'
              size={15}
              color={isSelected ? '#383838' : '#383838'}
            />
          </View>
        );
      case MapPointType.Playground:
        return (
          <View className={`${backgroundColor} ${borderColor} rounded-full h-6 w-6 justify-center items-center`}>
            <IconSelectorComponent
              iconName='basketball-outline'
              iconSet='Ionicons'
              size={15}
              color={isSelected ? '#383838' : '#383838'}
            />
          </View>
        );
      case MapPointType.DogArea:
        return (
          <View className={`${backgroundColor} ${borderColor} rounded-full h-6 w-6 justify-center items-center`}>
            <IconSelectorComponent
              iconName='select-place'
              iconSet='MaterialCommunityIcons'
              size={15}
              color={isSelected ? '#383838' : '#383838'}
            />
          </View>
        );
      case MapPointType.Cafe:
        return (
          <View className={`${backgroundColor} ${borderColor} rounded-full h-6 w-6 justify-center items-center`}>
            <IconSelectorComponent
              iconName='cafe-outline'
              iconSet='Ionicons'
              size={15}
              color={isSelected ? '#383838' : '#383838'}
            />
          </View>
        );
      case MapPointType.Restaurant:
        return (
          <View className={`${backgroundColor} ${borderColor} rounded-full h-6 w-6 justify-center items-center`}>
            <IconSelectorComponent
              iconName='restaurant-outline'
              iconSet='Ionicons'
              size={15}
              color={isSelected ? '#383838' : '#383838'}
            />
          </View>
        );
      case MapPointType.Veterinary:
        return (
          <View className={`${backgroundColor} ${borderColor} rounded-full h-6 w-6 justify-center items-center`}>
            <IconSelectorComponent
              iconName='heart-outline'
              iconSet='Ionicons'
              size={15}
              color={isSelected ? '#383838' : '#383838'}
            />
          </View>
        );
      case MapPointType.PetStore:
        return (
          <View className={`${backgroundColor} ${borderColor} rounded-full h-6 w-6 justify-center items-center`}>
            <IconSelectorComponent
              iconName='storefront-outline'
              iconSet='Ionicons'
              size={20}
              color={isSelected ? '#383838' : '#383838'}
            />
          </View>
        );
      case MapPointType.Note:
        return (
          <View className={`${backgroundColor} ${borderColor} rounded-full h-6 w-6 justify-center items-center`}>
            <IconSelectorComponent
              iconName='location-pin'
              iconSet='SimpleLine'
              size={20}
              color={isSelected ? '#383838' : '#383838'}
            />
          </View>
        );
      default:
        return (
          <View className={`${backgroundColor} ${borderColor} rounded-full h-6 w-6 justify-center items-center`}>
            <IconSelectorComponent
              iconName='leaf-outline'
              iconSet='Ionicons'
              size={15}
              color={isSelected ? '#383838' : '#383838'}
            />
          </View>
        );
    }
  };

  return (
    <View className='h-8 w-8 justify-center items-center'>
      {renderIcon()}
    </View>
  );
};

export default MapPointIcon;

import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import Carousel from "react-native-reanimated-carousel";

import { IWalkAdvrtShortDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtShortDto';
import { IPetAdvrtShortDto } from '@/dtos/Interfaces/pet/IPetAdvrtShortDto';

interface AdCardProps {
  ad: IWalkAdvrtShortDto;
}

const AdvrtCard: React.FC<AdCardProps> = ({ ad }) => {
  const renderPetItem = ({ item }: { item: IPetAdvrtShortDto }) => {
    return (
      <View className="items-center mt-2.5">
        {item.thumbnailUrl ? (
          <Image source={{ uri: item.thumbnailUrl }} className="w-[150px] h-[150px] rounded-lg" />
        ) : (
          <View className="w-[150px] h-[150px] rounded-lg bg-gray-200" />
        )}
        <Text className="mt-1.5 text-lg font-bold">{item.petName}</Text>
        <Text className="text-sm text-gray-600">Порода: {item.breed ?? 'Не указано'}</Text>
        <Text className="text-sm text-gray-600">Пол: {item.gender === 1 ? 'Мальчик' : 'Девочка'}</Text>
        <Text className="text-sm text-gray-600">
          {/* Возраст: {item.birthDate ? calculateAge(item.birthDate) : 'Не указано'} */}
        </Text>
      </View>
    );
  };

  const calculateAge = (birthDate: Date): string => {
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return `${Math.abs(ageDate.getUTCFullYear() - 1970)} лет`;
  };

  return (
    <View className="m-2.5 p-3.5 bg-white rounded-xl shadow-lg elevation-3">
      {/* Информация о пользователе */}
      <View className="flex-row items-center">
        <Image source={{ uri: ad.userPhoto }} className="w-[60px] h-[60px] rounded-full" />
        <View className="ml-2.5">
          <Text className="text-lg font-bold">{ad.userName}</Text>
          <Text className="text-sm text-gray-500">
            {ad.date ? new Date(ad.date).toLocaleDateString() : ''}
          </Text>
        </View>
      </View>

      {/* Детали объявления */}
      <Text className="mt-2.5 text-base text-gray-700">{ad.address}</Text>
      <Text className="mt-2.5 text-sm text-gray-800">{ad.description}</Text>

      {/* Карусель питомцев */}
      {ad.userPets && ad.userPets.length > 0 && (
        <Carousel
          data={ad.userPets}
          renderItem={renderPetItem}
          width={Dimensions.get('window').width}
          height={150}
          loop={false}
          
        />
      )}

      {/* Кнопка "Присоединиться к прогулке" */}
      <Button mode="contained" onPress={() => {}}>
        Присоединиться к прогулке
      </Button>
    </View>
  );
};

export default AdvrtCard;

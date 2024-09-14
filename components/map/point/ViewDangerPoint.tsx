// CompositeFormComponent.tsx

import React from 'react';
import { Alert, Linking, View } from 'react-native';
import { Text, Image } from 'react-native';
import { DANGERTYPE_TAGS } from '@/constants/Strings';
import { IPointDangerDTO } from '@/dtos/Interfaces/map/IPointDangerDTO';
import CustomTextComponent from '@/components/custom/text/CustomTextComponent';
import { getTagsByIndex } from '@/utils/utils';
import CustomButtonPrimary from '@/components/custom/buttons/CustomButtonPrimary';
import { Divider } from 'react-native-paper';

interface CompositeFormProps {
  mapPoint: IPointDangerDTO;
}

const ViewDangerPoint: React.FC<CompositeFormProps> = ({mapPoint }) => {

  const handleOpenMap = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapPoint?.latitude + ',' + mapPoint?.longitude || 'Unknown Location'
    )}`;

    // Проверка, может ли устройство открыть URL
    Linking.canOpenURL(mapUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(mapUrl);
        } else {
          Alert.alert('Ошибка', 'Не удается открыть карту.');
        }
      })
      .catch((err) => console.error('Ошибка при попытке открыть URL:', err));
  };

  return (
    <View className='px-7'>
      <Text className='text-xl font-nunitoSansBold'>Опасность</Text>
      <View className='flex-col'>
        {mapPoint.thumbnailUrl ? (
          <Image source={{ uri: mapPoint.thumbnailUrl }} className='w-80 h-40 rounded-2xl' />
        ) : null}
        <Divider className='mt-4 bg-slate-400'/>
        <Text className="pt-4 text-lg font-nunitoSansBold text-indigo-700">Тип опасности</Text>
        <Text className="text-base font-nunitoSansRegular">
          {getTagsByIndex(DANGERTYPE_TAGS, mapPoint.dangerType)} 
        </Text>
        <Divider className='mt-4 bg-slate-400'/>
        <Text className="mt-4 text-lg font-nunitoSansBold text-indigo-700">Описание</Text>
        <Text className="pt-4 text-base font-nunitoSansRegular">
          {mapPoint.description}
        </Text>
        <CustomButtonPrimary title='Открыть в Google Maps' handlePress={handleOpenMap}/>
      </View>
    </View>
  );
};

export default ViewDangerPoint;

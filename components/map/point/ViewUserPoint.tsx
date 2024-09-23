import React from 'react';
import { Alert, Linking, View } from 'react-native';
import { Text } from 'react-native';
import { AMENITIES_TAGS, USERSPOINTTYPE_TAGS } from '@/constants/Strings';
import CustomButtonPrimary from '../../custom/buttons/CustomButtonPrimary';
import { IPointUserDTO } from '@/dtos/Interfaces/map/IPointUserDTO';
import CustomTagsSelector from '@/components/custom/selectors/CustomTagsSelector';
import ImageModalViewer from '@/components/common/ImageModalViewer';
import { getTagsByIndex } from '@/utils/utils';

interface CompositeFormProps {
  mapPoint: IPointUserDTO;
}

const ViewUserPoint: React.FC<CompositeFormProps> = ({ mapPoint }) => {

  const handleOpenMap = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapPoint?.latitude + ',' + mapPoint?.longitude || 'Unknown Location'
    )}`;
    console.log(mapUrl);

    // Проверка, может ли устройство открыть URL
    Linking.openURL(mapUrl).catch((err) => {
      Alert.alert('Ошибка', 'Не удается открыть карту.');
      console.error('Ошибка при попытке открыть URL:', err);
    });
  };


  return (
    <View className='px-7'>
      <Text className='px-2 text-lg font-nunitoSansBold'>{getTagsByIndex(USERSPOINTTYPE_TAGS,mapPoint.userPointType)}</Text>
      <View className='flex-col'>
        {mapPoint.thumbnailUrl ? (
          <ImageModalViewer images={[{ uri: mapPoint.thumbnailUrl }]} imageHeight={150} imageWidth={320}/>
        ) : null}
        <Text className="pt-2 text-lg font-nunitoSansBold text-indigo-700">Название</Text>
        <Text className="text-base font-nunitoSansRegular">
          {mapPoint.name}
        </Text>
        <Text className="pt-2 text-lg font-nunitoSansBold text-indigo-700">Адрес</Text>
        <Text className="text-base font-nunitoSansRegular">
          {mapPoint.address}
        </Text>
        <CustomButtonPrimary title='Открыть в Google Maps' handlePress={handleOpenMap}/>
        <Text className="pt-2 text-lg font-nunitoSansBold text-indigo-700">Описание</Text>
        <Text className="text-base font-nunitoSansRegular">
          {mapPoint.description}
        </Text>
        <View>
          <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">Удобства</Text>
            <CustomTagsSelector tags={AMENITIES_TAGS} initialSelectedTags={mapPoint.amenities} readonlyMode/>
          </View>
        <View className="h-10"/>
      </View>
    </View>
  );
};

export default ViewUserPoint;

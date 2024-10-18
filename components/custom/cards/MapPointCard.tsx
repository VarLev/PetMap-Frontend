import React, { useEffect } from 'react';
import { View, Text, Linking } from 'react-native';
import { Card } from 'react-native-paper';
import CustomTextComponent from '../text/CustomTextComponent';
import CustomButtonPrimary from '../buttons/CustomButtonPrimary';
import ImageModalViewer from '@/components/common/ImageModalViewer';
import { calculateDistance, convertDistance } from '@/utils/utils';
import { useAlert } from '@/contexts/AlertContext';
import { IPointEntityDTO } from '@/dtos/Interfaces/map/IPointEntityDTO';
import mapStore from '@/stores/MapStore';
import CustomButtonOutlined from '../buttons/CustomButtonOutlined';
import { PARK_IMAGE } from '@/constants/Strings';
import { MapPointType } from '@/dtos/enum/MapPointType';

interface MapPointDangerCardProps {
  mapPoint: IPointEntityDTO;
  onDetailPress: (id: string, mapPointType: MapPointType) => void;
}

const MapPointCard: React.FC<MapPointDangerCardProps> = ({ mapPoint, onDetailPress}) => {
  const [distance, setDistance] = React.useState(0);
  const [image, setImage] = React.useState<string>();
  const { showAlert } = useAlert();

  useEffect(() => {
    getImage().then((url) => setImage(url));
    const dist = calculateDistance(
      mapPoint.latitude!,
      mapPoint.longitude!,
      mapStore.currentUserCoordinates[0],
      mapStore.currentUserCoordinates[1]
    );
    setDistance(dist);
    console.log(mapPoint.latitude, mapPoint.longitude);
  }, [mapPoint.latitude, mapPoint.longitude]);

  const getImage = async () : Promise<string> => {
    console.log(mapPoint.thumbnailUrl);
    if(mapPoint.thumbnailUrl) 
      return await mapStore.fetchPointImageUrl(mapPoint.thumbnailUrl);
    else 
      return PARK_IMAGE;
  }

  const handleOpenMap = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapPoint?.latitude + ',' + mapPoint?.longitude || 'Unknown Location'
    )}`;
    // Проверка, может ли устройство открыть URL
    Linking.openURL(mapUrl).catch((err) => {
      showAlert('Не удается открыть карту.', 'error');
      console.error('Ошибка при попытке открыть URL:', err);
    });
  };

  const handleDetailPress = () => {
    console.log('Detail press', mapPoint.id);
    onDetailPress(mapPoint.id, MapPointType.Park);
  }

  return (
    <Card className="mx-4 mt-5 -mb-2 bg-white rounded-2xl" elevation={5} >
      {/* Информация о пользователе */}
      <View className="flex-row items-center justify-stretch">
        <View>
          <ImageModalViewer images={[{ uri: image || 'https://placehold.it/100x100' }]} imageHeight={100} imageWidth={100} borderRadius={0} className_=' rounded-xl' />
        </View>
          <View className=" w-2/3">
            <Text className="pt-2 text-sm font-nunitoSansBold" 
              numberOfLines={1} 
              ellipsizeMode="tail"
              style={{ flexShrink: 1 }}>
              {mapPoint.name}
            </Text>
            
            <CustomTextComponent
              text={convertDistance(distance)}
              leftIcon='paper-plane-outline'
              iconSet='ionicons'
              className_='p-0'
            />
            <Text className="m-1 text-sm font-nunitoSansRegular text-gray-800" 
              numberOfLines={3} 
              ellipsizeMode="tail"
              style={{ flexShrink: 1 }}>
              {mapPoint.description}
            </Text>
        </View>
      </View>
      <View className='px-2 pb-2 -mt-1 flex-row w-full justify-between'>
        <CustomButtonPrimary title='Открыть на карте' containerStyles='w-1/2' handlePress={handleOpenMap}/>
        <CustomButtonOutlined title='Подробно' containerStyles='w-1/2' handlePress={handleDetailPress}/>
      </View>

    </Card>
  );
};

export default MapPointCard;

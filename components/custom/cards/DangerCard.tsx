import React from 'react';
import { View, Text, Linking } from 'react-native';
import { Card } from 'react-native-paper';
import CustomTextComponent from '../text/CustomTextComponent';
import CustomButtonPrimary from '../buttons/CustomButtonPrimary';
import ImageModalViewer from '@/components/common/ImageModalViewer';
import { IPointDangerDTO } from '@/dtos/Interfaces/map/IPointDangerDTO';
import { getTagsByIndex } from '@/utils/utils';
import { useAlert } from '@/contexts/AlertContext';
import i18n from '@/i18n';
import CustomButtonOutlined from '../buttons/CustomButtonOutlined';
import { MapPointType } from '@/dtos/enum/MapPointType';

interface MapPointDangerCardProps {
  mapPointDanger: IPointDangerDTO;
  onDetailPress: (id: string, mapPointType: MapPointType) => void;
}

const DangerCard: React.FC<MapPointDangerCardProps> = ({ mapPointDanger, onDetailPress }) => {

  const { showAlert } = useAlert();
  
  const handleOpenMap = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapPointDanger?.latitude + ',' + mapPointDanger?.longitude || 'Unknown Location'
    )}`;
    // Проверка, может ли устройство открыть URL
    Linking.openURL(mapUrl).catch((err) => {
      showAlert( i18n.t('MapPointCard.errorOpenMap'), 'error');
      console.error( i18n.t('MapPointCard.openMapErrorLog'), err);
    });
  };

  function handleDetailPress(): void {
     onDetailPress(mapPointDanger.id, MapPointType.Danger);
  }

  return (
    <Card className="mx-4 mt-5 -mb-2 bg-white rounded-2xl" elevation={5} >
      {/* Информация о пользователе */}
      <View className="flex-row items-center justify-stretch">
        <View>
          <ImageModalViewer images={[{ uri: mapPointDanger.thumbnailUrl || 'https://firebasestorage.googleapis.com/v0/b/petmeetar.appspot.com/o/assets%2Fimages%2Fpoints%2Fdanger.webp?alt=media&token=daf1312e-a62d-4fc4-8f53-f08bebf3eecf' }]} imageHeight={100} imageWidth={100} borderRadius={0} className_=' rounded-xl' />
        </View>
        
        {/* <Image source={{ uri: mapPointDanger.thumbnailUrl ||'https://placehold.it/100x100'}} className="w-20 h-20 " /> */}
        <View className="-mt-8  w-2/3">
          <Text className="text-lg font-nunitoSansBold">{ i18n.t('MapPointCard.danger')}</Text>
          <CustomTextComponent 
              text={getTagsByIndex(i18n.t('tags.DANGERTYPE_TAGS') as string[],mapPointDanger.dangerType) } 
              leftIcon='alert-circle-outline' 
              iconSet='ionicons' 
              className_='p-0 w-full'
              maxLines={1}
            />
            {mapPointDanger.description && <Text className="m-1  text-sm text-gray-800">{mapPointDanger.description}</Text>}
        </View>
      </View>
      {/* Детали объявления */}
      <View className='px-2 pb-2 -mt-1 flex-row w-full justify-between'>
        <CustomButtonPrimary title={i18n.t('MapPointCard.openMap')} containerStyles='w-40' handlePress={handleOpenMap}/>
        <CustomButtonOutlined
          title={i18n.t('MapPointCard.details')}
          containerStyles="w-40"
          handlePress={handleDetailPress}
        />
      </View>
      
    </Card>
  );
};

export default DangerCard;

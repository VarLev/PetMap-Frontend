import React, { useEffect, useState } from 'react';
import { Alert, Linking, View, Text } from 'react-native';
import { AMENITIES_TAGS, USERSPOINTTYPE_TAGS } from '@/constants/Strings';
import CustomButtonPrimary from '../../custom/buttons/CustomButtonPrimary';
import CustomTagsSelector from '@/components/custom/selectors/CustomTagsSelector';
import ImageModalViewer from '@/components/common/ImageModalViewer';
import mapStore from '@/stores/MapStore';
import { IPointEntityDTO } from '@/dtos/Interfaces/map/IPointEntityDTO';
import { getTagsByIndex } from '@/utils/utils';
import SkeletonCard from '@/components/custom/cards/SkeletonCard';

interface CompositeFormProps {
  mapPoint: IPointEntityDTO;
}

const ViewUserPoint: React.FC<CompositeFormProps> = ({ mapPoint }) => {
  const [pointData, setPointData] = useState<IPointEntityDTO>(mapPoint);
  const [loading, setLoading] = useState<boolean>(false); // Флаг для отслеживания загрузки
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const point = await mapStore.getMapPointById(mapPoint.id, mapPoint.mapPointType);
        await getImageUrl(point.thumbnailUrl);
        setPointData(point);
      } catch (error) {
        console.error('Ошибка при получении данных точки:', error);
      } finally {
        
        setLoading(false); // Завершаем загрузку
      }
    };

    fetchData();
  }, [mapPoint.id, mapPoint.mapPointType]); // Зависимость от ID и типа точки


  const getImageUrl = async (url: string | undefined) => {
    if(!url) return;
    try{
      const image = await mapStore.requestDownloadURL(url);
      if(image)
        setImageUrl(image)
      
    }
    catch(error){
      return;
    }
    
  }

  const handleOpenMap = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapPoint?.latitude + ',' + mapPoint?.longitude || 'Unknown Location'
    )}`;
    
    Linking.openURL(mapUrl).catch((err) => {
      Alert.alert('Ошибка', 'Не удается открыть карту.');
      console.error('Ошибка при попытке открыть URL:', err);
    });
  };

  if (loading) {
    return (
      <View className='px-4'>
        <SkeletonCard/>
        <SkeletonCard/>
      </View>); // Можно добавить индикатор загрузки
  }

  return (
    <View className='px-4'>
      <Text className='px-2 text-2xl font-nunitoSansBold'>{getTagsByIndex(USERSPOINTTYPE_TAGS, mapPoint.mapPointType)}</Text>
      <View className='-mt-2 h-36 overflow-hidden flex-row '>
        <ImageModalViewer images={[{ uri: imageUrl|| 'https://firebasestorage.googleapis.com/v0/b/petmeetar.appspot.com/o/assets%2Fimages%2Fpoints%2FPark.webp?alt=media&token=d553a7d8-d919-4514-88f0-faf0089cc067' }]} imageHeight={120} imageWidth={120}/>
        <View className='flex-col w-56'>
          <Text className=" text-lg font-nunitoSansBold text-indigo-700">Название</Text>
          <Text className="text-sm font-nunitoSansRegular">
            {pointData.name}
          </Text>
          <Text className="pt-2 text-lg font-nunitoSansBold text-indigo-700">Адрес</Text>
          <Text className="text-sm font-nunitoSansRegular">
            {pointData.address}
          </Text>
        </View>
      </View> 
        <View className='flex-col'>
        <CustomButtonPrimary title='Открыть в Google Maps' handlePress={handleOpenMap} />
        <Text className="pt-2 text-lg font-nunitoSansBold text-indigo-700">Описание</Text>
        <Text className="text-base font-nunitoSansRegular">
          {pointData.description}
        </Text>
        <View>
          <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">Удобства</Text>
          <CustomTagsSelector tags={AMENITIES_TAGS} initialSelectedTags={pointData.amenities!} readonlyMode visibleTagsCount={10} />
        </View>
        </View>
        
        <View className="h-10" />
      
    </View>
  );
};

export default ViewUserPoint;

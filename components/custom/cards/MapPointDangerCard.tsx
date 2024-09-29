import React from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import CustomTextComponent from '../text/CustomTextComponent';
import CustomButtonPrimary from '../buttons/CustomButtonPrimary';
import ImageModalViewer from '@/components/common/ImageModalViewer';
import { IPointDangerDTO } from '@/dtos/Interfaces/map/IPointDangerDTO';
import { getTagsByIndex } from '@/utils/utils';
import { DANGERTYPE_TAGS } from '@/constants/Strings';

interface MapPointDangerCardProps {
  mapPointDanger: IPointDangerDTO;
}

const MapPointDangerCard: React.FC<MapPointDangerCardProps> = ({ mapPointDanger }) => {

  return (
    <Card className="p-2 mx-4 mt-5 -mb-2 bg-white rounded-2xl" elevation={5} >
      {/* Информация о пользователе */}
      <View className="flex-1 flex-row items-center justify-stretch">
        <View className='-m-2'>
        <ImageModalViewer images={[{ uri: mapPointDanger.thumbnailUrl || 'https://placehold.it/100x100' }]} imageHeight={100} imageWidth={100} borderRadius={0} className_=' rounded-xl' />

        </View>
        
        {/* <Image source={{ uri: mapPointDanger.thumbnailUrl ||'https://placehold.it/100x100'}} className="w-20 h-20 " /> */}
        <View className="ml-1 w-full">
          <Text className="-mt-8 text-lg font-nunitoSansBold">Опасность</Text>
          <CustomTextComponent 
              text={getTagsByIndex(DANGERTYPE_TAGS,mapPointDanger.dangerType) } 
              leftIcon='alert-circle-outline' 
              iconSet='ionicons' 
              className_='p-0'
            />
            {mapPointDanger.description && <Text className="m-1 -mt-0.5 text-sm text-gray-800">{mapPointDanger.description}</Text>}
        </View>
      </View>
      {/* Детали объявления */}
      <View className='w-full px-1'>
        <CustomButtonPrimary title='Открыть в Google Maps' containerStyles='-mx-1'/>
      </View>
      
    </Card>
  );
};

export default MapPointDangerCard;

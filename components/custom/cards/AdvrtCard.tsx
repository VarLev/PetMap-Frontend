import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { IWalkAdvrtShortDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtShortDto';
import CustomTextComponent from '../text/CustomTextComponent';
import CustomButtonPrimary from '../buttons/CustomButtonPrimary';
import CustomButtonOutlined from '../buttons/CustomButtonOutlined';
import userStore from '@/stores/UserStore';
import { BREEDS_TAGS, PET_IMAGE } from '@/constants/Strings';
import { getTagsByIndex } from '@/utils/utils';
import ImageModalViewer from '@/components/common/ImageModalViewer';

interface AdCardProps {
  ad: IWalkAdvrtShortDto;
}

const AdvrtCard: React.FC<AdCardProps> = ({ ad }) => {
  const [petImage, setPetImage] = React.useState<string>();
  
  useEffect(() => {
    getPetImage().then((url) => setPetImage(url));
  } ,[]);

  const getPetImage = async () : Promise<string> => {
    const petImage = await userStore.fetchImageUrl(PET_IMAGE);
    return petImage || 'https://placehold.it/100x100';
  }

  return (
    <Card className="p-2 mx-4 mt-5 -mb-2 bg-white rounded-2xl" elevation={5} >
      {/* Информация о пользователе */}
      <View className="flex-row items-start">
        <Image source={{ uri: ad.userPhoto }} className="w-20 h-20 rounded-xl" />
        {ad.userPets && ad.userPets.length > 0 && (
          <View className="absolute top-8 left-8 rounded-full ">
            <ImageModalViewer images={[{ uri: ad.userPets[0].thumbnailUrl || petImage || 'https://placehold.it/100x100' }]} imageHeight={60} imageWidth={60} borderRadius={4} className_='rounded-full' />
            
          </View>
          
        )}
       
        <View className="ml-8 w-full">
          <Text className="-ml-4 text-lg font-nunitoSansBold">{ad.userName}</Text>
          <CustomTextComponent 
              text={ad.date ? new Date(ad.date).toLocaleTimeString() : 'Дата не указана'} 
              leftIcon='time-outline' 
              iconSet='ionicons' 
              className_='p-0'
            />
            <CustomTextComponent 
              text={'2км 500м'} 
              leftIcon='paper-plane-outline' 
              iconSet='ionicons' 
              className_='p-0'
            />
            {ad.userPets && ad.userPets.length > 0 && (
              <CustomTextComponent 
                text={`${ad.userPets[0].petName}, ${getTagsByIndex(BREEDS_TAGS, ad.userPets[0].breed!) }`} 
                leftIcon='paw-outline' 
                iconSet='ionicons' 
                className_='p-0 pt-1'
              />)
            }
        </View>
      </View>

      {/* Детали объявления */}
      {ad.description && <Text className="m-2 text-sm text-gray-800">{ad.description}</Text>}
      <View className='flex-row w-full justify-between px-1'>
        <CustomButtonPrimary title='Пригласить' containerStyles='w-1/2 -mx-1'/>
        <CustomButtonOutlined title='Профиль' containerStyles='w-1/2 -mx-1'/>
      </View>
      
    </Card>
  );
};

export default AdvrtCard;

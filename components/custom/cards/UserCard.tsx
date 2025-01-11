import React, { useEffect } from 'react';
import { View, Text, Image  } from 'react-native';
import { Card } from 'react-native-paper';
import CustomTextComponent from '../text/CustomTextComponent';
import userStore from '@/stores/UserStore';
import { PET_IMAGE, petCatUriImage, petUriImage } from '@/constants/Strings';
import {getTagsByIndex } from '@/utils/utils';
import { router } from 'expo-router';
import { IUserCardDto } from '@/dtos/Interfaces/user/IUserCardDto';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import i18n from '@/i18n';

interface UserCardProps {
  user: IUserCardDto;
}

const UserCard: React.FC<UserCardProps> = React.memo(({ user }) => {
  const [petImage, setPetImage] = React.useState<string>();
  const [userImage, setUserImage] = React.useState<string>();
  
  useEffect(() => {
    getPetImage().then((url) => setPetImage(url));
    if(user.thumbnailUrl) 
      setUserImage(user.thumbnailUrl);
    else
      setUserImage('https://placehold.it/100x100');

  }, []);

  const getPetImage = async () : Promise<string> => {
    if (user.petProfiles && user.petProfiles.length > 0 && user.petProfiles[0].thumbnailUrl ) {
      const petImage = await userStore.fetchImageUrl(PET_IMAGE);
      return petImage || 'https://placehold.it/100x100';
    }else{
      return 'https://placehold.it/100x100';
    }

  }

  const handleUserProfileOpen = () => {
    router.push(`(user)/${user.id}`);
  };

  return (
    <Card className="p-2 mx-1 mt-2 bg-white rounded-2xl" elevation={1} >
      {/* Информация о пользователе */}
      <View className="flex-row items-start">
        <TouchableOpacity onPress={handleUserProfileOpen}>
          <Image source={{ uri: user.thumbnailUrl || userImage || 'https://placehold.it/100x100' }} className="w-20 h-20 rounded-xl" />
        </TouchableOpacity>
       
        {user.petProfiles && user.petProfiles.length > 0 && (
          <View className="absolute top-10 left-12 rounded-full ">
            <Image source={[{ uri: user.petProfiles[0].thumbnailUrl || (user.petProfiles[0].animalType === 1 ? petCatUriImage : petUriImage) }]} className="w-10 h-10 rounded-full" style={{borderWidth:2, borderColor:'white'}} />
          </View>
        )}
        <View className="ml-8 w-full flex-1">
            <Text className="-ml-4 text-lg font-nunitoSansBold" 
              numberOfLines={1} 
              ellipsizeMode="tail"
              style={{ flexShrink: 1 }}>
                {user.name}
            </Text>
            <Text className="-ml-4 text-base font-nunitoSansRegular" 
              numberOfLines={1} 
              ellipsizeMode="tail"
              style={{ flexShrink: 1 }}>
                {i18n.t('TopUsers.rate')} {user.balance}
            </Text>
            {user.petProfiles && user.petProfiles .length > 0 && (
              <CustomTextComponent 
                text={`${user.petProfiles[0].petName}, ${getTagsByIndex(user.petProfiles[0].animalType === 1 ? i18n.t('tags.breedsCat') as string[] : i18n.t('tags.breedsDog') as string[] , user.petProfiles[0].breed!) }`} 
                leftIcon='paw-outline' 
                iconSet='ionicons' 
                maxLines={1}
                className_='p-0 -ml-3'
              />)
            }
        </View>
      </View> 
    </Card>
  );
});

UserCard.displayName = 'UserCard';

export default UserCard;

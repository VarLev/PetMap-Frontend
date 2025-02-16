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
  const [hasSubscription, seHasSubscription] = React.useState<boolean>(false);
  
  useEffect(() => {
    (async () => {
      const petUrl = await getPetImage();
      setPetImage(petUrl);
      if(await checkImageExists(user.thumbnailUrl ?? '') && user.thumbnailUrl !== '' && user.thumbnailUrl !== 'null' && user.thumbnailUrl !== 'undefined') {
        setUserImage(user.thumbnailUrl!);
      } else {
        setUserImage(`https://avatar.iran.liara.run/username?username=${user.name}`);
      }
      seHasSubscription(user.isPremium ?? false);
    })();
  }, []);

  const checkImageExists = async (url: string) => {
    try {
      await Image.prefetch(url);
      return true;
    } catch {
      return false;
    }
  };

  const getPetImage = async () : Promise<string> => {
    if (user.petProfiles && user.petProfiles.length > 0 && user.petProfiles[0].thumbnailUrl ) {
      const petImage = await userStore.fetchImageUrl(PET_IMAGE);
      return petImage || petUriImage;
    }else{
      return petUriImage;
    }

  }



  const handleUserProfileOpen = () => {
    router.push(`(user)/${user.id}`);
  };

  return (
    <Card className="p-2 mx-1 mt-2 bg-white rounded-2xl" elevation={1} >
      {/* Информация о пользователе */}
      <View className="flex-row items-start">
        <TouchableOpacity activeOpacity={0.8} onPress={handleUserProfileOpen}>
          <View className="relative">
            {hasSubscription &&(<Image source={require('@/assets/images/subscription-marker.png')}/>)}                       
          </View>
          <Image source={{ uri: userImage || `https://avatar.iran.liara.run/username?username=${user.name}` }} className="w-20 h-20 rounded-xl" />
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

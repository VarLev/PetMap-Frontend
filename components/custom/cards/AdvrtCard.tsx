import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { IWalkAdvrtShortDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtShortDto';
import CustomTextComponent from '../text/CustomTextComponent';
import CustomButtonPrimary from '../buttons/CustomButtonPrimary';
import CustomButtonOutlined from '../buttons/CustomButtonOutlined';
import userStore from '@/stores/UserStore';
import { PET_IMAGE } from '@/constants/Strings';
import { calculateDistance, convertDistance, getTagsByIndex } from '@/utils/utils';
import ImageModalViewer from '@/components/common/ImageModalViewer';
import mapStore from '@/stores/MapStore';
import { router } from 'expo-router';
import uiStore from '@/stores/UIStore';
import i18n from '@/i18n';

interface AdCardProps {
  ad: IWalkAdvrtShortDto;
}

const AdvrtCard: React.FC<AdCardProps> = React.memo(({ ad }) => {
  const [petImage, setPetImage] = useState<string>();
  const [distance, setDistance] = useState(0);
  const [userIsOwner, setUserIsOwner] = useState(false);

  useEffect(() => {
    getPetImage().then((url) => setPetImage(url));
    const dist = calculateDistance(
      ad.latitude!,
      ad.longitude!,
      mapStore.currentUserCoordinates[0],
      mapStore.currentUserCoordinates[1]
    );
    setDistance(dist);

    setUserIsOwner(ad.userId === userStore.currentUser?.id);
  }, [ad.latitude, ad.longitude]);

  const getPetImage = async (): Promise<string> => {
    const petImage = await userStore.fetchImageUrl(PET_IMAGE);
    return petImage || 'https://placehold.it/100x100';
  };

  const handleUserProfileOpen = () => {
    const route = userIsOwner ? '/profile' : `/(user)/${ad.userId}`;
    router.push(route);
    uiStore.setIsBottomTableViewSheetOpen(false);
  };

  return (
    <Card className="p-2 mx-3 mt-2 bg-white rounded-2xl" elevation={1}>
      {/* Информация о пользователе */}
      <View className="flex-row items-start">
        <Image source={{ uri: ad.userPhoto }} className="w-20 h-20 rounded-xl" />
        {ad.userPets && ad.userPets.length > 0 && (
          <View className="absolute top-8 left-8 rounded-full">
            <ImageModalViewer
              images={[
                {
                  uri:
                    ad.userPets[0].thumbnailUrl ||
                    petImage ||
                    'https://placehold.it/100x100',
                },
              ]}
              imageHeight={60}
              imageWidth={60}
              borderRadius={4}
              className_="rounded-full"
            />
          </View>
        )}
        <View className="ml-8 w-full flex-1">
          <Text
            className="-ml-4 text-lg font-nunitoSansBold"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ flexShrink: 1 }}
          >
            {ad.userName}
          </Text>
          
          {/* <CustomTextComponent
            text={
              ad.date
                ? new Date(ad.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : i18n.t('AdvrtCard.noDate')
            }
            leftIcon="time-outline"
            iconSet="ionicons"
            className_="p-0"
          /> */}

          <CustomTextComponent
            text={convertDistance(distance)}
            leftIcon="paper-plane-outline"
            iconSet="ionicons"
            className_="p-0"
          />
          {ad.userPets && ad.userPets.length > 0 && (
            <View>
              <CustomTextComponent
                text={`${ad.userPets[0].petName}, ${getTagsByIndex(
                 i18n.t('tags.TypePet') as string[] ,
                  ad.userPets[0].animalType!
                )}`}
                leftIcon="paw-outline"
                iconSet="ionicons"
                maxLines={1}
                className_="p-0 pt-1"
              />
              <CustomTextComponent
                text={`${getTagsByIndex(
                  ad.userPets[0].animalType === 1 ? i18n.t('tags.breedsCat') as string[] : i18n.t('tags.breedsDog') as string[],
                  ad.userPets[0].breed!
                )}`}
                
                maxLines={1}
                className_="p-0 pt-1"
              />
            </View>
          )}
        </View>
      </View>
      {/* Детали объявления */}
      {ad.description && (
        <Text
          className="mt-1 text-xs text-gray-800"
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{ flexShrink: 1 }}
        >
          {ad.description}
        </Text>
      )}
      <View className="flex-row w-full justify-between">
        <CustomButtonPrimary title={i18n.t('AdvrtCard.invite')} containerStyles="w-1/2" />
        <CustomButtonOutlined
          title={i18n.t('AdvrtCard.profile')}
          containerStyles="w-1/2"
          handlePress={handleUserProfileOpen}
        />
      </View>
    </Card>
  );
});

AdvrtCard.displayName = 'AdvrtCard';

export default AdvrtCard;
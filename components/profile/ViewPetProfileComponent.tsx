import { Pet } from '@/dtos/classes/pet/Pet';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StatusBar, View, Image, StyleSheet, Platform, Dimensions, Pressable } from 'react-native';
import { Text, IconButton, Menu, Divider, Avatar } from 'react-native-paper';
import { calculateDogAge, getTagsByIndex } from '@/utils/utils';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetComponent from '../common/BottomSheetComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomTextComponent from '../custom/text/CustomTextComponent';
import { observer } from 'mobx-react-lite';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { router, useNavigation } from 'expo-router';
import petStore from '@/stores/PetStore';
import { petCatUriImage, petUriImage } from '@/constants/Strings';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';
import CircleIcon from '../custom/icons/CircleIcon';
import MenuItemWrapper from '@/components/custom/menuItem/MunuItemWrapper';
import i18n from '@/i18n';
import { BG_COLORS } from '@/constants/Colors';
import userStore from '@/stores/UserStore';
import { Photo } from '@/dtos/classes/Photo';
import Animated from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const ViewPetProfileComponent = observer(({ pet, onEdit }: { pet: Pet; onEdit: () => void }) => {
  const sheetRef = useRef<BottomSheet>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [rightIcon, setRightIcon] = useState<string | null>();
  const [isIOS, setIsIOS] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const { width, height } = Dimensions.get('window');
  const [petPhotos, setPetPhotos] = useState<Photo[]>();
  
  // Если фотографии загружены – используем petPhotos, иначе дефолтное изображение
    const carouselData = petPhotos && petPhotos.length > 0 
    ? petPhotos 
    : [new Photo({
        id: 'default',
        url: pet.thumbnailUrl || (pet.animalType === 1 ? petCatUriImage : petUriImage),
        isMain: true,
        dateCreated: new Date(),
        userId: pet.userId,
        petProfileId: pet.id
      })];

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
        {isCurrentUser && (
          <Menu
            style={{ marginTop: 25 }}
            visible={menuVisible}
            onDismiss={closeMenu}
            contentStyle={{ backgroundColor: 'white' }}
            anchor={
              
              <IconButton
                icon="menu"
                size={30}
                iconColor='white'
                style={styles.menuButton}
                onPress={openMenu}
              />
           
            }
          >
            <MenuItemWrapper
              onPress={() => {
                onEdit();
                closeMenu();
              }}
              title={i18n.t('PetProfile.edit')}
              icon="pencil-outline"
            />
            <MenuItemWrapper
              onPress={() => {
                onDelete();
                closeMenu();
              }}
              title={i18n.t('PetProfile.delete')}
              icon="delete-outline"
            />
          </Menu>
        )}
      </>
      ),
    });
  }, [isCurrentUser, isIOS, menuVisible, navigation, onEdit]);

  // Хук для загрузки фотографий питомца
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
    
        // Создаем объект для thumbnail, который всегда должен быть первым
        const thumbnailPhoto = new Photo({
          id: 'thumbnail',
          url: pet.thumbnailUrl || (pet.animalType === 1 ? petCatUriImage : petUriImage),
          isMain: true,
          dateCreated: new Date(),
          userId: pet.userId,
          petProfileId: pet.id
        });
        // Обновляем состояние: первым элементом всегда идет thumbnailPhoto
        setPetPhotos([thumbnailPhoto, ...pet.photos || []]);
        console.log('Pet photos:', petPhotos);
      } catch (error) {
        console.error('Ошибка загрузки фотографий питомца: ', error);
      }
    };

    fetchPhotos();
  }, [pet.id, pet.thumbnailUrl, pet.animalType, pet.userId]);

  useEffect(() => {
    setIsIOS(Platform.OS === 'ios');
  }, []);

  useEffect(() => {
    petStore.currentUserPets?.forEach((p) => {
      if (p.id === pet.id) {
        setIsCurrentUser(true);
        setRightIcon('chevron-right');
      } else {
        setRightIcon(null);
      }
    });

  }, [pet]);

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const onDelete = async () => {
    setMenuVisible(false);
    console.log('Delete pet', pet.id);
    await petStore.deletePetProfile(pet.id);
    router.replace(`/(user)/${userStore.currentUser?.id}`);
  };

  const handlePress=() => {
    router.push(`/(user)/${pet.userId}`);
  }

  return (
    <GestureHandlerRootView className="h-full">
      <View style={{ alignItems: 'center' }}>
        <StatusBar backgroundColor="transparent" translucent />
        <View className="relative w-full aspect-square">
          {/* <Image source={{ uri: pet.thumbnailUrl|| (pet.animalType === 1 ? petCatUriImage : petUriImage) }} className="w-full h-full" /> */}
          <Carousel
            loop
            vertical
            autoPlay={false}
            data={carouselData}
            width={width} // Обязательно для вертикальной ориентации
            height={width} // Используем ширину экрана для квадратного формата
            style={{ width: '100%', height: '100%' }}
            onSnapToItem={(index) => setCurrentIndex(index)}
            renderItem={({ item }) => (
              <Animated.View style={{ flex: 1 }}>
                <Image 
                  source={{ uri: item.url }} 
                  style={[styles.carouselImage, { 
                    width: width,
                    height: width // Сохраняем квадратный формат
                  }]} 
                  resizeMode="cover"
                />
              </Animated.View>
            )}
          />

          {renderPagination()}
          
          <View className='absolute bottom-12 left-5 items-center'>
          <View
            style={{
              zIndex: 10,
              width: 60,           // размер контейнера равен размеру аватара
              height: 60,
              borderWidth: 2,      // толщина обводки
              borderColor: 'white',// цвет обводки
              borderRadius: 60 / 2, // чтобы контейнер был круглый
              overflow: 'hidden',  // обрезаем содержимое по границам контейнера
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Pressable onPress={handlePress}>
              <Avatar.Image
                size={60} 
                source={{ uri: pet.userThumbnailUrl?? 'https://avatar.iran.liara.run/public' }} // аватарка пользователя
              />
            </Pressable>
          </View>
            <Text className='font-nunitoSansBold text-white text-lg -m-2'>
                Owner
            </Text>
          </View>
         
        </View>
      </View>

      <BottomSheetComponent
        ref={sheetRef}
        enablePanDownToClose={false}
        snapPoints={['55%', '100%']}
        renderContent={
          <View className="bg-white h-full">
            <Text className="pl-5 text-2xl font-nunitoSansBold">
              {pet.petName} {calculateDogAge(pet.birthDate)}
            </Text>

            <View className="pr-3 pl-4">

              {/* Основное - показываем всегда, так как вид питомца, пол, породу, ДР, вес и рост скорее всего всегда заполнены */}
              <View>
                <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">
                  {i18n.t('PetProfile.main')}
                </Text>
                {!!pet.petName?.trim() && (
                  <CustomTextComponent
                    text={pet.animalType === 1 ? i18n.t('PetProfile.cat'): i18n.t('PetProfile.dog')}
                    rightIcon={rightIcon}
                    onRightIconPress={onEdit}
                    leftIcon="paw-outline"
                    iconSet="ionicons"
                  />
                )}

                {pet.gender !== undefined && pet.gender !== null && (
                  <CustomTextComponent
                    text={getTagsByIndex(i18n.t('tags.petGender') as string[], Number(pet.gender!))}
                    rightIcon={rightIcon}
                    onRightIconPress={onEdit}
                    leftIcon="transgender-outline"
                    iconSet="ionicons"
                  />
                )}

                {pet.breed !== undefined && pet.breed !== null && (
                  <CustomTextComponent
                    text={pet.animalType === 1 ? getTagsByIndex(i18n.t('tags.breedsCat') as string[], pet.breed!): getTagsByIndex(i18n.t('tags.breedsDog') as string[], pet.breed!)}
                    rightIcon={rightIcon}
                    onRightIconPress={onEdit}
                    leftIcon="dog"
                    iconSet="materialCommunity"
                  />
                )}

                {!!pet.birthDate && (
                  <CustomTextComponent
                    text={pet?.birthDate?.toLocaleDateString()}
                    rightIcon={rightIcon}
                    onRightIconPress={onEdit}
                    leftIcon="cake-variant-outline"
                    iconSet="materialCommunity"
                  />
                )}

                {(!!pet.weight || !!pet.size) && (
                  <CustomTextComponent
                    text={`${pet.weight ? `${pet.weight} kg` : ''}${pet.weight && pet.size ? ', ' : ''}${
                      pet.size ? `${pet.size} sm` : ''
                    }`}
                    rightIcon={rightIcon}
                    onRightIconPress={onEdit}
                    leftIcon="resize-outline"
                    iconSet="ionicons"
                  />
                )}
                <Divider />
              </View>

              {/* Здоровье - рендерим только если есть данные о здоровье или вакцинациях */}
              {(pet.petHealthIssues && pet.petHealthIssues.length > 0) || 
              (pet.vaccinations && pet.vaccinations.length > 0) ? (
                <View>
                  <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">
                    {i18n.t('PetProfile.health')}
                  </Text>
                  <Text className="pt-2 font-nunitoSansRegular text-gray-400 text-center">
                    {i18n.t('PetProfile.healthUpdate')}
                  </Text>

                  {pet.petHealthIssues && pet.petHealthIssues.length > 0 && (
                    <>
                      <Text className="pt-4 -mb-1 text-sm font-nunitoSansBold text-indigo-700">
                        {i18n.t('PetProfile.healthFeatures')}
                      </Text>
                      <CustomTagsSelector
                        tags={i18n.t('tags.petHealthIssues') as string[]}
                        initialSelectedTags={pet.petHealthIssues || []}
                        readonlyMode
                        visibleTagsCount={10}
                      />
                    </>
                  )}

                  {pet.vaccinations && pet.vaccinations.length > 0 && (
                    <>
                      <Text className="pt-4 -mb-1 text-sm font-nunitoSansBold text-indigo-700">
                        {i18n.t('PetProfile.vaccinations')}
                      </Text>
                      <CustomTagsSelector
                        tags={i18n.t('tags.vaccines') as string[]}
                        initialSelectedTags={pet.vaccinations || []}
                        readonlyMode
                        visibleTagsCount={10}
                      />
                    </>
                  )}
                  <Divider className="mt-3" />
                </View>
              ) : null}

              {/* Показатели - рендерим, только если есть хотя бы один показатель */}
              {(pet.temperament !== undefined && pet.temperament !== null) ||
              (pet.friendliness !== undefined && pet.friendliness !== null) ||
              (pet.activityLevel !== undefined && pet.activityLevel !== null) ? (
                <View>
                  <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">
                    {i18n.t('PetProfile.indicators')}
                  </Text>
                  {pet.temperament !== undefined && pet.temperament !== null && (
                    <View className="pt-2 flex-row justify-between">
                      <Text className="font-nunitoSansRegular text-base">{i18n.t('PetProfile.temperament')}</Text>
                      <StarRatingDisplay
                        rating={pet.temperament ?? 0}
                        starSize={25}
                        color="#BFA8FF"
                        StarIconComponent={CircleIcon}
                      />
                    </View>
                  )}
                  {pet.friendliness !== undefined && pet.friendliness !== null && (
                    <View className="pt-2 flex-row justify-between">
                      <Text className="font-nunitoSansRegular text-base">{i18n.t('PetProfile.friendliness')}</Text>
                      <StarRatingDisplay
                        rating={pet.friendliness ?? 0}
                        starSize={25}
                        color="#BFA8FF"
                        StarIconComponent={CircleIcon}
                      />
                    </View>
                  )}
                  {pet.activityLevel !== undefined && pet.activityLevel !== null && (
                    <View className="pt-2 flex-row justify-between">
                      <Text className="font-nunitoSansRegular text-base">{i18n.t('PetProfile.activity')}</Text>
                      <StarRatingDisplay
                        rating={pet.activityLevel ?? 0}
                        starSize={25}
                        color="#BFA8FF"
                        StarIconComponent={CircleIcon}
                      />
                    </View>
                  )}
                  <Divider className="mt-3" />
                </View>
              ) : null}

              {/* Игровые предпочтения - только если массив не пустой */}
              {pet.playPreferences && pet.playPreferences.length > 0 && (
                <View>
                  <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">
                    {i18n.t('PetProfile.playPreferences')}
                  </Text>
                  <CustomTagsSelector
                    tags={i18n.t('tags.petGames') as string[]}
                    initialSelectedTags={pet.playPreferences || []}
                    readonlyMode
                    visibleTagsCount={10}
                  />
                  <Divider className="mt-3" />
                </View>
              )}

              {/* О питомце - только если есть текст */}
              {!!pet.additionalNotes?.trim() && (
                <View>
                  <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">
                    {i18n.t('PetProfile.aboutPet')}
                  </Text>
                  <CustomTextComponent
                    text={pet.additionalNotes}
                    rightIcon={rightIcon}
                    onRightIconPress={onEdit}
                  />
                  <Divider className="mt-3" />
                </View>
              )}

              {/* Социальные сети - рендерим, только если есть ссылки */}
              {/* {(!!pet.instagram?.trim() || !!pet.facebook?.trim()) && (
                <View>
                  <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">
                    {i18n.t('PetProfile.socialMedia')}
                  </Text>
                  {!!pet.instagram?.trim() && (
                    <CustomSocialLinkInput
                      text={pet.instagram!}
                      leftIcon="instagram"
                      iconSet="fontAwesome"
                      rightIcon={rightIcon}
                      onRightIconPress={onEdit}
                      platform="instagram"
                    />
                  )}
                  {!!pet.facebook?.trim() && (
                    <CustomSocialLinkInput
                      text={pet.facebook!}
                      leftIcon="facebook"
                      iconSet="fontAwesome"
                      rightIcon={rightIcon}
                      onRightIconPress={onEdit}
                      platform="facebook"
                    />
                  )}
                  <Divider className="mt-3" />
                </View>
              )} */}

            </View>
            <View className="h-28" />
          </View>
        }
      />
    </GestureHandlerRootView>
  );
   // Функция для отрисовки пагинации (точек)
   function renderPagination() {
    return (
      <View style={styles.paginationContainer}>
        {carouselData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index % carouselData.length 
                ? styles.activeDot 
                : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    );
  }
});

export default ViewPetProfileComponent;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  menuButton: {
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  paginationContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 1000,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
  activeDot: {
    backgroundColor: BG_COLORS.indigo[700],
  },
  inactiveDot: {
    backgroundColor: '#ffffff80',
  },
});
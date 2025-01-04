import { Pet } from '@/dtos/classes/pet/Pet';
import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, View, Image, StyleSheet, Platform } from 'react-native';
import { Text, IconButton, Menu, Divider } from 'react-native-paper';
import { calculateDogAge, getTagsByIndex } from '@/utils/utils';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetComponent from '../common/BottomSheetComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomTextComponent from '../custom/text/CustomTextComponent';
import CustomSocialLinkInput from '../custom/text/SocialLinkInputProps';
import { observer } from 'mobx-react-lite';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { router } from 'expo-router';
import petStore from '@/stores/PetStore';
import { petUriImage } from '@/constants/Strings';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';
import CircleIcon from '../custom/icons/CircleIcon';
import MenuItemWrapper from '@/components/custom/menuItem/MunuItemWrapper';
import i18n from '@/i18n';
import { BG_COLORS } from '@/constants/Colors';

const ViewPetProfileComponent = observer(({ pet, onEdit }: { pet: Pet; onEdit: () => void }) => {
  const sheetRef = useRef<BottomSheet>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [rightIcon, setRightIcon] = useState<string | null>();
  const [isIOS, setIsIOS] = useState(false);

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
    router.replace('/profile');
  };

  return (
    <GestureHandlerRootView className="h-full">
      <View style={{ alignItems: 'center' }}>
        <StatusBar backgroundColor="transparent" translucent />
        <View className="relative w-full aspect-square">
          <Image source={{ uri: pet?.thumbnailUrl || petUriImage }} className="w-full h-full" />
          <View style={styles.iconContainer} className={`${isIOS ? 'mt-14' : 'mt-6'} `}>
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
                    iconColor={BG_COLORS.indigo[700]}
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
                    text={i18n.t('PetProfile.dog')}
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
                    text={getTagsByIndex(i18n.t('tags.breeds') as string[], pet.breed!)}
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
              {(!!pet.instagram?.trim() || !!pet.facebook?.trim()) && (
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
              )}

            </View>
            <View className="h-28" />
          </View>
        }
      />
    </GestureHandlerRootView>
  );
});

export default ViewPetProfileComponent;

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 8,
    right: 8,
    zIndex: 1000,
  },
  iconBackContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 8,
    left: 8,
  },
  menuButton: {
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop:100
  },
});
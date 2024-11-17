import { Pet } from '@/dtos/classes/pet/Pet';
import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, View,Image, StyleSheet } from 'react-native';
import { Text, IconButton, PaperProvider, Menu, Divider } from 'react-native-paper';
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
import { BREEDS_TAGS, DOGGAMES_TAGS, DOGVACCINATIONS_TAGS, PETGENDERS_TAGS, PETHEALTHISSUES_TAGS, petUriImage } from '@/constants/Strings';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';
import CircleIcon from '../custom/icons/CircleIcon';
import MenuItemWrapper from '@/components/custom/menuItem/MunuItemWrapper';

const ViewPetProfileComponent = observer(({ pet , onEdit}: { pet: Pet, onEdit: () => void}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState( false);
  
  useEffect(() => {
    //console.log(pet);
    petStore.currentUserPets?.forEach((p) => {
      console.log(p.id, pet.id);
      if(p.id === pet.id){
        setIsCurrentUser(true);
      }
    });
  }, [pet]);

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => {
    setMenuVisible(false);
  }

  const onDelete = async () => {
    setMenuVisible(false);
    console.log('Delete pet', pet.id);
    await petStore.deletePetProfile(pet.id);
    router.replace('/profile'); 
      
  }

  const handleBack = () => {

    router.back();
  }

  return (
    <GestureHandlerRootView className='h-full'>
      <PaperProvider>
        <View style={{ alignItems: 'center'}}>
          <StatusBar backgroundColor="transparent" translucent />
          <View className="relative w-full aspect-square"> 
            <Image source={{ uri: pet?.thumbnailUrl || petUriImage }} className="w-full h-full" />
           <View className='flex-row w-full justify-between items-center pr-3' style={styles.iconBackContainer}>
            <View className='bg-white rounded-full opacity-70' >
             <IconButton icon='arrow-left' size={25} iconColor='black'  onPress={handleBack}/> 
            </View>
            <View >
              {isCurrentUser &&(<Menu 
                style={{marginTop: 25}}
                visible={menuVisible}
                onDismiss={closeMenu}
                contentStyle={{ backgroundColor: 'white' }}
                anchor={
                  <IconButton
                    icon="menu"
                    size={30}
                    iconColor="black"
                    style={styles.menuButton}
                    onPress={openMenu}
                  />
                }
              >
                <MenuItemWrapper onPress={onEdit} title="Редактировать"  icon='pencil-outline'/>
                <MenuItemWrapper onPress={onDelete} title="Удалить питомца"  icon='delete-outline'/>
              </Menu>)}
              
            </View>
           </View>
            
          </View>
        </View>
      </PaperProvider>
      <BottomSheetComponent
  ref={sheetRef}
  enablePanDownToClose={false}
  snapPoints={['60%', '100%']}
  renderContent={
    <View className="bg-white h-full">
      <Text className="pl-5 text-2xl font-nunitoSansBold">
        {pet.petName} {calculateDogAge(pet.birthDate)}
      </Text>

      <View className="pr-3 pl-4">
        <View>
          <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">Основное</Text>
          <CustomTextComponent
            text="Собака"
            rightIcon="chevron-right"
            onRightIconPress={onEdit}
            leftIcon="paw-outline"
            iconSet="ionicons"
          />
          <CustomTextComponent
            text={getTagsByIndex(PETGENDERS_TAGS, Number(pet.gender!))}
            rightIcon="chevron-right"
            onRightIconPress={onEdit}
            leftIcon="transgender-outline"
            iconSet="ionicons"
          />
          <CustomTextComponent
            text={getTagsByIndex(BREEDS_TAGS, pet.breed!)}
            rightIcon="chevron-right"
            onRightIconPress={onEdit}
            leftIcon="dog"
            iconSet="materialCommunity"
          />
          <CustomTextComponent
            text={pet?.birthDate?.toLocaleDateString()}
            rightIcon="chevron-right"
            onRightIconPress={onEdit}
            leftIcon="cake-variant-outline"
            iconSet="materialCommunity"
          />
          <CustomTextComponent
            text={`${pet.weight ? `${pet.weight} кг` : ''}${pet.weight && pet.size ? ', ' : ''}${pet.size ? `${pet.size} см` : ''}`}
            rightIcon="chevron-right"
            onRightIconPress={onEdit}
            leftIcon="resize-outline"
            iconSet="ionicons"
          />
          <Divider />
        </View>

        {/* Остальные секции */}
        <View>
          <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">Здоровье</Text>
          <Text className="pt-2 font-nunitoSansRegular text-gray-400 text-center">
            We are working on a health passport for your pet, stay tuned for updates.
          </Text>
          <Text className="pt-4 -mb-1 text-sm font-nunitoSansBold text-indigo-700">Особенности здоровья</Text>
          <CustomTagsSelector
            tags={PETHEALTHISSUES_TAGS}
            initialSelectedTags={pet.petHealthIssues || []}
            readonlyMode
            visibleTagsCount={10}
          />
          <Text className="pt-4 -mb-1 text-sm font-nunitoSansBold text-indigo-700">Вакцины</Text>
          <CustomTagsSelector
            tags={DOGVACCINATIONS_TAGS}
            initialSelectedTags={pet.vaccinations || []}
            readonlyMode
            visibleTagsCount={10}
          />
          <Divider className="mt-3" />
        </View>

        {/* Показатели */}
        <View>
          <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">Показатели</Text>
          <View className="pt-2 flex-row justify-between">
            <Text className="font-nunitoSansRegular text-base">Темперамент</Text>
            <StarRatingDisplay
              rating={pet.temperament ?? 0}
              starSize={25}
              color="#BFA8FF"
              StarIconComponent={CircleIcon}
            />
          </View>
          <View className="pt-2 flex-row justify-between">
            <Text className="font-nunitoSansRegular text-base">Дружелюбность</Text>
            <StarRatingDisplay
              rating={pet.friendliness ?? 0}
              starSize={25}
              color="#BFA8FF"
              StarIconComponent={CircleIcon}
            />
          </View>
          <View className="pt-2 flex-row justify-between">
            <Text className="font-nunitoSansRegular text-base">Активность</Text>
            <StarRatingDisplay
              rating={pet.activityLevel ?? 0}
              starSize={25}
              color="#BFA8FF"
              StarIconComponent={CircleIcon}
            />
          </View>
          <Divider className="mt-3" />
        </View>

        {/* Игровые предпочтения */}
        <View>
          <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">Игровые предпочтения</Text>
          <CustomTagsSelector
            tags={DOGGAMES_TAGS}
            initialSelectedTags={pet.playPreferences || []}
            readonlyMode
            visibleTagsCount={10}
          />
          <Divider className="mt-3" />
        </View>

        {/* О питомце */}
        <View>
          <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">О питомце</Text>
          <CustomTextComponent text={pet.additionalNotes} rightIcon="chevron-right" onRightIconPress={onEdit} />
          <Divider className="mt-3" />
        </View>

        {/* Социальные сети */}
        <View>
          <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">Социальные сети</Text>
          <CustomSocialLinkInput
            text={pet.instagram!}
            leftIcon="instagram"
            iconSet="fontAwesome"
            rightIcon="chevron-right"
            onRightIconPress={onEdit}
            platform="instagram"
          />
          <CustomSocialLinkInput
            text={pet.facebook!}
            leftIcon="facebook"
            iconSet="fontAwesome"
            rightIcon="chevron-right"
            onRightIconPress={onEdit}
            platform="facebook"
          />
          <Divider className="mt-3" />
        </View>
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
  },
  iconBackContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 8,
    left: 8,
  },
  menuButton: {
    backgroundColor: 'white',
    opacity: 0.7,
  }
  
});

function loadUser() {
  throw new Error('Function not implemented.');
}

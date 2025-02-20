import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Dimensions, Platform, StyleSheet, ImageSourcePropType, Image, FlatList, Modal, BackHandler } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Avatar, Button, HelperText, Text } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import userStore from '@/stores/UserStore';
import { IPet } from '@/dtos/Interfaces/pet/IPet';
import CustomInputText from '../custom/inputs/CustomInputText';
import { randomUUID } from 'expo-crypto';
import { User } from '@/dtos/classes/user/UserDTO';
import CustomSegmentedButtons from '../custom/buttons/CustomSegmentedButtons';
import BottomSheetComponent from '../common/BottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet';
import AvatarSelector from '../common/AvatarSelector';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { avatarsStringF, avatarsStringM } from '@/constants/Avatars';
import CustomDropdownList from '../custom/selectors/CustomDropdownList';
import { setUserAvatarDependOnGender } from '@/utils/utils';
import { BonusContex } from '@/contexts/BonusContex';
import { useControl } from '@/hooks/useBonusControl';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';
import CustomConfirmAlert from '../custom/alert/CustomConfirmAlert';
import BonusSlider from '../custom/sliders/BonusSlider';
import CustomLoadingButton from '../custom/buttons/CustomLoadingButton';
import i18n from '@/i18n';

import { useNavigation } from 'expo-router';
import { BG_COLORS } from '@/constants/Colors';


const { width, height } = Dimensions.get('window');

interface OnBoardingProfileProps {
  onLanguageSelect: (language: number) => void;
  onComplete: (user: IUser) => void; // Добавляем функцию для завершения
  onEscape: (user: IUser) => void;
}

const TASK_IDS = {
  userEdit: {
    user_name: 13,
    user_birthDate: 14,
    user_gender: 15,
    user_photo: 16,
    dog_name: 17,
    dog_breed: 18,
    dog_birthDate: 19,
    dog_gender: 20,
    dog_photo: 21,
  },
};

const OnBoardingProfile: React.FC<OnBoardingProfileProps> = ({ onLanguageSelect, onComplete, onEscape }) => {
  const user: User = userStore.currentUser!;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState('');
  const [gender, setGender] = useState(0);
  const [petGender, setPetGender] = useState(0);
  const [petName, setPetName] = useState('');
  const [age, setAge] = useState<Date>(new Date('2000-01-01T12:00:00'));
  const [petAge, setPetAge] = useState<Date>(new Date('2000-01-01T12:00:00'));
  const [interests, setInterests] = useState<number[]>([]);

  const [showUserAge, setShowUserAge] = useState(false);
  const [showPetAge, setShowPetAge] = useState(false);
  const [userImage, setUserImage] = useState('');
  const [petImage, setPetImage] = useState('');
  const [alertEscapeVisible, setAlertEscapeVisible] = useState(false);
  const [petPageBonuses, setPetPageBonuses] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState(0);
  const [key2, setKey2] = useState(randomUUID());

  const carouselRef = useRef(null);

  const source: ImageSourcePropType | undefined = userImage ? { uri: userImage } : undefined;
  const sourcePet: ImageSourcePropType | undefined = petImage ? { uri: petImage } : undefined;
  
  const [selectedAnimalType, setSelectedAnimalType] = useState<number>(0);
  const [selectedBreed, setSelectedBreed] = useState<number>(0);
  
  const sheetRef = useRef<BottomSheet>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [renderContent, setRenderContent] = useState<React.ReactElement | null>(null);
  const [sliderValue, setSliderValue] = useState(0);

  const { completedJobs } = useContext(BonusContex)!;
  const [showUserNameError, setShowUserNameError] = useState(false);
  const [showUserPhotoError, setShowUserPhotoError] = useState(false);
  const [showPetNameError, setShowPetNameError] = useState(false);

  const tagsByAnimalType: Record<number, string[]> = {
    0: i18n.t('tags.breedsDog') as string[], // Пример: ['Bulldog', 'Labrador']
    1: i18n.t('tags.breedsCat') as string[], // Пример: ['Persian', 'Maine Coon']
  };
  const navigation = useNavigation();
  
  const breeds = tagsByAnimalType[selectedAnimalType || 0] || [];
  const maxUserBirthDate = new Date();
  maxUserBirthDate.setFullYear(maxUserBirthDate.getFullYear() - 15);

  useEffect(() => {
    // Отключаем свайп назад (iOS) и кнопку "назад" (Android)
    navigation.setOptions({ gestureEnabled: false });

    const onBackPress = () => {
      // Возвращаем true, чтобы запретить переход назад
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    setName(userStore.currentUser?.name??'')
    return () => {
      subscription.remove();
    };
  }, [navigation]);

  // Используем useControl для каждого поля
  useControl('user_name', interests, {
    id: TASK_IDS.userEdit.user_name,
    description: 'user name',
    name: 'user_name',
  });
  useControl('user_birthDate', age, {
    id: TASK_IDS.userEdit.user_birthDate,
    description: 'user birthDate',
    name: 'user_birthDate',
  });
  useControl('user_gender', gender, {
    id: TASK_IDS.userEdit.user_gender,
    description: 'user gender',
    name: 'user_gender',
  });
  useControl('user_photo', source, {
    id: TASK_IDS.userEdit.user_photo,
    description: 'user photo',
    name: 'user_photo',
  });
  useControl('dog_name', petName, {
    id: TASK_IDS.userEdit.dog_name,
    description: 'dog name',
    name: 'dog_name',
  });
  useControl('dog_breed', selectedBreed, {
    id: TASK_IDS.userEdit.dog_breed,
    description: 'dog breed',
    name: 'dog_breed',
  });
  useControl('dog_birthDate', petAge, {
    id: TASK_IDS.userEdit.dog_birthDate,
    description: 'dog birthDate',
    name: 'dog_birthDate',
  });
  useControl('dog_gender', petGender, {
    id: TASK_IDS.userEdit.dog_gender,
    description: 'dog gender',
    name: 'dog_gender',
  });
  useControl('dog_photo', sourcePet, {
    id: TASK_IDS.userEdit.dog_photo,
    description: 'dog photo',
    name: 'dog_photo',
  });

  const onAgeChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    setShowUserAge(Platform.OS === 'ios');
    if (selectedDate) {
      setAge(selectedDate);
    }
  };

  const onPetAgeChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    setShowPetAge(Platform.OS === 'ios');
    if (selectedDate) setPetAge(selectedDate);

  };

  const showUserDatepicker = () => {
    setShowUserAge(true);
  };

  const showPetDatepicker = () => {
    setShowPetAge(true);
  };

  const handleNext = async () => {
    if (currentIndex < data.length - 1) {
      const nextIndex = currentIndex + 1;

      if (currentIndex < 2) {
        setCurrentIndex(nextIndex);
        (carouselRef.current as any)?.scrollTo({
          index: nextIndex,
          animated: true,
        });
      }

      if (currentIndex === 2) {
        if (!name) {
          setShowUserNameError(true);
        }else{
          setShowUserNameError(false);
        }
        if (!userImage) {
          setShowUserPhotoError(true);
        }else{
          setShowUserPhotoError(false);
        }
        if (!name || !userImage) return;
        setCurrentIndex(nextIndex);
        (carouselRef.current as any)?.scrollTo({
          index: nextIndex,
          animated: true,
        });
        let updatedValue = 200;
        if (name) updatedValue += 100;
        if (userImage) updatedValue += 200;
        setSliderValue(updatedValue);
      }

      if (currentIndex === 3) {
        if (!petName) {
          setShowPetNameError(true);
        }else{
          setShowPetNameError(false);
        }
        if (!petName ) return;
        setCurrentIndex(nextIndex);
        (carouselRef.current as any)?.scrollTo({
          index: nextIndex,
          animated: true,
        });
        let updatedValue = 300;
        if (petName) updatedValue += 100;
        if (petImage) updatedValue += 200;
        setPetPageBonuses(updatedValue);
        setSliderValue(updatedValue + sliderValue);
      }
    }

    if (currentIndex === data.length - 1) {
      setIsLoading(true);
      const currentUser = userStore.currentUser;

      const newPetProfile: Partial<IPet> = {
        id: randomUUID(),
        petName: petName,
        breed: selectedBreed,
        birthDate: petAge,
        gender: petGender,
        userId: currentUser!.id,
        thumbnailUrl: petImage,
        animalType: selectedAnimalType,
      };


      currentUser!.name = name;
      currentUser!.gender = gender;
      currentUser!.birthDate = age;
      currentUser!.interests = interests;
      if (interests.length > 0) setSliderValue(sliderValue + 100);

      if (userImage === '' || userImage === null || userImage === undefined) {
        const newAvatar = SetRandomAvatarDependOnGender();
        await userStore.fetchImageUrl(newAvatar).then((resp) => {
          if (resp) {
            currentUser!.thumbnailUrl = resp;
          }
          currentUser!.petProfiles = [newPetProfile as IPet];
          currentUser!.jobs = completedJobs;
          // Продолжает выполнение onComplete после получения результата
          onComplete(currentUser as IUser);
        });
      } else {
        currentUser!.thumbnailUrl = userImage;
        currentUser!.petProfiles = [newPetProfile as IPet];
        currentUser!.jobs = completedJobs;
        await onComplete(currentUser as IUser);
      }
      setIsLoading(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      (carouselRef.current as any)?.scrollTo({
        index: prevIndex,
        animated: true,
      });
    }
    if (currentIndex === 3) {
      setSliderValue(0);
    }
    if (currentIndex === 4) {
      setSliderValue(sliderValue - petPageBonuses);
    }
  };

  const handleLanguageSelection = (language: number) => {
    onLanguageSelect(language);
    setKey((prevKey) => prevKey + 1);
    setKey2(randomUUID());
 
    handleNext(); // Переключение на следующий слайд после выбора языка
  };

  const SetUserImage = async () => {
    userStore.setUserImage().then((resp) => {
      if (resp) {
        setUserImage(resp);
      }
    });
  };

  const SetRandomAvatarDependOnGender = () => {
    return setUserAvatarDependOnGender(user);
  };

  const SetPetImage = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPetImage(result.assets[0].uri);
    }
  };

  const handleGenderChange = (value: number) => {
    setGender(value);
  };

  const handlePetGenderChange = (value: number) => {
    setPetGender(value);
  };

  const handleSheetClose = () => {
    setIsSheetVisible(false);
    sheetRef.current?.close();
  };

  const handleAvatarSelect = (avatar: number, isMail: boolean) => {
    const userAv = isMail ? avatarsStringM[avatar] : avatarsStringF[avatar];
    userStore.fetchImageUrl(userAv).then((resp) => {
      if (resp) {
        setUserImage(resp);
        sheetRef.current?.close();
      }
    });
  };

  const handleEscape = async () => {
    const currentUser = userStore.currentUser!;
    currentUser.gender = 0;
    if (userImage === '' || userImage === null || userImage === undefined) {
      const newAvatar = SetRandomAvatarDependOnGender();

      const resp = await userStore.fetchImageUrl(newAvatar);
      if (resp) {

        currentUser.thumbnailUrl = resp;
      }
    } else currentUser.thumbnailUrl = userImage;
    //router.replace('/(tabs)/map');
    onEscape(currentUser);
  };

  const handleSheetOpen = () => {
    setIsSheetVisible(true);
    setRenderContent(() => <AvatarSelector onAvatarSelect={handleAvatarSelect} />);
    sheetRef.current?.expand();
  };

  

  const data = [
    {
      id: 1,
      content: (
        <View style={styles.contentContainer}>
          <Image source={require('@/assets/images/onboardingProfile/1lang.webp')} className="h-[55%] w-full " resizeMode="center" />
          <Text className="text-lg font-nunitoSansBold text-center">{i18n.t('onboardingProfile.slide1.title')}</Text>
          <Text className="leading-tight text-md font-nunitoSansRegular text-center">{i18n.t('onboardingProfile.slide1.subtitle')}</Text>

          <CustomButtonOutlined
            title={i18n.t('onboardingProfile.slide1.englishButton')}
            handlePress={() => handleLanguageSelection(2)}
            containerStyles="mt-4 w-full min-h-[42px] z-10"
          />

          <CustomButtonOutlined
            title={i18n.t('onboardingProfile.slide1.spanishButton')}
            handlePress={() => handleLanguageSelection(0)}
            containerStyles="mt-4 w-full min-h-[42px]"
          />
          <CustomButtonOutlined
            title={i18n.t('onboardingProfile.slide1.russianButton')}
            handlePress={() => handleLanguageSelection(1)}
            containerStyles="mt-4 w-full min-h-[42px]"
          />
        </View>
      ),
    },
    {
      id: 2,
      content: (
        <View style={styles.contentContainer}>
          <Image source={require('@/assets/images/onboardingProfile/2start.webp')} className="h-[80%] w-full" resizeMode="contain" />
          <Text className="px-4 leading-tight text-[18px] font-nunitoSansBold text-center mb-1">
            {i18n.t('onboardingProfile.slide2.title')}
          </Text>
          <Text className=" text-md font-nunitoSansRegular text-center">{i18n.t('onboardingProfile.slide2.subtitle')}</Text>
        </View>
      ),
    },
    {
      id: 3,
      content: (
        <View className="items-center w-full h-full justify-center">
          <View className='h-60 w-full items-center justify-center'>
          {source ? (
            <Avatar.Image size={200} source={source} />
          ) : (
            <Image source={require('@/assets/images/onboardingProfile/3user.webp')} className="h-full w-full" resizeMode="contain" />
          )}
          </View>
          <Text className="px-4 leading-tight text-[18px] font-nunitoSansBold text-center my-2">
            {i18n.t('onboardingProfile.slide3.title')}
          </Text>
          <Text className="text-md font-nunitoSansRegular text-center">{i18n.t('onboardingProfile.slide3.subtitle')}</Text>
          <CustomInputText
            value={name}
            handleChange={setName}
            containerStyles="my-4"
            labelInput={i18n.t('onboardingProfile.slide3.nameLabel')}
            allowOnlyLetters={true}
          />
          {showUserNameError && (
            <HelperText className='-mt-4' type="error" visible={showUserNameError}>
              {i18n.t('onboardingProfile.slide3.errorName')}
            </HelperText>
          )}
          <View className="flex-row items-start justify-between">
            <CustomInputText
              labelInput={i18n.t('onboardingProfile.slide3.birthDateLabel')}
              value={age ? age.toLocaleDateString('en-US') : ''}
              handleClick={showUserDatepicker}
              handleChange={showUserDatepicker}
              containerStyles="w-1/2 pr-2 mb-2"
            />

            {/* Modal для DateTimePicker */}
            {showUserAge && Platform.OS === 'ios' && (
              <Modal transparent={true} animationType="slide">
                <View className="flex-1 justify-center bg-black/50">
                  <View className="bg-white mx-5 p-5 rounded-3xl shadow-lg">
                    <DateTimePicker value={age} mode="date" display="spinner" onChange={onAgeChange} textColor='black' maximumDate={maxUserBirthDate} />
                    <Button mode="contained" onPress={() => setShowUserAge(false)} buttonColor={BG_COLORS.indigo[800]}>
                      OK
                    </Button>
                  </View>
                </View>
              </Modal>
            )}

            {/* Для Android обычный вызов DateTimePicker */}
            {showUserAge && Platform.OS === 'android' && (
              <DateTimePicker value={age} mode="date" display="spinner" onChange={onAgeChange} maximumDate={maxUserBirthDate}/>
            )}
            <CustomSegmentedButtons containerStyles="w-[50%] mt-[6px]" value={gender} onValueChange={handleGenderChange} />
          </View>
          <View className="flex-row justify-between">
            <CustomButtonOutlined
              title={i18n.t('onboardingProfile.slide3.uploadPhotoButton')}
              handlePress={SetUserImage}
              containerStyles="mr-1 w-1/2 bg-indigo-800 text-white"
              textStyles="text-white"
              
            />
            <CustomButtonOutlined
              title={i18n.t('onboardingProfile.slide3.chooseAvatarButton')}
              handlePress={handleSheetOpen}
              containerStyles="ml-1 w-1/2"
            />
            
          </View>
          {showUserPhotoError && (
            <HelperText type="error" visible={showUserPhotoError}>
              {i18n.t('onboardingProfile.slide3.errorAvatar')}
            </HelperText>
          )}
        </View>
      ),
    },
    {
      id: 4,
      content: (
        <View className="items-center w-full">
          {sourcePet ? (
            <Avatar.Image size={200} source={sourcePet} />
          ) : (
            <Image source={require('@/assets/images/onboardingProfile/4pet.webp')} className="h-[30%]" resizeMode="contain" />
          )}
          <Text className="px-4 leading-tight text-[18px] font-nunitoSansBold text-center my-2">
            {i18n.t('onboardingProfile.slide4.title')}
          </Text>
          <Text className="text-md font-nunitoSansRegular text-center mb-4">{i18n.t('onboardingProfile.slide4.subtitle')}</Text>

          <CustomInputText
            labelInput={i18n.t('onboardingProfile.slide4.petNameLabel')}
            value={petName}
            handleChange={setPetName}
            containerStyles="-mb-2"
            allowOnlyLetters={true}
          />
          {showPetNameError && (
            <HelperText className='h-6 mt-1 -mb-4' type="error" visible={showPetNameError}>
              {i18n.t('onboardingProfile.slide4.errorName')}
            </HelperText>
          )}
          <View key={key2} className="pt-2">
            <CustomDropdownList
              tags={i18n.t('tags.TypePet') as string[]}
              label={i18n.t('typeOfPet')}
              placeholder={i18n.t('typeOfPet')}
              initialSelectedTag={selectedAnimalType}
              onChange={(v) => {
                setSelectedAnimalType(v as number);
                setKey((prevKey) => prevKey + 1);
              }}
              searchable={true}
              listMode="MODAL"
            />
          </View>
          <View key={key} className="pb-2">
            <CustomDropdownList
              tags={breeds}
              label={i18n.t('onboardingProfile.slide4.breedLabel')}
              placeholder={i18n.t('onboardingProfile.slide4.breedLabel')}
              initialSelectedTag={selectedBreed}
              onChange={(v) => setSelectedBreed(v as number)}
              searchable={true}
              listMode="MODAL"
            />
          </View>
          

          <View className="flex-row items-start ">
            <CustomInputText
              labelInput={i18n.t('onboardingProfile.slide4.birthDateLabel')}
              value={petAge ? petAge.toLocaleDateString('en-US') : ''}
              handleClick={showPetDatepicker}
              handleChange={showPetDatepicker}
              containerStyles="w-[55%] mb-2"
            />
            {/* Modal для DateTimePicker */}
            {showPetAge && Platform.OS === 'ios' && (
              <Modal transparent={true} animationType="slide">
                <View className="flex-1 justify-center bg-black/50">
                  <View className="bg-white mx-5 p-5 rounded-3xl shadow-lg">
                    <DateTimePicker value={petAge} mode="date" display="spinner" onChange={onPetAgeChange} textColor='black' maximumDate={new Date()}/>
                    <Button mode="contained" buttonColor={BG_COLORS.indigo[800]} onPress={() => setShowPetAge(false)}>
                      OK
                    </Button>
                  </View>
                </View>
              </Modal>
            )}

            {showPetAge && Platform.OS === 'android' && (
              <DateTimePicker value={petAge} mode="date" display="spinner" onChange={onPetAgeChange} maximumDate={new Date()}/>
            )}
            <CustomSegmentedButtons
              containerStyles="ml-2 w-[43%] mt-[6px]"
              value={petGender}
              onValueChange={handlePetGenderChange}
              showNAButton={false}
            />
          </View>
          <CustomButtonOutlined
            title={i18n.t('onboardingProfile.slide4.uploadPhotoButton')}
            handlePress={SetPetImage}
            containerStyles="w-full bg-indigo-800"
            textStyles="text-white"
          />
        </View>
      ),
    },
    {
      id: 5,
      content: (
        <View className="items-center w-full h-full justify-start">
          <Text className="text-lg font-nunitoSansBold text-center ">{i18n.t('onboardingProfile.slide5.title')}</Text>
          <Text className=" leading-tight text-md font-nunitoSansRegular text-center">
            {i18n.t('onboardingProfile.slide5.subtitle')}
          </Text>
          <ScrollView>
            <View key={key}>
              <CustomTagsSelector
                tags={i18n.t('tags.interests') as string[]}
                initialSelectedTags={interests || []}
                maxSelectableTags={5}
                onSelectedTagsChange={(tags) => setInterests(tags as number[])}
              />
            </View>
          </ScrollView>
        </View>
      ),
    },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <BonusSlider min={0} max={1200} value={sliderValue} />

        {/* <View style={{ marginRight: 24, alignItems: 'flex-end' }}>
           <TouchableOpacity onPress={() => setAlertEscapeVisible(true)}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              {i18n.t("onboardingProfile.skip")}
            </Text>
          </TouchableOpacity> 
        </View> */}

        {/* Ваш контент-карусель в середине */}
        <FlatList
          data={[{ key: 'carousel' }]}
          renderItem={() => (
            <View style={{ flex: 1 }}>
              <Carousel
                ref={carouselRef}
                width={width}
                height={height *0.90}
                data={data}
                pagingEnabled
                loop={false}
                enabled={false}
                onSnapToItem={(index) => setCurrentIndex(index)}
                renderItem={({ item }) => <View style={styles.carouselItemContainer}>{item.content}</View>}
              />
            </View>
          )}
          keyExtractor={(item) => item.key}
        />

        {/* Нижняя навигация вынесена на один уровень с остальными элементами */}
        <View style={styles.bottomNavigationContainer}>
          <Button onPress={handlePrev} style={styles.navigationButton}>
            <Text className="text-black  font-nunitoSansBold">{currentIndex === 0 ? '' : i18n.t('onboardingProfile.back')}</Text>
          </Button>
          <View style={styles.indicatorContainer}>
            {data.map((_, index) => (
              <View key={index} style={[styles.indicator, currentIndex === index ? styles.activeIndicator : styles.inactiveIndicator]} />
            ))}
          </View>
          <CustomLoadingButton
            title={currentIndex < 4 ? i18n.t('onboardingProfile.next') : i18n.t('onboardingProfile.finish')}
            containerStyles="-mt-0 w-1/3 bg-white"
            textStyles="text-black text-sm font-nunitoSansBold"
            handlePress={handleNext}
           isLoading={isLoading}
          />
        </View>

        {isSheetVisible && (
          <BottomSheetComponent
            ref={sheetRef}
            snapPoints={['60%', '100%']}
            renderContent={renderContent}
            onClose={handleSheetClose}
            enablePanDownToClose
          />
        )}

        <CustomConfirmAlert
          isVisible={alertEscapeVisible}
          onClose={() => setAlertEscapeVisible(false)}
          onConfirm={handleEscape}
          message={i18n.t('onboardingProfile.alertMessage')}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },

  carouselItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bottomNavigationContainer: {
    flexDirection: 'row',
    marginBottom: Platform.OS === 'ios' ? 0 : 24,
    justifyContent: 'space-between',
  },
  navigationButton: {
    width: 130,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#2F00B6',
  },
  inactiveIndicator: {
    backgroundColor: '#D9CBFF',
  },
});

export default OnBoardingProfile;

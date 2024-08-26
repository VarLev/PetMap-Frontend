import React, { ReactNode, useRef, useState } from 'react';
import { View, Dimensions, Platform, StyleSheet, ImageSourcePropType, Image, FlatList } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Button, Text } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import SelectDropdown from 'react-native-select-dropdown';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from '@rneui/themed';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import userStore from '@/stores/UserStore';
import { IPet } from '@/dtos/Interfaces/pet/IPet';
import CustomInputText from '../custom/inputs/CustomInputText';
import * as Crypto from 'expo-crypto';

import { User } from '@/dtos/classes/user/UserDTO';
import CustomSegmentedButtons from '../custom/buttons/CustomSegmentedButtons';
import { router } from 'expo-router';
import BottomSheetComponent from '../common/BottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet';
import AvatarSelector from '../common/AvatarSelector';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { avatarsStringF,avatarsStringM } from '@/constants/Avatars';
import { BREEDS_TAGS } from '@/constants/Strings';


const { width, height } = Dimensions.get('window');

interface OnBoardingProfileProps {
  onLanguageSelect: (language: string) => void;
  onComplete: (user:IUser) => void; // Добавляем функцию для завершения
}

const OnBoardingProfile: React.FC<OnBoardingProfileProps> = ({ onLanguageSelect, onComplete }) => {
  const user: User = userStore.currentUser!;
  const [editableUser, setEditableUser] = useState<User>(new User({ ...user }));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [petGender, setPetGender] = useState('');
  const [petName, setPetName] = useState('');
  const [age, setAge] = useState(new Date(0));
  const [petAge, setPetAge] = useState<Date>(new Date(0));
  
  const [show, setShow] = useState(false);
  const [userImage, setUserImage] = useState('');
  const [petImage, setPetImage] = useState('');
  
  const carouselRef = useRef(null);

  const source: ImageSourcePropType | undefined = userImage ? { uri: userImage } : undefined;
  const sourcePet: ImageSourcePropType | undefined = petImage ? { uri: petImage } : undefined;
  

  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [renderContent, setRenderContent] = useState<ReactNode>(() => null);
  //const [userAvatar, setUserAvatar] = useState<string | null>(null);


  const handleIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const onAgeChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      setAge(selectedDate);
    }
  };

  const onPetAgeChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || petAge;
    setShow(Platform.OS === 'ios');
    setPetAge(currentDate!);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const handleChange = (field: keyof User, value: any) => {
    setEditableUser({ ...editableUser, [field]: value });
  };

  const handleNext = () => {

    if (currentIndex < data.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      (carouselRef.current as any)?.scrollTo({ index: nextIndex, animated: true });
    } 

    if(currentIndex === data.length - 1 ){
      const currentUser = userStore.currentUser;
      
      const newPetProfile: Partial<IPet> = {
        id: Crypto.randomUUID(),
        petName: petName,
        breed: selectedBreed,
        birthDate: petAge,
        gender: petGender,
        userId: currentUser!.id,
        thumbnailUrl: petImage
      };


      currentUser!.name = name;
      currentUser!.gender = gender;
      currentUser!.birthDate = age;
      currentUser!.thumbnailUrl = userImage;
      currentUser!.petProfiles = [newPetProfile as IPet];
        
      onComplete(currentUser as IUser);
    }
  };

  const handleLanguageSelection = (language: string) => {
    onLanguageSelect(language);
    handleNext(); // Переключение на следующий слайд после выбора языка
  };

  const SetUserImage = async () => {
    userStore.setUserImage().then(resp => {
      if(resp){
        setUserImage(resp);
      }
    });
  };

  const SetPetImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPetImage(result.assets[0].uri);
    }
  };


  const handleGenderChange = (value: string) => {
    setGender(value);
  };

  const handlePetGenderChange = (value: string) => {
    setPetGender(value);
  };

  const handleSheetClose = () => {
    setIsSheetVisible(false);
    sheetRef.current?.close();
  };

  const handleAvatarSelect = (avatar: number, isMail:boolean) => {
    const userAv = isMail ? avatarsStringM[avatar] : avatarsStringF[avatar];
    userStore.fetchImageUrl(userAv).then(resp => {
      if(resp){
        setUserImage(resp);
        sheetRef.current?.close();
      }
        
    });
  };


  const handleSheetOpen = () => {
    setIsSheetVisible(true);
    setRenderContent(() => (
      <AvatarSelector onAvatarSelect={handleAvatarSelect} />
    ));
    sheetRef.current?.expand();
  };

 

  

  const data = [
    {
      id: 1,
      content: (
        <View style={styles.contentContainer}>
          <Image source={require('@/assets/images/onboardingProfile/1lang.webp')} className='h-[60%]' resizeMode='center' />
          <Text className='text-lg font-nunitoSansBold text-center'>Добро пожаловать в PetMap!</Text>
          <Text className='text-base font-nunitoSansRegular text-center'>Выберите язык приложения, чтобы мы могли лучше понимать друг друга.</Text>
          
          <CustomButtonOutlined title='Английский' handlePress={() => handleLanguageSelection('Английский')} containerStyles='mt-4 w-full min-h-[45px]' />
          <CustomButtonOutlined title='Испанский' handlePress={() => handleLanguageSelection('Испанский')} containerStyles='mt-4 w-full min-h-[45px]' />
          <CustomButtonOutlined title='Русский' handlePress={() => handleLanguageSelection('Русский')} containerStyles='mt-4 w-full min-h-[45px]' />
      
        </View>
      ),
    },
    {
      id: 2,
      content: (
        <View className='w-full justify-center items-center '>
          <Image source={require('@/assets/images/onboardingProfile/2start.webp')} className='h-[80%]' resizeMode='center' />
          <Text className='pl-4 pr-4 text-lg font-nunitoSansBold text-center'>Начните настройку профиля прямо сейчас</Text>
          <Text className='text-base font-nunitoSansRegular text-center'>И получите первые бонусы, после прохождения регистрации, чтобы обменять их на подарки</Text>
        </View>
      ),
    },
    {
      id: 3,
      content: (
       
        <View className="items-center w-full h-full justify-center">
          {source ? (
            <Avatar
              source={source}
              rounded
              size={200}
              containerStyle={{ backgroundColor: "#BDBDBD", marginTop: 10,   borderColor: 'white', borderWidth: 3,  shadowColor: 'black',  elevation: 4, }}
              icon={{ name: 'user', type: 'font-awesome', color: 'white' }}
            />
          ) : (
            <Image source={require('@/assets/images/onboardingProfile/3user.webp')} className='h-[40%]' resizeMode='center' />
          )}
          <Text className="pl-4 pr-4 text-lg font-nunitoSansBold text-center">Расскажите немного о себе</Text>
          <Text className="text-base font-nunitoSansRegular text-center">Ваш профиль будет отображаться другим пользователям с питомцами.</Text>
          <CustomInputText placeholder='Как тебя зовут?' value={name} handleChange={setName} containerStyles='mb-2 mt-4' />
          
          <View className='flex-row items-start justify-between'>
            <CustomInputText placeholder='Дата рождения' value={age ? age.toLocaleDateString('en-US') : ''} handleChange={showDatepicker} containerStyles='w-1/2 pr-2 mb-2' />
            {show && (
              <DateTimePicker
                value={age || new Date()}
                mode="date"
                display="spinner"
                onChange={onAgeChange}
              />
            )}
            
            <CustomSegmentedButtons containerStyles='w-[50%]' value={gender} onValueChange={handleGenderChange}/>

          </View>

          <View className='flex-row justify-between'>
            <CustomButtonOutlined title='Выбрать фото' handlePress={SetUserImage} containerStyles='mr-1 w-1/2 bg-indigo-700 text-white' textStyles = 'text-white' />
            <CustomButtonOutlined title='Выбрать аватар' handlePress={handleSheetOpen} containerStyles='ml-1 w-1/2' />
          </View>
          

        </View>
      ),
    },
    {
      id: 4,
      content: (
        <View className="items-center w-full h-full justify-center">
          {sourcePet ? (<Avatar 
            source={sourcePet}
            rounded size={200} 
            containerStyle={{ backgroundColor: "#BDBDBD", marginTop: 20,    borderColor: 'white', borderWidth: 3,  shadowColor: 'black',  elevation: 4 }} 
            icon={{ name: 'dog', type: 'font-awesome-5', color: 'white' }}
          />
          ) : <Image source={require('@/assets/images/onboardingProfile/4pet.webp')} className='h-[40%]' resizeMode='center' />}
          <Text className="pl-4 pr-4 text-lg font-nunitoSansBold text-center">Настройте профиль своего питомца</Text>
          <Text className="text-base font-nunitoSansRegular text-center mb-4">Профиль питомца будет доступен другим пользователям при отклике на прогулку.</Text>
          <View className='flex-row'>
            <SelectDropdown 
              data={BREEDS_TAGS}
              onSelect={(selectedItem, index) => {
                setSelectedBreed(selectedItem);
              }}
              showsVerticalScrollIndicator={true}
              renderButton={(selectedItem, isOpened) => (
                <View style={styles.dropdownButton}>
                  {selectedItem ? (
                    <Text className='text-base font-nunitoSansRegular text-center'>{selectedItem}</Text>
                  ) : (
                    <Text className='text-base font-nunitoSansRegular text-center'>Порода</Text>
                  )}
                </View>
              )}
              searchPlaceHolder='Поиск...'
              renderItem={(item, index, isSelected) => (
                <View style={[styles.dropdownItem, isSelected && { backgroundColor: '#D2D9DF' }]}>
                  <Text className='text-base font-nunitoSansRegular'>{item}</Text>
                </View>
              )}
              dropdownStyle={styles.dropdown}
              search={true}
            />
              <CustomInputText placeholder='Имя' value={petName} handleChange={setPetName}  containerStyles='mb-2 w-[45%] pl-2' />
          </View>
        
          <View className='flex-row items-start '>
            <CustomInputText 
              placeholder='Дата рождения' 
              value={petAge ? petAge.toLocaleDateString('en-US') : ''}
              handleChange={showDatepicker} 
              containerStyles='w-[55%]  mb-2' 
            />
            {show && (
              <DateTimePicker
                value={petAge || new Date()}
                mode="date"
                display="spinner"
                onChange={onPetAgeChange}
              />
            )}
            
            <CustomSegmentedButtons containerStyles='ml-2 w-[43%]' value={petGender} onValueChange={handlePetGenderChange} showNAButton={false} />

          </View>
          <CustomButtonOutlined title='Добавь фотографию' handlePress={SetPetImage} containerStyles='w-full ' />
          
        </View>
      ),
    },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlatList
        data={[{ key: 'carousel' }]}
        renderItem={() => (
          <View style={styles.container}>
            <Carousel
              ref={carouselRef}
              width={width}
              height={height - 100}
              data={data}
              pagingEnabled={true}
              loop={false}
              onProgressChange={(_, absoluteProgress) => {
                handleIndex(Math.round(absoluteProgress));
              }}
              onSnapToItem={(index) => setCurrentIndex(index)}
              renderItem={({ item }) => (
                <View style={styles.carouselItemContainer}>
                  {item.content}
                </View>
              )}
            />
            <View style={styles.bottomNavigationContainer}>
              <Button onPress={() => { router.replace('/map'); }} style={styles.navigationButton}>Пропустить</Button>
              <View style={styles.indicatorContainer}>
                {data.map((_, index) => (
                  <View
                    key={index}
                    style={[styles.indicator, currentIndex === index ? styles.activeIndicator : styles.inactiveIndicator]}
                  />
                ))}
              </View>
              <Button onPress={handleNext} style={styles.navigationButton}>
                {currentIndex === data.length - 1 ? 'Завершить' : 'Далее'}
              </Button>
            </View>
            
          </View>
        )}
        keyExtractor={(item) => item.key}
      />
      {isSheetVisible && (   
              <BottomSheetComponent
                ref={sheetRef}
                snapPoints={['60%','100%']}
                renderContent={() => renderContent}
                onClose={handleSheetClose}
                enablePanDownToClose={true}
              />
            )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: 'white',
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 50,
    
    elevation: 2,
    fontSize: 18,
    marginBottom: 20,
  },
  dropdownContainer: {
    width: '100%',
    marginTop: 10,
  },
  dropdownButton: {
    width: '55%',
    height: 45,
    backgroundColor: '#FFF',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'lightgray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingRight:5
   
  },
  dropdownButtonText: {
    color: '#111827',
    opacity: 0.7,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginTop: -20,
    height: 230,
  },
  dropdownItem: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#444',
  },
  carouselItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bottomNavigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
    paddingHorizontal: 20,
  },
  navigationButton: {
    width: 100,
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
    backgroundColor: 'black',
  },
  inactiveIndicator: {
    backgroundColor: 'gray',
  },
});

export default OnBoardingProfile;

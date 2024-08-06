import React, { useRef, useState } from 'react';
import { View, Dimensions, TextInput, Platform, StyleSheet, ImageSourcePropType, Image, ScrollView } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Button, Text, TextInput as TextInputPaper } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import CustomButtonPrimary from '../custom/buttons/CustomButtonPrimary';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import SelectDropdown from 'react-native-select-dropdown';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from '@rneui/themed';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import userStore from '@/stores/UserStore';
import { IPet } from '@/dtos/Interfaces/pet/IPet';
import CustomInputText from '../custom/inputs/CustomInputText';
import CustomInputTextTypeAndIcon from '../custom/inputs/CustomInputTextTypeAndIcon';


const { width, height } = Dimensions.get('window');

interface OnBoardingProfileProps {
  onLanguageSelect: (language: string) => void;
  onComplete: (user:IUser) => void; // Добавляем функцию для завершения
}

const OnBoardingProfile: React.FC<OnBoardingProfileProps> = ({ onLanguageSelect, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState('');
  const [petName, setPetName] = useState('');
  const [age, setAge] = useState(new Date(0));
  const [petAge, setPetAge] = useState(new Date(0));
  
  const [show, setShow] = useState(false);
  const [userImage, setUserImage] = useState('');
  const [petImage, setPetImage] = useState('');
  
  const carouselRef = useRef(null);

  const source: ImageSourcePropType | undefined = userImage ? { uri: userImage } : undefined;
  const sourcePet: ImageSourcePropType | undefined = petImage ? { uri: petImage } : undefined;


  const breeds = ["Шарней", "Лабрадор", "Лайка", "Хаски"];
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);

  const handleIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const onAgeChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || age;
    setShow(Platform.OS === 'ios');
    setAge(currentDate);
  };

  const onPetAgeChange = (selectedDate?: string | undefined) => {
    const currentDate = petAge;
    setShow(Platform.OS === 'ios');
    setPetAge(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
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
        petName: petName,
        breed: selectedBreed,
        birthDate: petAge,
        userId: currentUser!.id,
        thumbnailUrl: petImage
      };
      console.log('UserID', currentUser!.id);

      currentUser!.name = name;
      currentUser!.birthDate = age;
      currentUser!.thumbnailUrl = userImage;
      currentUser?.petProfiles?.push(newPetProfile as IPet);
        
      onComplete(currentUser as IUser);
    }
  };

  const handleLanguageSelection = (language: string) => {
    onLanguageSelect(language);
    handleNext(); // Переключение на следующий слайд после выбора языка
  };

  const SetUserImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUserImage(result.assets[0].uri);
    }
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

  const [date, setDate] = useState('');

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
          <Image source={require('@/assets/images/onboardingProfile/3user.webp')} className='h-[40%]' resizeMode='center' />
          <Text className="pl-4 pr-4 text-lg font-nunitoSansBold text-center">Расскажите немного о себе</Text>
          <Text className="text-base font-nunitoSansRegular text-center">Ваш профиль будет отображаться другим пользователям с питомцами.</Text>
          {/* <TextInput
            placeholder="Как тебя зовут?"
            value={name}
            onChangeText={setName}
            className="bg-white w-full p-3 border border-gray-300 rounded-full shadow shadow-black font-psemi text-lg"
          /> */}
          <TextInputPaper
            mode='outlined'
            label="Как тебя зовут?"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            className='mt-4 mb-2 w-full'
          />
          <TextInputPaper
            mode='outlined'
            label="Дата рождения"
            value={ age.toLocaleDateString('en-US')}
            onChangeText={showDatepicker}
            autoCapitalize="words"
            className='mb-2 w-full'
          />
          
          {show && (
            <DateTimePicker
              value={age}
              mode="date"
              display="spinner"
              onChange={onAgeChange}
            />
          )}
          <CustomButtonOutlined title='Добавь фотографию' handlePress={SetUserImage} containerStyles='w-full' />
          
          {/* <Avatar 
          source={source}
          rounded size={200} 
          containerStyle={{ backgroundColor: "#BDBDBD", marginTop: 20,   borderColor: 'white', borderWidth: 10,  shadowColor: 'black',  elevation: 4, }} 
          icon={{ name: 'user', type: 'font-awesome', color: 'white' }}
          >
            <Avatar.Accessory size={30}  onPress={SetUserImage} />
          </Avatar> */}
         
          
        </View>
      ),
    },
    {
      id: 4,
      content: (
        <View className="items-center w-full h-full justify-center">
          <Image source={require('@/assets/images/onboardingProfile/4pet.webp')} className='h-[40%]' resizeMode='center' />
          <Text className="pl-4 pr-4 text-lg font-nunitoSansBold text-center">Настройте профиль своего питомца</Text>
          <Text className="text-base font-nunitoSansRegular text-center mb-4">Профиль питомца будет доступен другим пользователям при отклике на прогулку.</Text>
          
          <CustomInputText placeholder='Имя' value={petName} handleChange={setPetName} />
         
          <View className='w-full mt-2'>
            <SelectDropdown 
              data={breeds}
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
          </View>
          <CustomInputTextTypeAndIcon value={petAge.toLocaleDateString('en-US')} handleChange={onPetAgeChange} iconName="date-range" formatType="date"  placeholder="MM/DD/YYYY" />
          {/* <TextInputPaper
            mode='outlined'
            label="Дата рождения"
            value={ petAge.toLocaleDateString('en-US') }
            onChangeText={showDatepicker}
            className='mb-2 mt-3 w-full'
          /> */}
          {/* {show && (
            <DateTimePicker
              value={petAge}
              mode="date"
              display="spinner"
              onChange={onPetAgeChange}
            />
          )} */}
          <CustomButtonOutlined title='Добавь фотографию' handlePress={SetPetImage} containerStyles='w-full ' />
          {/* <Avatar 
          source={sourcePet}
          rounded size={200} 
          containerStyle={{ backgroundColor: "#BDBDBD", marginTop: 20,   borderColor: 'white', borderWidth: 10,  shadowColor: 'black',  elevation: 4, }} 
          icon={{ name: 'dog', type: 'font-awesome-5', color: 'white' }}
          >
            <Avatar.Accessory size={30}  onPress={SetPetImage} />
          </Avatar> */}
        </View>
      ),
    },
  ];

  return (
    <ScrollView  style={styles.container}>
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
        <Button onPress={() => { }} style={styles.navigationButton}>Пропустить</Button>
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
    </ScrollView>
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
    width: '100%',
    height: 55,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'lightgray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
   
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

import React, { useRef, useState } from 'react';
import { View, Dimensions, TextInput, Platform, StyleSheet, ImageSourcePropType } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Button, Text } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import CustomButtonPrimary from '../customButtons/CustomButtonPrimary';
import CustomButtonOutlined from '../customButtons/CustomButtonOutlined';
import SelectDropdown from 'react-native-select-dropdown';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from '@rneui/themed';


const { width, height } = Dimensions.get('window');

interface OnBoardingProfileProps {
  onLanguageSelect: (language: string) => void;
  onUserInfoSubmit: (name: string, birthDate: Date) => void;
  onPetInfoSubmit: (petName: string, breed: string | null, petBirthDate: Date) => void;
  onComplete: () => void; // Добавляем функцию для завершения
}

const OnBoardingProfile: React.FC<OnBoardingProfileProps> = ({ onLanguageSelect, onUserInfoSubmit, onPetInfoSubmit, onComplete }) => {
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

  const onPetAgeChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || petAge;
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
    } else {
      if (currentIndex === 1) {
        onUserInfoSubmit(name, age);
      } else if (currentIndex === 2) {
        onPetInfoSubmit(petName, selectedBreed, petAge);
      }
      onComplete();
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

  
  

  const data = [
    {
      id: 1,
      content: (
        <View style={styles.contentContainer}>
          <Text variant='titleMedium' style={styles.titleText}>Привет!{'\n'}На каком языке ты говоришь?</Text>
          <CustomButtonPrimary title='Английский' handlePress={() => handleLanguageSelection('Английский')} containerStyles='w-4/5' />
          <CustomButtonPrimary title='Испанский' handlePress={() => handleLanguageSelection('Испанский')} containerStyles='w-4/5' />
          <CustomButtonPrimary title='Русский' handlePress={() => handleLanguageSelection('Русский')} containerStyles='w-4/5' />
        </View>
      ),
    },
    {
      id: 2,
      content: (
        <View className='w-full justify-center items-center '>
          <Text variant='titleMedium' className='text-3xl mb-5'>Расскажи нам о себе!</Text>
          <Text variant='titleMedium' className='text-lg text-justify'>За каждый ответ мы дадим тебе косточки, которые ты потом сможешь обменять на очень ценные подарки.</Text>
        </View>
      ),
    },
    {
      id: 3,
      content: (
        <View className="items-center w-full h-full justify-center">
          <Text variant='titleMedium'  className="text-2xl mb-5">Расскажи нам о себе</Text>
          <TextInput
            placeholder="Как тебя зовут?"
            value={name}
            onChangeText={setName}
            className="bg-white w-full p-3 border border-gray-300 rounded-full shadow shadow-black font-psemi text-lg"
          />
          <CustomButtonOutlined
            title={age > new Date(0) ? age.toLocaleDateString('en-US') : 'Дата рождения?'}
            handlePress={showDatepicker}
            containerStyles='w-full p-1 border'
            textStyles='text-gray-500 w-full pl-1'
          />
          {show && (
            <DateTimePicker
              value={age}
              mode="date"
              display="spinner"
              onChange={onAgeChange}
            />
          )}
          <CustomButtonPrimary title='Добавь фотографию' handlePress={SetUserImage} containerStyles='w-full' />
          
          <Avatar 
          source={source}
          rounded size={200} 
          containerStyle={{ backgroundColor: "#BDBDBD", marginTop: 20,   borderColor: 'white', borderWidth: 10,  shadowColor: 'black',  elevation: 4, }} 
          icon={{ name: 'user', type: 'font-awesome', color: 'white' }}
          >
            <Avatar.Accessory size={30}  onPress={SetUserImage} />
          </Avatar>
         
          
        </View>
      ),
    },
    {
      id: 4,
      content: (
        <View className="items-center w-full h-full justify-center">
          <Text variant='titleMedium'  className="text-2xl mb-5 text-center">Расскажи нам о своем питомце</Text>
          <TextInput
            placeholder="Как его зовут?"
            value={petName}
            onChangeText={setPetName}
             className="bg-white w-full p-3 border border-gray-300 rounded-full shadow shadow-black font-psemi text-lg"
          />
          <View style={styles.dropdownContainer}>
            <SelectDropdown
              data={breeds}
              onSelect={(selectedItem, index) => {
                setSelectedBreed(selectedItem);
              }}
              showsVerticalScrollIndicator={true}
              renderButton={(selectedItem, isOpened) => (
                <View style={styles.dropdownButton}>
                  {selectedItem ? (
                    <Text style={styles.dropdownButtonText}>{selectedItem}</Text>
                  ) : (
                    <Text style={styles.dropdownButtonText}>Выбери породу</Text>
                  )}
                </View>
              )}
              searchPlaceHolder='Поиск...'
              renderItem={(item, index, isSelected) => (
                <View style={[styles.dropdownItem, isSelected && { backgroundColor: '#D2D9DF' }]}>
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </View>
              )}
              dropdownStyle={styles.dropdown}
              search={true}
            />
          </View>
          <CustomButtonOutlined
            title={petAge > new Date(0) ? petAge.toLocaleDateString('en-US') : 'Дата рождения?'}
            handlePress={showDatepicker}
            containerStyles='items-start w-full p-1 border'
            textStyles='text-gray-500 w-full pl-1'
          />
          {show && (
            <DateTimePicker
              value={petAge}
              mode="date"
              display="spinner"
              onChange={onPetAgeChange}
            />
          )}
          <CustomButtonPrimary title='Добавь фотографию' handlePress={SetPetImage} containerStyles='w-full ' />
          <Avatar 
          source={sourcePet}
          rounded size={200} 
          containerStyle={{ backgroundColor: "#BDBDBD", marginTop: 20,   borderColor: 'white', borderWidth: 10,  shadowColor: 'black',  elevation: 4, }} 
          icon={{ name: 'dog', type: 'font-awesome-5', color: 'white' }}
          >
            <Avatar.Accessory size={30}  onPress={SetPetImage} />
          </Avatar>
        </View>
      ),
    },
  ];

  return (
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
    </View>
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
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
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
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'lightgray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 4,
    elevation: 5,
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

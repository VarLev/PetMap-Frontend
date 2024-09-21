import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Text, Alert } from 'react-native';
import { Button, Surface, Checkbox, TouchableRipple, Switch } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import mapStore from '@/stores/MapStore';
import { IWalkAdvrtDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtDto';
import CustomOutlineInputText from '../custom/inputs/CustomOutlineInputText';
import { calculateDogAge } from '@/utils/utils';
import { petUriImage } from '@/constants/Strings';
import CustomDropdownList from '../custom/selectors/CustomDropdownList';
import Modal from "react-native-modal";
import { WalkAdvrtStatus } from '@/dtos/enum/WalkAdvrtStatus';
import { AdvrtType } from '@/dtos/enum/AdvrtType';

interface AdvtEditProps {
  coordinates: [number, number];
  onAdvrtAddedInvite: () => void
}

const AdvtEditComponent: React.FC<AdvtEditProps> = observer(({coordinates, onAdvrtAddedInvite}) => {
  const [name, setName] = useState(userStore.currentUser?.name || '');
  const [avatar, setAvatar] = useState(userStore.currentUser?.thumbnailUrl || '');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState(userStore.currentUser?.gender || '');
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [time, setTime] = useState<Date>(new Date());
  const [duration, setDuration] = useState<number>(60);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [address, setAddress] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [inputTime, setInputTime] = useState(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [inputDuration, setInputDuration] = useState(duration.toString());
  const [isSwitchOn, setIsSwitchOn] = useState(true);

  useEffect(() => {
    // Загрузите пользователя, если он еще не загружен
    if (!userStore.currentUser) {
      userStore.loadUser();
    }
  }, []);

  useEffect(() => {
    if (userStore.currentUser) {
      setName(userStore.currentUser.name || '');
      setAvatar(userStore.currentUser.thumbnailUrl || '');
      setDescription('');
      setGender(userStore.currentUser.gender || '');
      setSelectedPets(userStore.currentUser.petProfiles?.map(pet => pet.id) || []);
    }
  }, [userStore.currentUser]);

  useEffect(() => {
    // Получаем адрес по координатам и устанавливаем его в поле address
    mapStore.getStringAddressFromCoordinate(coordinates)
      .then(() => {
        setAddress(mapStore.advrtAddress); // Устанавливаем адрес из mapStore
      })
      .catch(error => {
        console.error('Error fetching address:', error);
        setAddress('Не удалось получить адрес');
      });
  }, [coordinates]);

  const handleSave = async () => {
    if (selectedPets.length === 0) {
      Alert.alert("", "Выберите хотя бы одного питомца для участия в прогулке.");
      return; // Прекращаем выполнение функции, если питомцы не выбраны
    }
    
    if(!mapStore.isAvaliableToCreateWalk){
      Alert.alert("", "В этом месте нельзя создать прогулку.");
      return; // Прекращаем выполнение функции, если питомцы не выбраны
    }

    const updatedUserWalk :IWalkAdvrtDto = {
      id: undefined,
      isEnabled: true,
      createdAt: new Date(),
      date: new Date(),
      latitude: coordinates[1],
      longitude: coordinates[0],
      participants: [],
      address: address,
      userId: userStore.currentUser?.id || '',
      description: description,
      status: WalkAdvrtStatus.Active,
      type: AdvrtType.Single,
      userPhoto: userStore.currentUser?.thumbnailUrl || '',
      userName: userStore.currentUser?.name || '',
      userPets: userStore.currentUser?.petProfiles || []
    };

    await mapStore.addWalkAdvrt(updatedUserWalk);
    
    onAdvrtAddedInvite();
  };

  const togglePetSelection = (petId: string) => {
    setSelectedPets(prevSelectedPets => 
      prevSelectedPets.includes(petId) 
        ? prevSelectedPets.filter(id => id !== petId) 
        : [...prevSelectedPets, petId]
    );
  };

  const getGenderIcon = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male':
        return 'man';
      case 'female':
        return 'woman';
      default:
        return 'person';
    }
  };

  const validateTimeInput = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      return true;
    }
    return false;
  };


  
  const onModalSave = () => {
    if (!validateTimeInput(inputTime)) {
      Alert.alert("Ошибка", "Введите корректное время (формат 00:00, часы 0-23, минуты 0-59).");
      return;
    }
    if(Number(inputDuration) < 15 || Number(inputDuration) > 360){
      Alert.alert("Ошибка", "Продолжительность прогулки должна быть от 15 до 360 минут.");
      return;
    }

    const [hours, minutes] = inputTime.split(':').map(Number);
    const newTime = new Date();
    newTime.setHours(hours, minutes);
    setTime(newTime);

    setDuration(Number(inputDuration));
    setShowModal(false);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-2">
      
      <View className="h-full bg-white rounded-lg p-2">
        <View className="flex-row">
          <Image source={{ uri: avatar || 'https://via.placeholder.com/100' }} className="w-28 h-28 rounded-lg" />
          <View className="flex-col ml-2">
            <Text className="ml-1 text-2xl font-nunitoSansBold">{name}</Text> 
            <TouchableRipple onPress={() => setShowModal(true)} >
              <View className='mt-2 items-start'>
                <View className="flex-row items-center ">
                  <Ionicons name="time-outline" size={18} color="indigo" /> 
                  <Text className="text-lg font-nunitoSansRegular"> {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text> 
                  <Text className="ml-2 text-lg font-nunitoSansRegular">60 мин.</Text> 
                </View>
                <Text className='-mt-2 ml-6 text-sm text-violet-600 font-nunitoSansBold'>Изменить</Text>
              </View>
            </TouchableRipple>
            
            <View className="mt-1 -ml-1 flex-row items-center">
              {/* <CustomDropdownList
                tags={['15 min','30 min','40 min','60 min','90 min','120 min','360 min']}
                placeholder=""
                onChange={(text) => onDurationSet(text)}
                
              /> */}
              <Switch  value={isSwitchOn} onValueChange={setIsSwitchOn}  />
              <Text className='text-base font-nunitoSansRegular'>{isSwitchOn? 'Регулярная прогулка': 'Разовая прогулка'}</Text>
              
            </View>
            {/* {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}    */}
          </View>
        </View>
        <View className="mt-2 justify-start w-full ">
        
          <CustomOutlineInputText label='Адрес' value={address} handleChange={setAddress} /> 
          <View className='pt-2'/> 
          <CustomOutlineInputText label='Описание' value={description} handleChange={setDescription} numberOfLines={3} />  
        </View>
          {userStore.currentUser?.petProfiles?.map((pet,index) => (
              <Surface key={index}  elevation={0} className=" mt-4 bg-purple-100  rounded-lg">
                <TouchableRipple  rippleColor="#c9b2d9" onPress={() => togglePetSelection(pet.id)}>
                <View  className="-ml-2 p-1 flex-row items-center">
                  <Checkbox
                    status={selectedPets.includes(pet.id) ? 'checked' : 'unchecked'}
                    onPress={() => togglePetSelection(pet.id)}
                  />
                  <Image source={{ uri: pet.thumbnailUrl || petUriImage}} width={60} height={60} className="rounded-lg" />
                  <View className='flex-col'>
                    <View className='flex-row items-center ml-3'>
                      <Ionicons name="male" size={18} color="indigo" />
                      <Text className="ml-2 text-xl font-nunitoSansBold">{pet.petName},</Text>
                      <Text className="ml-2 text-base font-nunitoSansRegular">{calculateDogAge(pet.birthDate)} {pet.breed}</Text>
                    </View>
                  </View>
                </View>
                </TouchableRipple>
              </Surface>
          ))}  
        <View className='h-20'>
          <Button mode="contained" className="mt-4 " onPress={handleSave}>
            Разместить на карте
          </Button>
        </View>
      </View>
      <Modal isVisible={showModal} className="items-center">
        <View className="pt-2 h-36 w-80 bg-white rounded-2xl items-center">
          <DateTimePicker value={time} mode="time" display="default" onChange={(event, selectedTime) => {} } />
          <View className="flex-row">
            <CustomOutlineInputText
              label="Начало"
              value={inputTime}
              handleChange={setInputTime}
              mask="99:99"
              keyboardType="numeric"
              containerStyles="w-32 m-3"
            />
            <CustomOutlineInputText
              label="Продолжительность (мин)"
              value={inputDuration}
              handleChange={setInputDuration}
              keyboardType="numeric"
              containerStyles="w-32 m-3"
            />
          </View>
          <View className="flex-row items-center space-x-5">
            <Button onPress={onModalSave}>
              <Text className="font-nunitoSansBold">OK</Text>
            </Button>
            <Button onPress={() => setShowModal(false)}>
              <Text className="font-nunitoSansBold">Cancel</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
});

export default AdvtEditComponent;

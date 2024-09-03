import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Text, Alert } from 'react-native';
import { Button, Surface, Checkbox, TouchableRipple } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import mapStore from '@/stores/MapStore';
import { IWalkAdvrtDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtDto';
import CustomOutlineInputText from '../custom/inputs/CustomOutlineInputText';
import { calculateDogAge } from '@/utils/utils';

interface AdvtEditProps {
  coordinates: [number, number];
  onAdvrtAddedInvite: () => void
}

const AdvtEditComponent: React.FC<AdvtEditProps> = observer(({coordinates, onAdvrtAddedInvite}) => {
  const [name, setName] = useState(userStore.currentUser?.name || '');
  const [avatar, setAvatar] = useState(userStore.currentUser?.thumbnailUrl || '');
  const [description, setDescription] = useState(userStore.currentUser?.description || '');
  const [gender, setGender] = useState(userStore.currentUser?.gender || '');
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [time, setTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [address, setAddress] = useState('');

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
      setDescription(userStore.currentUser.description || '');
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

    const updatedUserWalk :IWalkAdvrtDto = {
      id: undefined,
      isEnabled: true,
      createdAt: new Date(),
      date: new Date(),
      latitude: coordinates[0],
      longitude: coordinates[1],
      participants: [],
      address: address,
      participantsPetId: selectedPets,
      userId: userStore.currentUser?.id || '',
      description: description,
      petId: undefined,
      status: 'active',
      type: 'walk',
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

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-2">
      <View className="h-full bg-white rounded-lg p-2">
        <View className="flex-row">
          <Image source={{ uri: avatar || 'https://via.placeholder.com/100' }} className="w-28 h-28 rounded-lg" />
          <View className="flex-col ml-2">
            <Text className="ml-1 text-2xl font-nunitoSansBold">{name}</Text> 
            <View className="flex-row items-center -mt-1 ">
              <Ionicons name="time-outline" size={18} color="indigo" />
              
              <Text className="text-base ml-1 font-nunitoSansRegular">начало {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text> 
              <Button onPress={() => setShowTimePicker(true)} className='font-nunitoSansRegular'>
                <Text className='font-nunitoSansRegular'>Изменить</Text>
              </Button>
            </View>
            <View className="flex-row items-center -mt-3">
              <Ionicons name="time-outline" size={18} color="indigo" />
              <Text className="text-base ml-1 font-nunitoSansRegular">конец {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text> 
              <Button onPress={() => setShowTimePicker(true)} className='font-nunitoSansRegular'>
                <Text className='font-nunitoSansRegular'>Изменить</Text>
              </Button>
            </View>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}
            
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
                  <Image source={{ uri: pet.thumbnailUrl || 'https://via.placeholder.com/100'}} width={60} height={60} className="rounded-lg" />
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
    </ScrollView>
  );
});

export default AdvtEditComponent;

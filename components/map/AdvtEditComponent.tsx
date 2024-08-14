import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Text } from 'react-native';
import { TextInput, Button, Surface, Checkbox, TouchableRipple } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import mapStore from '@/stores/MapStore';
import { IWalkAdvrtDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtDto';


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

  const handleSave = async () => {
    const updatedUser :IWalkAdvrtDto = {
      id: undefined,
      isEnabled: true,
      createdAt: new Date(),
      date: new Date(),
      latitude: coordinates[0],
      longitude: coordinates[1],
      participants: [],
      address: address,
      participantsPetId: [],
      userId: userStore.currentUser?.id || '',
      description: description,
      petId: undefined,
      status: 'active',
      type: 'walk',
      userPhoto: userStore.currentUser?.thumbnailUrl || '',
      userName: userStore.currentUser?.name || '',
      userPets: userStore.currentUser?.petProfiles || []
    };

    await mapStore.addWalkAdvrt(updatedUser);
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 p-2 bg-gray-200">
      <View className="h-full bg-white rounded-lg p-2">
        <View className="flex-row">
          <Image source={{ uri: avatar || 'https://via.placeholder.com/100' }} className="w-28 h-28 rounded-lg" />
          <View className="flex-col ml-2">
            <View className="flex-row items-center">
              <Ionicons name={getGenderIcon(gender)} size={18} color="indigo"  />
              <Text className="ml-1 text-2xl font-nunitoSansBold">{name}</Text>
            </View>
            <View className="flex-row items-center -mt-1 ">
              <Ionicons name="time" size={18} color="indigo" />
              <Text className="text-xl ml-1 font-nunitoSansRegular">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              <Button onPress={() => setShowTimePicker(true)} className='font-nunitoSansRegular'>Изменить</Button>
            </View>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}
            <View className="flex-row items-center justify-start w-full -mt-1">
             
              <TextInput textColor='black' 
                placeholder="Адрес"
                className='ml-3 text-base  w-4/5 font-nunitoSansRegular  bg-white' 
                multiline
                value={address}
                onChangeText={setAddress}
                numberOfLines={address?.length > 20 ? 2 : 1}
                maxLength={50}
                contentStyle={{ marginTop:-15, marginLeft: -8, fontFamily: 'nunitoSansRegular' }}
              />
            </View>
          </View>
        </View>
        
        <TextInput
          placeholder='Описание'
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={description.length > 50 ? 4 : 1}
          textColor='black'
          contentStyle={{fontFamily: 'nunitoSansRegular', justifyContent: 'space-between'}}
          className="mt-2 text-justify text-base bg-white border-white text-gray-600"
        />
       
          {userStore.currentUser?.petProfiles?.map((pet,index) => (
            
              <Surface key={index}  elevation={1} className=" mt-4   bg-gray-100 rounded-lg">
                <TouchableRipple  rippleColor="#c9b2d9" onPress={() => togglePetSelection(pet.id)}>
                <View  className="-ml-2 p-1 flex-row items-center">
                  <Checkbox
                    status={selectedPets.includes(pet.id) ? 'checked' : 'unchecked'}
                    onPress={() => togglePetSelection(pet.id)}
                  />
                  <Image source={{ uri: pet.thumbnailUrl || 'https://via.placeholder.com/100'}} width={60} height={60} className=" rounded-lg" />
                  <View className='flex-col'>
                    <View className='flex-row items-center ml-3'>
                      <Ionicons name="male" size={18} color="indigo" />
                      <Text className="ml-2 text-xl font-nunitoSansBold">{pet.petName},</Text>
                      <Text className="ml-2 text-lg font-nunitoSansRegular">3г {pet.breed}</Text>
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

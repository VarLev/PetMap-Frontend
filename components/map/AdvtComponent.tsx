import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Button, Divider, Surface, TouchableRipple } from 'react-native-paper';
 // Обновите путь к вашему User классу
import { IWalkAdvrtDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtDto';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import userStore from '@/stores/UserStore';
import { User } from '@/dtos/classes/user/UserDTO';
import { IUser } from '@/dtos/Interfaces/user/IUser';

interface AdvtProps {
  advrt: IWalkAdvrtDto;
  onInvite: (uid:IUser) => void
}

const AdvtComponent: React.FC<AdvtProps> = ({ advrt, onInvite}) => {
  const pets = advrt.userPets; // Берем первого питомца из списка

  const handleInvite = () => {
    var user = new User();
    user.id = advrt.userId!;
    user.name = advrt.userName!;
    user.thumbnailUrl = advrt.userPhoto?? 'https://via.placeholder.com/100';
    onInvite(user);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 p-2 bg-gray-200">
      <View className="h-full bg-white rounded-lg p-2">
        <View className="flex-row">
          <Image source={{ uri: advrt?.userPhoto|| 'https://via.placeholder.com/100' }} className="w-28 h-28 rounded-lg" />
          <View className="flex-col ml-4">
            <Text className="text-2xl font-bold">{advrt.userName|| 'Owner'}</Text>
            <View className="flex-row items-center mt-2">
              <FontAwesome5 name="calendar-alt" size={20} color="indigo" />
              <Text className="ml-2 text-base">{advrt?.date ? 'Время' : advrt.date?.toLocaleDateString()}</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <FontAwesome5 name="map-marker-alt" size={20} color="indigo" />
              <Text className="ml-2 text-base">{advrt.address || 'Место'}</Text>
            </View>
          </View>
        </View>
        <View className="max-h-28">
          <ScrollView>
            <Text className="mt-2 text-justify text-base text-gray-600">
              {advrt.description || "Описание"}
            </Text>
          </ScrollView>
          <Divider  />
        </View>
        {pets && pets.map((pet, index) => (
          <Surface key={index} elevation={1} className="mt-4 p-1 flex-row bg-gray-100 rounded-lg">
            <TouchableRipple className='w-full' rippleColor="#c9b2d9" onPress={()=>{}}>
              <View className='flex-row'>
              <Image source={{ uri: pet?.thumbnailUrl|| 'https://via.placeholder.com/100' }} className=" w-28 h-28 rounded-lg" />
              <View className="ml-4 flex-grow">
                <View className='flex-col'>
                    <View className='flex-row items-center'>
                      <Text className="text-xl font-nunitoSansBold">{pet.petName || 'Pet'},</Text>
                      <Ionicons name="male" size={18} color="indigo" />
                      <Text className="text-base font-nunitoSansRegular">{pet.breed || 'Порода'}</Text>
                    </View>
                  
                  </View>
                  <View className="mt-1" >
                  
                      <Text className="text-xs font-nunitoSansRegular">Дружелюбность: </Text>
                      <Divider  />
                      <StarRatingDisplay rating={4} style={{}} starSize={15} color='indigo'/>
                
                  
                  
                    <Text className="mt-1 text-xs font-nunitoSansRegular">Активность:</Text>
                    <Divider  />
                    <StarRatingDisplay rating={5} starSize={15} color='indigo'/>
                  </View>
              </View>

              </View>
              
            </TouchableRipple>
          </Surface>
        ))}
        
        <View className='h-20'>
          {userStore.currentUser?.id === advrt.userId ? (
            <Button mode="contained" className="mt-4">
              Удалить прогулку
            </Button>
          ) : (
            <Button mode="contained" className="mt-4" onPress={handleInvite}>
              Отправить приглашение
            </Button>
          )}
        </View>       

      </View>
    </ScrollView>
  );
};

export default AdvtComponent;

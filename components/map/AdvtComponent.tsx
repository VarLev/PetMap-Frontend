import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Surface } from 'react-native-paper';
import { IWalkAdvrtDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtDto';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import userStore from '@/stores/UserStore';
import { User } from '@/dtos/classes/user/UserDTO';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import CustomTextComponent from '../custom/text/CustomTextComponent';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { calculateDogAge } from '@/utils/utils';
import { router } from 'expo-router';
import mapStore from '@/stores/MapStore';
import { petUriImage } from '@/constants/Strings';


interface AdvtProps {
  advrt: IWalkAdvrtDto;
  onInvite: (uid:IUser) => void;
  onClose: () => void;
}

const AdvtComponent: React.FC<AdvtProps> = React.memo(({ advrt, onInvite, onClose}) => {
  const pets = advrt.userPets;// Берем первого питомца из списка

  console.log('advrt.userPets', advrt.userPets);
  console.log('advrt.participants', advrt.participants);
 
  const handleInvite = () => {
    var user = new User();
    user.id = advrt.userId!;
    user.name = advrt.userName!;
    user.thumbnailUrl = advrt.userPhoto?? 'https://via.placeholder.com/100';
    onInvite(user);
  };

  const handleEdit = () => {
    // Реализуйте редактирование прогулки

  }

  const handleDelete = () => {
    // Реализуйте удаление прогулки
    mapStore.deleteWalkAdvrt(advrt.id!);
    console.log('Delete walk advrt', mapStore.walkAdvrts.length);
    onClose();
  }

  const handleUserProfileOpen = () => {
    if(userStore.currentUser?.id === advrt.userId) {
      mapStore.setBottomSheetVisible(false);
      router.push('/profile');
    }
  }

  const handlePetProfileOpen = (petId:string) => {
    if(userStore.currentUser?.id === advrt.userId) {
      mapStore.setBottomSheetVisible(false);
      router.push({ pathname: '/profile/pet/[petId]', params: { petId: petId } });
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 ">
      <View className="h-full bg-white px-4">
        
        <View className="flex-row">
          <TouchableOpacity className='rounded-2xl'  onPress={handleUserProfileOpen}>
            <Image source={{ uri: advrt?.userPhoto|| 'https://via.placeholder.com/100' }} className="w-36 h-36 rounded-2xl" />
          </TouchableOpacity>
          <View className="flex-col ml-4 justify-between">
            <Text className="text-2xl font-nunitoSansBold">{advrt.userName|| 'Owner'}</Text>
            <CustomTextComponent 
              text={advrt.date ? new Date(advrt.date).toLocaleTimeString() : 'Дата не указана'} 
              leftIcon='time-outline' 
              iconSet='ionicons' 
              style={{ paddingVertical: 1 }} 
            />
            <CustomTextComponent text={advrt.address || 'Место'}  leftIcon='location-pin' iconSet='simpleLine' style={{  paddingVertical: 1 }}/>
            <View className='h-16 pt-2'>
              {userStore.currentUser?.id === advrt.userId ? (
                <View/>
              ) : (
                <Button mode="contained" className="mt-2 w-48 bg-indigo-800" onPress={handleInvite}>
                  <Text className='w-96 font-nunitoSansRegular text-white'>Пригласить</Text>
                </Button>
              )}
            </View>       
          </View>
        </View>
 
        {pets && pets.map((pet, index) => (
          <Surface key={index} elevation={0} className="mt-4 p-1 flex-row bg-purple-100 rounded-2xl">
            <View className='p-1 flex-row '>
              <TouchableOpacity className='rounded-2xl'  onPress={()=> handlePetProfileOpen(pet.id)}>
                <Image source={{ uri: pet?.thumbnailUrl|| petUriImage }} className=" w-28 h-28 rounded-xl" />
              </TouchableOpacity>
              <View className="ml-2">
                <View className='flex-col items-start'>
                    <View className='justify-center items-center flex-row'>
                      <Ionicons name="male" size={18} color="indigo" />
                      <Text className="pl-1 text-xl font-nunitoSansBold">{pet.petName || 'Pet'},</Text>
                    </View>
                    <Text className="text-sm -mt-1 font-nunitoSansRegular"> {calculateDogAge(pet.birthDate)} {pet.breed || 'Порода'}</Text>
                </View>
                <View className='flex-col pt-1 '>
                  <View className='flex-row justify-between items-center'>              
                    <Text className='font-nunitoSansRegular text-sm'>Темперамент</Text>
                    <StarRatingDisplay rating={pet.temperament ?? 0} starSize={15} color='#BFA8FF' starStyle={{marginHorizontal: 2}}/>
                  </View>
                  <View className='flex-row justify-between items-center'>              
                    <Text className='font-nunitoSansRegular text-sm'>Дружелюбность</Text>
                    <StarRatingDisplay rating={pet.friendliness ?? 0} starSize={15} color='#BFA8FF' starStyle={{marginHorizontal: 2}}/>
                  </View>
                  <View className=' flex-row justify-between items-center'>              
                    <Text className='font-nunitoSansRegular text-sm'>Активность</Text>
                    <StarRatingDisplay rating={pet.activityLevel ?? 0} starSize={15} color='#BFA8FF' starStyle={{marginHorizontal: 2}}/>
                  </View>
                </View>
              </View>
            </View>
          </Surface>
        ))}

        <View className="max-h-28">
          <ScrollView>
            <Text className="mt-2 text-justify text-base text-gray-600">
              {advrt.description || "Описание"}
            </Text>
          </ScrollView>
        </View>
        <View className='h-16 pt-2'>
          {userStore.currentUser?.id === advrt.userId ? (
            <Button mode="contained" className="mt-2 bg-indigo-800" onPress={handleDelete}>
              <Text className='font-nunitoSansRegular text-white'>Удалить прогулку</Text>
            </Button>
          ) : (
            <View></View>
          )}
        </View>       
      </View>
    </ScrollView>
  );
});

AdvtComponent.displayName = "AdvtComponent";

export default AdvtComponent;

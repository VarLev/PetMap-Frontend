import React, { useEffect } from 'react';
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
import { calculateDogAge, getTagsByIndex } from '@/utils/utils';
import { router } from 'expo-router';
import mapStore from '@/stores/MapStore';
import { BREEDS_TAGS, petUriImage } from '@/constants/Strings';
import { IUserAdvrt } from '@/dtos/Interfaces/user/IUserAdvrt';
import { WalkRequestStatus } from '@/dtos/enum/WalkRequestStatus';
import CustomConfirmAlert from '../custom/alert/CustomConfirmAlert';


interface AdvtProps {
  advrt: IWalkAdvrtDto;
  onInvite: (uid:IUser) => void;
  onClose: () => void;
}

const AdvtComponent: React.FC<AdvtProps> = React.memo(({ advrt, onInvite, onClose}) => {
  const pets = advrt.userPets;// Берем первого питомца из списка
  const [participants, setParticipants] = React.useState<IUserAdvrt[]>([]);
  const [requestVisible, setRequestVisible] = React.useState(false);
  const [userIsOwner, setUserIsOwner] = React.useState(false);
  
  useEffect(() => {
    console.log('participants', participants);
      const fetchParticipants = async () => {
        if(advrt.id){
          const users = await mapStore.getAllWalkParticipants(advrt.id);
          setParticipants(users);
          advrt.participants = users;
          if(userStore.currentUser?.id === advrt.userId){
            setUserIsOwner(true);
          }
        }
          
      };
      if(advrt.userId === userStore.currentUser?.id)
        fetchParticipants();
  }, []);
  
 
  const handleInvite = async () => {
    setRequestVisible(true);
  };

  const handleConfirmInvite = async () => {
    var user = new User();
    user.id = advrt.userId!;
    user.name = advrt.userName!;
    user.thumbnailUrl = advrt.userPhoto?? 'https://via.placeholder.com/100';
    await mapStore.requestJoinWalk(advrt.id!, userStore.currentUser?.id);
    onInvite(user);
  }

  const handleEdit = () => {
    // Реализуйте редактирование прогулки

  }

  const handleDelete = () => {
    // Реализуйте удаление прогулки
    mapStore.deleteWalkAdvrt(advrt.id!);
    onClose();
  }

  const handleUserProfileOpen = (userId:string) => {
    if(userIsOwner) {
      console.log('userIsOwner', userIsOwner);
      router.push('/profile');
    }
    else{
      console.log('userIsOwner', userIsOwner);
      router.push(`/(tabs)/profile/${userId}`);
    }
    mapStore.setBottomSheetVisible(false);
  }

  const handlePetProfileOpen = (petId:string) => {
    if(userIsOwner) {
      
      router.push({ pathname: '/profile/pet/[petId]', params: { petId: petId } });
    }else{
      router.push({ pathname: '/(tabs)/profile/pet/[petId]', params: { petId: petId } });
    }
    mapStore.setBottomSheetVisible(false);
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 ">
      <View className="h-full bg-white px-4">
        
        <View className="flex-row">
          <TouchableOpacity className='rounded-2xl'  onPress={()=> handleUserProfileOpen(advrt.userId!)}>
            <Image source={{ uri: advrt?.userPhoto|| 'https://via.placeholder.com/100' }} className="w-24 h-24 rounded-2xl" />
          </TouchableOpacity>
          <View className="w-60 ml-4 justify-between">
            <Text className="w-full text-2xl font-nunitoSansBold">{advrt.userName|| 'Owner'}</Text>
            <CustomTextComponent 
              text={advrt.date ? new Date(advrt.date).toLocaleTimeString() : 'Дата не указана'} 
              leftIcon='time-outline' 
              iconSet='ionicons' 
              className_='p-0'
            />
            <CustomTextComponent text={advrt.address || 'Место'}  leftIcon='location-pin' iconSet='simpleLine' className_='p-0' />
  
          </View>
        </View>
        <Text className="text-sm text-gray-500 font-nunitoSansBold">Учасники</Text>
        <View className="flex-row items-center">
          
        {userIsOwner && participants && participants
          .filter((p) => p.status === WalkRequestStatus.Pending || p.status === WalkRequestStatus.Approved) // Фильтруем участников по статусу
          .map((p, index) => (
            <TouchableOpacity key={index} onPress={()=> handleUserProfileOpen(p.id)}>
              <View className="pt-1 items-center w-14 h-14 overflow-hidden" key={index}>
                <Image 
                  source={{ uri: p?.thumbnailUrl || 'https://via.placeholder.com/100'  }} 
                  className="w-10 h-10 rounded-full"
                  style={p.status === 0 ? { opacity: 0.5 } : {}} // Добавляем полупрозрачность для статуса 0
                />
                <Text className="text-xs text-gray-500 font-nunitoSansBold text-center">{p?.name}</Text>
              </View>
            </TouchableOpacity>
          ))
        }
          
        </View>


        {(userIsOwner || advrt.participants?.find(p => p.id === userStore.currentUser?.id)) ? (
            <Button disabled mode="contained" className="mt-2 bg-gray-400" onPress={handleInvite}>
              <Text  className='font-nunitoSansRegular text-white'>Присоединиться к прогулке</Text>
            </Button>
          ) : (
            <View className='h-16 pt-2'>
              <Button mode="contained" className="mt-2 bg-indigo-800" onPress={handleInvite}>
                <Text className='font-nunitoSansRegular text-white'>Присоединиться к прогулке</Text>
              </Button>
            </View> 
        )}
 
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
                    <Text className="text-sm -mt-1 font-nunitoSansRegular"> {calculateDogAge(pet.birthDate)} {getTagsByIndex(BREEDS_TAGS, pet.breed!)  || 'Порода'}</Text>
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
          {userIsOwner ? (
            <Button mode="contained" className="mt-2 bg-indigo-800" onPress={handleDelete}>
              <Text className='font-nunitoSansRegular text-white'>Удалить прогулку</Text>
            </Button>
          ) : (
            <View></View>
          )}
        </View>       
      </View>
      <CustomConfirmAlert 
        isVisible={requestVisible} 
        onClose={()=>{setRequestVisible(false)}} 
        onConfirm={()=>handleConfirmInvite()} 
        message='Между вами и владельцем питомца будет создан чат и отправлен запрос на присоединение к прогулке' 
        title='Отправка запроса' 
        confirmText='Ок' 
        cancelText='Отмена'/>
    </ScrollView>
  );
});

AdvtComponent.displayName = "AdvtComponent";

export default AdvtComponent;

import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Surface } from "react-native-paper";
import { IWalkAdvrtDto } from "@/dtos/Interfaces/advrt/IWalkAdvrtDto";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import userStore from "@/stores/UserStore";
import { User } from "@/dtos/classes/user/UserDTO";
import { IUser } from "@/dtos/Interfaces/user/IUser";
import CustomTextComponent from "../custom/text/CustomTextComponent";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  calculateDistance,
  calculateDogAge,
  convertDistance,
  getTagsByIndex,
} from "@/utils/utils";
import { router } from "expo-router";
import mapStore from "@/stores/MapStore";
import { BREEDS_TAGS, petUriImage } from "@/constants/Strings";
import { IUserAdvrt } from "@/dtos/Interfaces/user/IUserAdvrt";
import { WalkRequestStatus } from "@/dtos/enum/WalkRequestStatus";
import CustomConfirmAlert from "../custom/alert/CustomConfirmAlert";
import CircleIcon from "../custom/icons/CircleIcon";

interface AdvtProps {
  advrt: IWalkAdvrtDto;
  onInvite: (uid: IUser) => void;
  onClose: () => void;
}

const AdvtComponent: React.FC<AdvtProps> = React.memo(
  ({ advrt, onInvite, onClose }) => {
    const pets = advrt.userPets; // Берем первого питомца из списка
    const [participants, setParticipants] = React.useState<IUserAdvrt[]>([]);
    const [requestVisible, setRequestVisible] = React.useState(false);
    const [userIsOwner, setUserIsOwner] = React.useState(false);
    const [distance, setDistance] = React.useState(0);
    const [showAllPets, setShowAllPets] = useState(false);

    useEffect(() => {
      const fetchParticipants = async () => {
        if (advrt.id) {
          const users = await mapStore.getAllWalkParticipants(advrt.id);
          setParticipants(users);
          advrt.participants = users;
          setUserIsOwner(true);
          mapStore.currentWalkDate = advrt.date;  // Сохраняем дату прогулки
        }
      };
      const dist = calculateDistance(
        advrt.latitude!,
        advrt.longitude!,
        mapStore.currentUserCoordinates[0],
        mapStore.currentUserCoordinates[1]
      );
      setDistance(dist);
      if (advrt.userId === userStore.currentUser?.id) fetchParticipants();
      else {

        

      }
    }, [advrt]);

    const handleInvite = async () => {
      setRequestVisible(true);
    };

    const handleConfirmInvite = async () => {
      var user = new User();
      user.id = advrt.userId!;
      user.name = advrt.userName!;
      user.thumbnailUrl = advrt.userPhoto ?? "https://via.placeholder.com/100";
      await mapStore.requestJoinWalk(advrt.id!, userStore.currentUser?.id);
      onInvite(user);
    };

    const handleEdit = () => {
      // Реализуйте редактирование прогулки
    };

    const handleDelete = () => {
      mapStore.deleteWalkAdvrt(advrt.id!);
      onClose();
    };

    const handleUserProfileOpen = (userId: string) => {
      if (userIsOwner) {
        router.push("/profile");
      } else {
        router.push(`/(tabs)/profile/${userId}`);
      }
      mapStore.setBottomSheetVisible(false);
    };

    const handlePetProfileOpen = (petId: string) => {
      if (userIsOwner) {
        router.push({
          pathname: "/profile/pet/[petId]",
          params: { petId: petId },
        });
      } else {
        router.push({
          pathname: "/(tabs)/profile/pet/[petId]",
          params: { petId: petId },
        });
      }
      mapStore.setBottomSheetVisible(false);
    };

    const renderWalkDetails = () => {
      if (advrt.isRegular) {
        if (advrt.selectedDays?.length === 7) {
          //переделай startTime из number в время
          if (advrt.startTime){
            const hours = Math.floor(advrt.startTime / 60);
            const minutes = advrt.startTime % 60;
            return "Каждый день в " + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
          }
          return "Каждый день";
        } else {
          return advrt.selectedDays?.map((day) =>
            ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"][day]
          ).join(", ") + " в "  + (advrt.startTime
            ? new Date(advrt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : "Время не указано");
        }
      } else {
        return advrt.date
        ? new Date(advrt.date).toLocaleDateString() +
            (advrt.startTime
              ? " в " + new Date(advrt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : " Время не указано")
        : "Дата не указана";
      }
    };

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        <View className="h-full bg-white">
          <View className="flex-row">
            <TouchableOpacity
              className="rounded-2xl"
              onPress={() => handleUserProfileOpen(advrt.userId!)}
            >
              <Image
                source={{
                  uri: advrt?.userPhoto || "https://via.placeholder.com/100",
                }}
                className="w-28 h-32 rounded-2xl"
              />
            </TouchableOpacity>
            <View className="flex-1 ml-2 justify-between">
              <View className="flex-1 justify-center">
                <Text className="w-full text-xl font-nunitoSansBold max-h-14">
                  {advrt.userName || "Owner"}
                </Text>
              </View>
              <View className="flex-1 justify-center">
                <CustomTextComponent
                  text={renderWalkDetails()}
                  leftIcon="time-outline"
                  iconSet="ionicons"
                  className_="p-0"
                />
              </View>
              <View className="flex-1 justify-center">
                <CustomTextComponent
                  text={convertDistance(distance)}
                  leftIcon="location-pin"
                  iconSet="simpleLine"
                  className_="p-0"
                />
              </View>
              <View className="flex-1 justify-center">
                {userIsOwner ||
                advrt.participants?.find(
                  (p) => p.id === userStore.currentUser?.id
                ) ? (
                  <Button
                mode="contained"
                className="mt-2 bg-indigo-800"
                onPress={handleDelete}
              >
                <Text className="font-nunitoSansRegular text-white">
                  Удалить прогулку
                </Text>
              </Button>
                ) : (
                  <Button
                    mode="contained"
                    className="bg-indigo-800"
                    onPress={handleInvite}
                  >
                    <Text className="font-nunitoSansRegular text-white">
                      Присоединиться
                    </Text>
                  </Button>
                )}
              </View>
            </View>
          </View>

          {userIsOwner && (
            <>
              <Text className="text-base text-indigo-800 font-nunitoSansBold">
                Участники
              </Text>
              <View className="flex-row items-center">
                {userIsOwner && participants && participants.length > 0 ? (
                  participants
                    .filter(
                      (p) =>
                        p.status === WalkRequestStatus.Pending ||
                        p.status === WalkRequestStatus.Approved
                    )
                    .map((p, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleUserProfileOpen(p.id)}
                      >
                        <View
                          className="pt-1 items-center w-14 h-14 overflow-hidden"
                          key={index}
                        >
                          <Image
                            source={{
                              uri:
                                p?.thumbnailUrl ||
                                "https://via.placeholder.com/100",
                            }}
                            className="w-10 h-10 rounded-full"
                            style={p.status === WalkRequestStatus.Pending ? { opacity: 0.5 } : {}}
                          />
                          <Text className="text-xs text-gray-500 font-nunitoSansBold text-center">
                            {p?.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                ) : (
                  <Text className="text-xs text-gray-400 font-nunitoSansRegular">
                    Пока к вашей прогулке еще никто не присоединился
                  </Text>
                )}
              </View>
            </>
          )}

        <Text className="text-base pt-2 text-indigo-800 font-nunitoSansBold">    
          Питомцы
        </Text>
         <View className="w-full pt-1 items-center">
         
         {pets && 
            pets.slice(0, showAllPets ? pets.length : 2).map((pet, index) => (

              <Surface
                key={index}
                elevation={0}
                className="mt-2 w-full flex-row bg-purple-100 rounded-2xl"
              >
                <View className="p-1 flex-row ">
                  <TouchableOpacity
                    className="rounded-2xl"
                    onPress={() => handlePetProfileOpen(pet.id)}
                  >
                    <Image
                      source={{ uri: pet?.thumbnailUrl || petUriImage }}
                      className=" w-24 h-24 rounded-xl"
                    />
                  </TouchableOpacity>
                  <View className="ml-2">
                    <View className="flex-col items-start">
                      <View className="justify-center items-center flex-row">
                        <Ionicons name="male" size={18} color="indigo" />
                        <Text className="pl-1 text-lg font-nunitoSansBold">
                          {pet.petName || "Pet"},
                        </Text>
                      </View>
                      <Text className="text-sm -mt-1 font-nunitoSansRegular">
                        {calculateDogAge(pet.birthDate)} {getTagsByIndex(BREEDS_TAGS, pet.breed!) || "Порода"}
                      </Text>
                    </View>
                    <View className="flex-col pt-0 ">
                      <View className="flex-row justify-between items-center">
                        <Text className="font-nunitoSansRegular text-sm">
                          Дружелюбность
                        </Text>
                        <StarRatingDisplay
                          rating={pet.friendliness ?? 0}
                          starSize={15}
                          color="#BFA8FF"
                          maxStars={5}
                          starStyle={{ marginHorizontal: 2 }}
                          StarIconComponent={CircleIcon}
                        />
                      </View>
                      <View className=" flex-row justify-between items-center">
                        <Text className="font-nunitoSansRegular text-sm">
                          Активность
                        </Text>
                        <StarRatingDisplay
                          rating={pet.activityLevel ?? 0}
                          starSize={15}
                          color="#BFA8FF"
                          starStyle={{ marginHorizontal: 2 }}
                          StarIconComponent={CircleIcon}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </Surface>
            ))
          }

          {pets && pets.length > 2 && !showAllPets && (
            <Button onPress={() => setShowAllPets(true)} mode="text" >
              <Text className="font-nunitoSansBold">
               Показать всех
              </Text>
              
            </Button>
          )}

          {showAllPets && (
            <Button onPress={() => setShowAllPets(false)} mode="text" >
              <Text className="font-nunitoSansBold">
               Скрыть
              </Text>
            </Button>
          )}
         </View>
          
                
          

          <View >
            <ScrollView>
              <Text className="mt-2 text-justify text-base text-gray-600 font-nunitoSansRegular">
                {advrt.description || "Описание"}
              </Text>
              <Text className="mt-2 text-justify text-base text-indigo-800 font-nunitoSansBold">
               Детали прогулки
              </Text>
              <CustomTextComponent text={advrt.address}  leftIcon='location-pin' iconSet="simpleLine"/>
            
              <CustomTextComponent text={renderWalkDetails()}  leftIcon='calendar-outline' iconSet="ionicons" /> 
                
               
             
            
            </ScrollView>
          </View>
        </View>
        <CustomConfirmAlert
          isVisible={requestVisible}
          onClose={() => {
            setRequestVisible(false);
          }}
          onConfirm={() => handleConfirmInvite()}
          message="Между вами и владельцем питомца будет создан чат и отправлен запрос на присоединение к прогулке"
          title="Отправка запроса"
          confirmText="Ок"
          cancelText="Отмена"
        />
      </ScrollView>
    );
  }
);

AdvtComponent.displayName = "AdvtComponent";

export default AdvtComponent;

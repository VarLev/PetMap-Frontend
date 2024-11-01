import React, { memo, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { Button, Chip, Divider, Surface } from "react-native-paper";
import { useRouter } from "expo-router";
import { MessageType } from "@flyerhq/react-native-chat-ui";
import { IWalkAdvrtDto } from "@/dtos/Interfaces/advrt/IWalkAdvrtDto";
import mapStore from "@/stores/MapStore";
import userStore from "@/stores/UserStore";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { Ionicons } from "@expo/vector-icons";
import { calculateDogAge, getTagsByIndex } from "@/utils/utils";
import { BREEDS_TAGS, petUriImage } from "@/constants/Strings";
import CustomTextComponent from "../custom/text/CustomTextComponent";
import {
  calculateDistance,
  convertDistance,
  renderWalkDetails,
  calculateTimeUntilNextWalk
} from "@/utils/utils";
import CircleIcon from "../custom/icons/CircleIcon";

import CustomButtonOutlined from "../custom/buttons/CustomButtonOutlined";


interface AdvtProps {
  item?: IWalkAdvrtDto[];
  message: MessageType.Custom;
  latitude?: IWalkAdvrtDto;
  longitude?: IWalkAdvrtDto;
}

const CustomMessageComponent = ({ message }: AdvtProps) => {
  const [userIsOwner, setUserIsOwner] = useState(false);
   const [showButtons, setShowButtons] = useState(false);


  const router = useRouter();

  const item = mapStore.walkAdvrts;

   const advrtId = message.metadata?.advrtId;

   const visibleToUserId = message.metadata?.visibleToUserId;
   
   
   const matchedItem = item.find((advrt) => advrtId === advrt.id);
   
   const walkDetails = matchedItem ? renderWalkDetails(matchedItem) : "Данные отсутствуют";

  const pets = matchedItem?.userPets;

  const nextWalk =matchedItem ?  calculateTimeUntilNextWalk(matchedItem) : "Данные отсутствуют";

useEffect(() => {
  if (visibleToUserId  === userStore.currentUser?.id) {
    setShowButtons(true);  
  }
    
}, [visibleToUserId]);



  const handlePress = () => {
    router.push(`/profile/${message.metadata!.userId}`);
  };

  const handleUserProfileOpen = (userId: string) => {
    if (userIsOwner) {
      router.push("/profile");
    } else {
      router.push(`/(tabs)/profile/${userId}`);
    }
    mapStore.setBottomSheetVisible(false);
  };

  
  return (
    <>
      <View className="p-4">
        <Text className="color-[#2F00B6] font-nunitoSansBold text-[16px]">
          🐶 Приглашение на прогулку: Привет! Давай прогуляемся вместе?
        </Text>
      </View>
      <View className="bg-white h-3"></View>
      <View className="p-2 mt-1">
        <View className="flex-row ">
          <TouchableOpacity
            className="rounded-2xl"
            onPress={() => handleUserProfileOpen(matchedItem?.userId!)}
          >
            <Image
              source={{
                uri:
                  matchedItem?.userPhoto || "https://via.placeholder.com/100",
              }}
              className="w-20 h-20 rounded-2xl"
            />
          </TouchableOpacity>
          <View className="w-60 ml-4 justify-between">
            <Text className="w-full text-xl font-nunitoSansBold">
              {matchedItem?.userName || "Owner"}
            </Text>
          </View>
        </View>
        {pets &&
          pets.map((pet, index) => (
            <View
              key={index}
              className="mt-4 p-1 flex-row bg-purple-100 rounded-2xl"
            >
              <View className="p-1 flex-row ">
                <TouchableOpacity className="rounded-2xl mt-2 ">
                  <Image
                    source={{ uri: pet?.thumbnailUrl || petUriImage }}
                    className=" w-20 h-20 rounded-lg"
                  />
                </TouchableOpacity>
                <View className="ml-2">
                  <View className="flex-col items-start">
                    <View className="justify-center items-center flex-row">
                      <Ionicons name="male" size={15} color="indigo" />
                      <Text className="pl-1 text-lg font-nunitoSansBold">
                        {pet.petName || "Pet"},
                      </Text>
                    </View>
                    <Text className="text-xs -mt-1 font-nunitoSansRegular">
                      {calculateDogAge(pet.birthDate)}{" "}
                      {getTagsByIndex(BREEDS_TAGS, pet.breed!) || "Порода"}
                    </Text>
                  </View>
                  <View className="flex-col pt-1 ">
                    <View className="flex-row justify-between items-center ml-[-5px]">
                      <Text className="font-nunitoSansRegular text-xs">
                        Темперамент
                      </Text>
                      <StarRatingDisplay
                        rating={pet.temperament ?? 0}
                        starSize={14}
                        color="#BFA8FF"
                        starStyle={{ marginHorizontal: 1 }}
                        StarIconComponent={CircleIcon}
                      />
                    </View>
                    <View className="flex-row justify-between items-center ml-[-5px]">
                      <Text className="font-nunitoSansRegular text-xs">
                        Дружелюбность
                      </Text>
                      <StarRatingDisplay
                        rating={pet.friendliness ?? 0}
                        starSize={14}
                        color="#BFA8FF"
                        starStyle={{ marginHorizontal: 1 }}
                        StarIconComponent={CircleIcon}
                      />
                    </View>
                    <View className=" flex-row justify-between items-center ml-[-5px]">
                      <Text className="font-nunitoSansRegular text-xs">
                        Активность
                      </Text>
                      <StarRatingDisplay
                        rating={pet.activityLevel ?? 0}
                        starSize={14}
                        color="#BFA8FF"
                        starStyle={{ marginHorizontal: 1 }}
                        StarIconComponent={CircleIcon}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        <Text className=" p-2 color-[#2F00B6] text-[14px] font-nunitoSansBold">
          Детали прогулки
        </Text>
        <CustomTextComponent
          text={walkDetails}
          leftIcon="calendar-outline"
          iconSet="ionicons"
          className_="p-1"
          textStyle={{ fontSize: 12 }}
        />

        <CustomTextComponent
          text={matchedItem?.address || "Место"}
          leftIcon="location-pin"
          iconSet="simpleLine"
          className_="p-1"
          textStyle={{ fontSize: 12 }}
        />
        <CustomTextComponent
          text={nextWalk}
          leftIcon="time-outline"
          iconSet="ionicons"
          className_="p-1 mb-1"
          textStyle={{ fontSize: 12 }}
        />
      </View>
      {showButtons &&
      <View>
          <View className="flex-row justify-between items-center bg-white ">
          <CustomButtonOutlined
              title={'Принять'} 
              handlePress={() => console.log("Принять")}
              containerStyles="flex-1 bg-[#ACFFB9] my-2 mr-2" 
            />
                <CustomButtonOutlined
              title={'Отклонить'} 
              handlePress={() => console.log("Отклонить")}
              containerStyles="flex-1 bg-[#FA8072] my-2 ml-2"
            />
          </View>
    
        </View>}     
    </>
  )}


export default CustomMessageComponent;

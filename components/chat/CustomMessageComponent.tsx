import React, { memo, useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { Button, Chip, Divider, Surface } from "react-native-paper";
import { useRouter } from "expo-router";
import { MessageType } from "@flyerhq/react-native-chat-ui";
import { IWalkAdvrtDto } from "@/dtos/Interfaces/advrt/IWalkAdvrtDto";
import mapStore from "@/stores/MapStore";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { Ionicons } from "@expo/vector-icons";
import { calculateDogAge, getTagsByIndex } from "@/utils/utils";
import { BREEDS_TAGS, petUriImage } from "@/constants/Strings";
import CustomTextComponent from "../custom/text/CustomTextComponent";
import { calculateDistance, convertDistance, correctTimeNaming } from "@/utils/utils";

interface AdvtProps {
  item?: IWalkAdvrtDto[];
  message: MessageType.Custom;
  latitude?: IWalkAdvrtDto;
  longitude?: IWalkAdvrtDto;
}

const CustomMessageComponent = ({ message }: AdvtProps) => {
  const [userIsOwner, setUserIsOwner] = useState(false);
  const [diffHours, setDiffHours] = useState<number | null>(null);
  const [diffMinutes, setDiffMinutes] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const router = useRouter();

  const userIdFromMessage = message.metadata?.userId;
  const item = mapStore.walkAdvrts;
  // console.log("item", item);

  const matchedItem = item.find((advrt) => advrt.userId === userIdFromMessage);
  const pets = matchedItem?.userPets;
  const timeToWalk: Date | undefined = matchedItem?.date
    ? new Date(matchedItem.date)
    : undefined;
  // console.log("timeToWalk", timeToWalk);

 
  // console.log("currentTime", currentTime);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Обновляем каждую минуту

    return () => clearInterval(timer); // Очищаем таймер при размонтировании компонента
  }, []);

  useEffect(() => {
    if (timeToWalk) {
      const currentTime: Date = new Date();
      console.log("currentTime", currentTime);

      // Вычисляем разницу во времени в миллисекундах
      const diffMs = timeToWalk.getTime() - currentTime.getTime();

      // Разделение на часы и минуты
      // const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      let diffHours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      if (diffHours < 0) {
        diffHours += 24;
        diffMinutes += 60;
      }
      setDiffHours(diffHours + 24);
      setDiffMinutes(diffMinutes + 60);
      // const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setDiffHours(diffHours);
      setDiffMinutes(diffMinutes);

      console.log(`${diffHours} часов, ${diffMinutes} минут`);
    }
   
  }, [currentTime, timeToWalk]);
 

  const handlePress = () => {
    router.push(`/profile/${message.metadata!.userId}`);
  };

  const handleUserProfileOpen = (userId: string) => {
    if (userIsOwner) {
      console.log("userIsOwner", userIsOwner);
      router.push("/profile");
    } else {
      console.log("userIsOwner", userIsOwner);
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
        <View className="flex-row">
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
            {/* <CustomTextComponent
              text={correctTimeNaming(diffHours, diffMinutes)}
              leftIcon="time-outline"
              iconSet="ionicons"
              className_="p-0"
              textStyle={{ fontSize: 12 }}
            /> */}
            {/* <CustomTextComponent
              text={distanceText}
              leftIcon="social-distance"
              iconSet="material"
              className_="p-0"
              textStyle={{ fontSize: 12 }}
            /> */}
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
                        starSize={15}
                        color="#BFA8FF"
                        starStyle={{ marginHorizontal: 1 }}
                      />
                    </View>
                    <View className="flex-row justify-between items-center ml-[-5px]">
                      <Text className="font-nunitoSansRegular text-xs">
                        Дружелюбность
                      </Text>
                      <StarRatingDisplay
                        rating={pet.friendliness ?? 0}
                        starSize={15}
                        color="#BFA8FF"
                        starStyle={{ marginHorizontal: 1 }}
                      />
                    </View>
                    <View className=" flex-row justify-between items-center ml-[-5px]">
                      <Text className="font-nunitoSansRegular text-xs">
                        Активность
                      </Text>
                      <StarRatingDisplay
                        rating={pet.activityLevel ?? 0}
                        starSize={15}
                        color="#BFA8FF"
                        starStyle={{ marginHorizontal: 1 }}
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
          text={
            matchedItem?.date
              ? new Date(matchedItem.date).toLocaleTimeString()
              : "Дата не указана"
          }
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
          text={correctTimeNaming(diffHours, diffMinutes)}
          leftIcon="time-outline"
          iconSet="ionicons"
          className_="p-1 mb-1"
          textStyle={{ fontSize: 12 }}
        />
        {/* <CustomTextComponent
          text={distanceText}
          leftIcon="social-distance"
          iconSet="material"
          className_="p-1 mb-1"
          textStyle={{ fontSize: 12 }}
        /> */}
      </View>
    </>
  );
};

export default CustomMessageComponent;

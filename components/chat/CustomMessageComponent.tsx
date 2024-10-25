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
import {
  calculateDistance,
  convertDistance,
  correctTimeNaming,
} from "@/utils/utils";
import CircleIcon from "../custom/icons/CircleIcon";

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

  const matchedItem = item.find((advrt) => advrt.userId === userIdFromMessage);
  
  
  const pets = matchedItem?.userPets;

  const nextWalkTime = (advrt: IWalkAdvrtDto): Date | undefined => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 - воскресенье, 6 - суббота

    if (advrt.isRegular) {
      if (advrt.selectedDays?.length === 7) {
        // Прогулки каждый день
        if (advrt.startTime) {
          const nextWalk = new Date(advrt.startTime);
          nextWalk.setFullYear(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );

          // Если время прогулки уже прошло сегодня, берем завтрашнее время
          if (nextWalk <= today) {
            nextWalk.setDate(nextWalk.getDate() + 1);
          }
          return nextWalk;
        }
        return undefined; // Если время не указано
      } else if (advrt.selectedDays && advrt.selectedDays.length > 0) {
        // Прогулки в определенные дни недели
        const sortedDays = advrt.selectedDays.sort((a, b) => a - b);
        let nextWalkDay =
          sortedDays.find((day) => day > currentDay) ?? sortedDays[0];
        let daysUntilNextWalk = (nextWalkDay - currentDay + 7) % 7;

        const nextWalkDate = new Date();
        nextWalkDate.setDate(today.getDate() + daysUntilNextWalk);

        if (advrt.startTime) {
          const startTimeDate = new Date(advrt.startTime);
          nextWalkDate.setHours(startTimeDate.getHours());
          nextWalkDate.setMinutes(startTimeDate.getMinutes());
        }

        return nextWalkDate;
      }
    } else if (advrt.date) {
      // Разовая прогулка
      return new Date(advrt.date);
    }

    return undefined; // Если нет данных о прогулке
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Обновляем каждую минуту

    return () => clearInterval(timer); // Очищаем таймер при размонтировании компонента
  }, []);

  useEffect(() => {
    const nextWalk = matchedItem ? nextWalkTime(matchedItem) : undefined;

    if (nextWalk) {
      const currentTime = new Date();

      // Вычисляем разницу во времени в миллисекундах
      const diffMs = nextWalk.getTime() - currentTime.getTime();

      if (diffMs > 0) {
        let diffHours = Math.floor(
          (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        let diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        setDiffHours(diffHours);
        setDiffMinutes(diffMinutes);
      } else {
        setDiffHours(0);
        setDiffMinutes(0);
      }
    }
  }, [currentTime, matchedItem]);

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
          text={
            matchedItem?.isRegular
              ? // Прогулки регулярные
                matchedItem.selectedDays?.length === 7
                ? "Каждый день в " +
                  (matchedItem.startTime
                    ? new Date(matchedItem.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Время не указано")
                : matchedItem.selectedDays
                    ?.map(
                      (day) => ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"][day]
                    )
                    .join(", ") +
                  " в " +
                  (matchedItem.startTime
                    ? new Date(matchedItem.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Время не указано")
              : // Прогулки нерегулярные
              matchedItem?.date
              ? (() => {
                  const walkDate = new Date(matchedItem.date);
                  const currentTime = new Date();
                  const diffMs = walkDate.getTime() - currentTime.getTime();
                  const diffDays = diffMs / (1000 * 60 * 60 * 24);

                  // Если до прогулки больше суток, показываем дату и время
                  if (diffDays > 1) {
                    return (
                      walkDate.toLocaleDateString() +
                      " в " +
                      (matchedItem.startTime
                        ? new Date(matchedItem.startTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Время не указано")
                    );
                  } else if (matchedItem.startTime) {
                    // Если до прогулки меньше суток и startTime указан, показываем только время
                    return (
                      "Сегодня в " +
                      new Date(matchedItem.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    );
                  } else {
                    return "Дата не указана";
                  }
                })()
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
          text={correctTimeNaming(diffHours ?? 0, diffMinutes ?? 0)}
          leftIcon="time-outline"
          iconSet="ionicons"
          className_="p-1 mb-1"
          textStyle={{ fontSize: 12 }}
        />
      </View>
    </>
  );
};

export default CustomMessageComponent;

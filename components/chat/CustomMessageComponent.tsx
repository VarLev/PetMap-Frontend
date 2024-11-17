import React, { useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
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
import { renderWalkDetails, calculateTimeUntilNextWalk } from "@/utils/utils";
import CircleIcon from "../custom/icons/CircleIcon";
import CustomButtonOutlined from "../custom/buttons/CustomButtonOutlined";
import { IUser } from "@/dtos/Interfaces/user/IUser";

interface AdvtProps {
  item?: IWalkAdvrtDto[];
  message: MessageType.Custom;
  latitude?: IWalkAdvrtDto;
  longitude?: IWalkAdvrtDto;
}

const CustomMessageComponent = ({ message }: AdvtProps) => {
  const [userIsOwner, setUserIsOwner] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  const router = useRouter();

  const item = mapStore.walkAdvrts; //нужно добавить метод вынимающий конкретную прогулку по id

  const advrtId = message.metadata?.advrtId;

  const userId = message.author.id;

  const visibleToUserId = message.metadata?.visibleToUserId;

  const matchedItem = item.find((advrt) => advrtId === advrt.id);

  const walkDetails = matchedItem
    ? renderWalkDetails(matchedItem)
    : "Данные отсутствуют";

  const pets = user?.petProfiles;

  const nextWalk = matchedItem
    ? calculateTimeUntilNextWalk(matchedItem)
    : "Данные отсутствуют";

  async function getUser() {
    const user: IUser = await userStore.getUserById(userId);

    return setUser(user);
  }
  useEffect(() => {
    getUser();
  }, [user]);

  useEffect(() => {
    if (visibleToUserId === userStore.currentUser?.id) {
      setShowButtons(true);
    }
  }, [visibleToUserId]);

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
            onPress={() => handleUserProfileOpen(userId)}
          >
            <Image
              source={{
                uri: user?.thumbnailUrl || "https://via.placeholder.com/100",
              }}
              className="w-20 h-20 rounded-2xl"
            />
          </TouchableOpacity>
          <View className="flex-1 ml-4">
            <Text className="w-full text-xl font-nunitoSansBold">
              {user?.name || "Owner"}
            </Text>
            {showButtons && (
              <Text className="text-sm font-nunitoSansRegular">
                Хочет присоеденится к прогулке
              </Text>
            )}
          </View>
        </View>
        {pets &&
          pets.slice(0, 1).map((pet, index) => (
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
                    <View className="flex-row w-full ">
                      <Text className="text-xs mt-1 font-nunitoSansRegular">
                        {calculateDogAge(pet.birthDate)}{' '}
                        </Text>
                        <Text className="text-xs mt-1 font-nunitoSansRegular flex-1">
                        {getTagsByIndex(BREEDS_TAGS, pet.breed!) || "Порода"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-col pt-1">
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
      {showButtons && (
        <View>
          <View className="flex-row justify-between items-center bg-white ">
            <CustomButtonOutlined
              title={"Принять"}
              handlePress={() => console.log("Принять")}
              containerStyles="flex-1 bg-[#ACFFB9] my-2 mr-2"
            />
            <CustomButtonOutlined
              title={"Отклонить"}
              handlePress={() => console.log("Отклонить")}
              containerStyles="flex-1 bg-[#FA8072] my-2 ml-2"
            />
          </View>
        </View>
      )}
    </>
  );
};

export default CustomMessageComponent;

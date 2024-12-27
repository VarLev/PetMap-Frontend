import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Surface } from "react-native-paper";
import { IWalkAdvrtDto } from "@/dtos/Interfaces/advrt/IWalkAdvrtDto";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import userStore from "@/stores/UserStore";
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
import {petUriImage } from "@/constants/Strings";
import { IUserChat } from "@/dtos/Interfaces/user/IUserChat";
import CustomConfirmAlert from "../custom/alert/CustomConfirmAlert";
import CircleIcon from "../custom/icons/CircleIcon";
//import  { renderWalkDetails } from "@/utils/utils";
import i18n from "@/i18n";
import { getPushTokenFromServer } from "@/hooks/notifications";

interface AdvtProps {
  advrt: IWalkAdvrtDto;
  isShort?: boolean;
  onInvite: (uid: IUserChat) => void;
  onClose: () => void;
}

const AdvtComponent: React.FC<AdvtProps> = React.memo(
  ({ advrt, onInvite, onClose, isShort=false}) => {
    const pets = advrt.userPets; // Берем первого питомца из списка
    //const [participants, setParticipants] = React.useState<IUserAdvrt[]>([]);
    const [requestVisible, setRequestVisible] = React.useState(false);
    const [userIsOwner, setUserIsOwner] = React.useState(false);
    const [distance, setDistance] = React.useState(0);
    const [showAllPets, setShowAllPets] = useState(false);

    useEffect(() => {
      
      const dist = calculateDistance(
        advrt.latitude!,
        advrt.longitude!,
        mapStore.currentUserCoordinates[0],
        mapStore.currentUserCoordinates[1]
      );
      setDistance(dist);
      if (advrt.userId === userStore.currentUser?.id) 
        setUserIsOwner(true);
      else {
        setUserIsOwner(false);
      }
    }, [advrt]);

    const handleInvite = async () => {
      setRequestVisible(true);
    };

    const handleConfirmInvite = async () => {
      const fmcToken = await getPushTokenFromServer(advrt.userId!);
      console.log("fmc",fmcToken);
      const user: IUserChat = {
        id: advrt.userId!,
        name: advrt.userName!,
        thumbnailUrl: advrt.userPhoto ?? 'https://avatar.iran.liara.run/public',
        fmcToken: fmcToken,
      };
      //chatStore.setSelectedAdvrtId(advrt.id!);
      // if (userStore.currentUser?.id) {
      //   await mapStore.requestJoinWalk(advrt.id!, userStore.currentUser.id);
      // }
      
      onInvite(user);
 
    };

    // const handleEdit = () => {
    //   // Реализуйте редактирование прогулки
    // };

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

    //const walkDetails = renderWalkDetails(advrt);

       

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        <View className="h-full bg-white">
          <View className="flex-row">
            <TouchableOpacity
              className="rounded-2xl"
              onPress={() => handleUserProfileOpen(advrt.userId!)}
            >
              {!isShort && (
                <Image source={{uri: advrt?.userPhoto || "https://avatar.iran.liara.run/public"}} 
                className="w-24 h-24 rounded-2xl"/>
              )}
            </TouchableOpacity>
            <View className="flex-1 ml-2 justify-between">
              <View className="flex-1 justify-center">
                <Text className="w-full text-xl font-nunitoSansBold max-h-14">
                  {advrt.userName || i18n.t("FabGroup.walk")}
                </Text>
              </View>
              {/* <View className="flex-1 justify-center">
                <CustomTextComponent
                  text={walkDetails}
                  leftIcon="time-outline"
                  iconSet="ionicons"
                  className_="p-0"
                />
              </View> */}
              <View className="flex-1 justify-center">
                <CustomTextComponent
                  text={convertDistance(distance)}
                  leftIcon="location-pin"
                  iconSet="simpleLine"
                  className_="p-0"
                />
              </View>
              <View className="flex-1 justify-center">
                {!isShort && (userIsOwner 
                 ? (
                  <Button
                    mode="contained"
                    className="mt-2 bg-indigo-800"
                    onPress={handleDelete}
                  >
                    <Text className="font-nunitoSansRegular text-white">
                      {i18n.t("WalkDetails.deleteWalk")}
                    </Text>
                  </Button>
                ) : (
                  <Button
                    mode="contained"
                    className="bg-indigo-800"
                    onPress={handleInvite}
                  >
                    <Text className="font-nunitoSansRegular text-white">
                      {i18n.t("WalkDetails.joinWalk")}
                    </Text>
                  </Button>
                ))}
              </View>
            </View>
          </View>
    
          {/* {userIsOwner && (
            <>
              <Text className="text-base text-indigo-800 font-nunitoSansBold">
                {i18n.t("WalkDetails.participants")}
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
                                p?.thumbnailUrl || "https://via.placeholder.com/100",
                            }}
                            className="w-10 h-10 rounded-full"
                            style={
                              p.status === WalkRequestStatus.Pending
                                ? { opacity: 0.5 }
                                : {}
                            }
                          />
                          <Text className="text-xs text-gray-500 font-nunitoSansBold text-center">
                            {p?.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                ) : (
                  <Text className="text-xs text-gray-400 font-nunitoSansRegular">
                    {i18n.t("WalkDetails.noParticipants")}
                  </Text>
                )}
              </View>
            </>
          )} */}
    
          <Text className="text-base pt-2 text-indigo-800 font-nunitoSansBold">
            {i18n.t("WalkDetails.pets")}
          </Text>
          <View className="w-full pt-1 items-center">
            {pets &&
              pets
                .slice(0, showAllPets ? pets.length : 2)
                .map((pet, index) => (
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
                            <Text className="pl-1 text-lg font-nunitoSansBold w-52" numberOfLines={1} ellipsizeMode='tail'>
                              {pet.petName || i18n.t("WalkDetails.pet")}
                            </Text>
                          </View>
                          <Text className="text-sm -mt-1 font-nunitoSansRegular">
                            {calculateDogAge(pet.birthDate)}{" "}
                            {getTagsByIndex(i18n.t("tags.breeds") as string[], pet.breed!) ||
                              i18n.t("WalkDetails.breed")}
                          </Text>
                        </View>
                        <View className="flex-col pt-0 ">
                          <View className="flex-row justify-between items-center">
                            <Text className="font-nunitoSansRegular text-sm">
                              {i18n.t("WalkDetails.friendliness")}
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
                              {i18n.t("WalkDetails.activity")}
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
                ))}
    
            {pets && pets.length > 2 && !showAllPets && (
              <Button onPress={() => setShowAllPets(true)} mode="text">
                <Text className="font-nunitoSansBold">
                  {i18n.t("WalkDetails.showAllPets")}
                </Text>
              </Button>
            )}
    
            {showAllPets && (
              <Button onPress={() => setShowAllPets(false)} mode="text">
                <Text className="font-nunitoSansBold">
                  {i18n.t("WalkDetails.hidePets")}
                </Text>
              </Button>
            )}
          </View>
    
          <View>
              <Text className="mt-2 text-justify text-base text-indigo-800 font-nunitoSansBold">
                {i18n.t("WalkDetails.walkDetails")}
              </Text>
              <Text className="mt-2 text-justify text-base text-gray-600 font-nunitoSansRegular">
                {advrt.description?.trim()}
              </Text>
              <CustomTextComponent
                text={advrt.address}
                leftIcon="location-pin"
                iconSet="simpleLine"
              />
    
              {/* <CustomTextComponent
                text={walkDetails}
                leftIcon="calendar-outline"
                iconSet="ionicons"
              /> */}
          </View>
        </View>
        <CustomConfirmAlert
          isVisible={requestVisible}
          onClose={() => {
            setRequestVisible(false);
          }}
          onConfirm={() => handleConfirmInvite()}
          message={i18n.t("WalkDetails.confirmMessage")}
          title={i18n.t("WalkDetails.confirmTitle")}
          confirmText={i18n.t("WalkDetails.confirm")}
          cancelText={i18n.t("WalkDetails.cancel")}
        />
      </ScrollView>
    );
  }
);

AdvtComponent.displayName = "AdvtComponent";

export default AdvtComponent;

import React, { useState, useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
// import { Button, Surface, Checkbox, TouchableRipple } from "react-native-paper";
import { observer } from "mobx-react-lite";
import userStore from "@/stores/UserStore";
// import { Ionicons } from "@expo/vector-icons";
import mapStore from "@/stores/MapStore";
import { IWalkAdvrtDto } from "@/dtos/Interfaces/advrt/IWalkAdvrtDto";
import CustomOutlineInputText from "../custom/inputs/CustomOutlineInputText";
// import { calculateDogAge } from "@/utils/utils";
// import { petUriImage } from "@/constants/Strings";
import { WalkAdvrtStatus } from "@/dtos/enum/WalkAdvrtStatus";
import { AdvrtType } from "@/dtos/enum/AdvrtType";
// import DateOrTimeRangePicker from "../custom/pickers/DateOrTimeRangePicker";
// import CustomSegmentedButtonsWithProps from "../custom/buttons/CustomSegmentedButtonsWithProps";
import CustomLoadingButton from "../custom/buttons/CustomLoadingButton";
import CustomAlert from "../custom/alert/CustomAlert";
import i18n from "@/i18n";



interface AdvtEditProps {
  coordinates: [number, number];
  onAdvrtAddedInvite: (isGetedBonuses: boolean) => void
}

const AdvtEditComponent: React.FC<AdvtEditProps> = observer(
  ({ coordinates, onAdvrtAddedInvite }) => {
    const [description, setDescription] = useState("");

    const [selectedPets, setSelectedPets] = useState<string[]>([]);
    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useState<Date>(new Date());
    const [duration, setDuration] = useState<number>(60);
    const [address, setAddress] = useState("");
    const [isSwitchOn, setIsSwitchOn] = useState(true);
    const [selectedDays, setselectedDays] = useState<number[]>([
      0, 1, 2, 3, 4, 5, 6,
    ]);
    const [showAllPets, setShowAllPets] = useState(false);
    const petProfiles = userStore.currentUser?.petProfiles || [];
    const visiblePets = showAllPets ? petProfiles : petProfiles.slice(0, 2);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");

    useEffect(() => {
      // Загрузите пользователя, если он еще не загружен
      if (!userStore.currentUser) {
        userStore.loadUser();
      }
    }, []);

    useEffect(() => {
      if (userStore.currentUser) {
        setDescription("");
        setSelectedPets(
          userStore.currentUser.petProfiles?.map((pet) => pet.id) || []
        );
      }
    }, [userStore.currentUser]);

    useEffect(() => {
      // Получаем адрес по координатам и устанавливаем его в поле address
      mapStore
        .getStringAddressFromCoordinate(coordinates)
        .then(() => {
          setAddress(mapStore.advrtAddress); // Устанавливаем адрес из mapStore
        })
        .catch((error) => {
          console.error("Error fetching address:", error);
          setAddress(i18n.t("WalkEditDetails.addressNotFound"));
        });
    }, [coordinates]);

    const handleSelectedDays = (newSelectedIndices: number | number[]) => {
      setselectedDays(newSelectedIndices as number[]); // Обновляем выбранные индексы
    };

    const showAlert = (title: string, message: string) => {
      setAlertTitle(title);
      setAlertMessage(message);
      setAlertVisible(true);
    };

    const handleSave = async () => {

      // if (selectedPets.length === 0) {
      //   showAlert(i18n.t("WalkEditDetails.error"), i18n.t("WalkEditDetails.selectAtLeastOnePet"));
      //   return;
      // }
    
      // // Проверка доступности создания прогулки в выбранном месте
      // if (!mapStore.isAvaliableToCreateWalk) {
      //   showAlert(i18n.t("WalkEditDetails.error"), i18n.t("WalkEditDetails.cannotCreateWalkHere"));
      //   return;
      // }
    
      // Проверка на заполнение адреса
      if (!address.trim()) {
        showAlert(i18n.t("WalkEditDetails.error"), i18n.t("WalkEditDetails.provideAddress"));
        return;
      }
    
      // if (duration <= 0 || duration > 180) {
      //   showAlert(i18n.t("WalkEditDetails.error"), i18n.t("WalkEditDetails.invalidDuration"));
      //   return;
      // }
    
      // Проверка на заполнение описания
      if (!description.trim()) {
        showAlert(i18n.t("WalkEditDetails.error"), i18n.t("WalkEditDetails.addDescription"));
        return;
      }
    
      // Проверка на заполнение времени и даты
      // if (isSwitchOn) {
      //   if (selectedDays.length === 0) {
      //     showAlert(i18n.t("WalkEditDetails.error"), i18n.t("WalkEditDetails.selectAtLeastOneDay"));
      //     return;
      //   }
      // } else {
      //   if (!date) {
      //     showAlert(i18n.t("WalkEditDetails.error"), i18n.t("WalkEditDetails.provideDate"));
      //     return;
      //   }
      // }
      const updatedUserWalk :IWalkAdvrtDto = {
        id: undefined,
        isEnabled: true,
        createdAt: new Date(),
        date: new Date(),
        latitude: coordinates[1],
        longitude: coordinates[0],
        participants: [],
        address: address,
        userId: userStore.currentUser?.id || '',
        description: description,
        status: WalkAdvrtStatus.Active,
        type: AdvrtType.Single,
        userPhoto: userStore.currentUser?.thumbnailUrl || '',
        userName: userStore.currentUser?.name || '',
        userPets: userStore.currentUser?.petProfiles || [],
        duration: duration,
        isRegular: isSwitchOn,
        selectedDays: selectedDays,
        startTime: time.getHours() * 60 + time.getMinutes(),
        city: userStore.getCurrentUserCity() || ''
      };
      const isGetedBonuses = await mapStore.addWalkAdvrt(updatedUserWalk)
      if(isGetedBonuses)
        onAdvrtAddedInvite(true);
      else
        onAdvrtAddedInvite(false);
  

    };

    const togglePetSelection = (petId: string) => {
      setSelectedPets((prevSelectedPets) =>
        prevSelectedPets.includes(petId)
          ? prevSelectedPets.filter((id) => id !== petId)
          : [...prevSelectedPets, petId]
      );
    };

    const handleDateChange = (selectedDate: Date) => {
      setDate(selectedDate);
    };

    return (
      <>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-2"
        >
          <View className="h-full bg-white rounded-lg px-2 flex-1 justify-between">
            <Text className="text-base font-nunitoSansBold text-indigo-700">
              {i18n.t("WalkEditDetails.walkDetails")}
            </Text>
            {/* <View className="pt-4">
              <DateOrTimeRangePicker
                mode="time"
                time={time}
                duration={duration}
                onTimeChange={setTime}
                onDurationChange={setDuration}
              />
              <Checkbox.Item
                label={`${
                  isSwitchOn
                    ? i18n.t("WalkEditDetails.regularWalk")
                    : i18n.t("WalkEditDetails.singleWalk")
                }`}
                labelVariant="bodyLarge"
                status={isSwitchOn ? "checked" : "unchecked"}
                onPress={() => setIsSwitchOn(!isSwitchOn)}
                position="leading"
                style={{ width: 270, marginLeft: -20 }}
                labelStyle={{
                  fontFamily: "NunitoSans_400Regular",
                  textAlign: "left",
                  color: "#363636",
                }}
              />
              {isSwitchOn ? (
                <CustomSegmentedButtonsWithProps
                  values={selectedDays}
                  onValueChange={handleSelectedDays}
                  buttons={[
                    { label: i18n.t("WalkEditDetails.monday") },
                    { label: i18n.t("WalkEditDetails.tuesday") },
                    { label: i18n.t("WalkEditDetails.wednesday") },
                    { label: i18n.t("WalkEditDetails.thursday") },
                    { label: i18n.t("WalkEditDetails.friday") },
                    { label: i18n.t("WalkEditDetails.saturday") },
                    { label: i18n.t("WalkEditDetails.sunday") },
                  ]}
                />
              ) : (
                <DateOrTimeRangePicker
                  mode="date"
                  date={date}
                  onDateChange={handleDateChange}
                />
              )}
            </View> */}

            <View className="mt-2">
              <CustomOutlineInputText
                label={i18n.t("WalkEditDetails.address")}
                value={address}
                handleChange={setAddress}
                containerStyles="h-10"

              />
              <View className="pt-2" />
              <CustomOutlineInputText
                label={i18n.t("WalkEditDetails.description")}
                value={description}
                handleChange={setDescription}
                numberOfLines={3}
              />
            </View>

            {/* {visiblePets.map((pet, index) => (
              <Surface
                key={index}
                elevation={0}
                className="mt-4 bg-purple-100 rounded-lg"
              >
                <TouchableRipple
                  rippleColor="#c9b2d9"
                  onPress={() => togglePetSelection(pet.id)}
                >
                  <View className="-ml-2 p-1 flex-row items-center">
                    <Checkbox
                      status={
                        selectedPets.includes(pet.id) ? "checked" : "unchecked"
                      }
                      onPress={() => togglePetSelection(pet.id)}
                    />
                    <Image
                      source={{ uri: pet.thumbnailUrl || petUriImage }}
                      width={60}
                      height={60}
                      className="rounded-lg"
                    />
                    <View className="flex-col">
                      <View className="flex-row items-center ml-3">
                        <Ionicons name="male" size={18} color="indigo" />
                        <Text className="ml-2 text-xl font-nunitoSansBold">
                          {pet.petName},
                        </Text>
                        <Text className="ml-2 text-base font-nunitoSansRegular">
                          {calculateDogAge(pet.birthDate)} {pet.breed}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableRipple>
              </Surface>
            ))}
            {petProfiles.length > 2 && (
              <Button onPress={() => setShowAllPets(!showAllPets)} mode="text">
                <Text className="font-nunitoSansBold">
                  {showAllPets
                    ? i18n.t("WalkEditDetails.hide")
                    : i18n.t("WalkEditDetails.showMore")}
                </Text>
              </Button>
            )} */}

            <View className="h-20 mt-4 ">
              <CustomLoadingButton
                title={i18n.t("WalkEditDetails.save")}
                handlePress={ async () => {await handleSave()}}
              />
            </View>
          </View>
        </ScrollView>

        <CustomAlert
          isVisible={alertVisible}
          onClose={() => setAlertVisible(false)}
          message={alertMessage}
          title={alertTitle}
          type="error"
        />
      </>
    );
  }
);

export default AdvtEditComponent;

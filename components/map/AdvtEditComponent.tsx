import React, { useState, useEffect } from "react";
import { View, ScrollView, Image, Text, Alert } from "react-native";
import { Button, Surface, Checkbox, TouchableRipple } from "react-native-paper";
import { observer } from "mobx-react-lite";
import userStore from "@/stores/UserStore";
import { Ionicons } from "@expo/vector-icons";
import mapStore from "@/stores/MapStore";
import { IWalkAdvrtDto } from "@/dtos/Interfaces/advrt/IWalkAdvrtDto";
import CustomOutlineInputText from "../custom/inputs/CustomOutlineInputText";
import { calculateDogAge } from "@/utils/utils";
import { petUriImage } from "@/constants/Strings";
import { WalkAdvrtStatus } from "@/dtos/enum/WalkAdvrtStatus";
import { AdvrtType } from "@/dtos/enum/AdvrtType";
import DateOrTimeRangePicker from "../custom/pickers/DateOrTimeRangePicker";
import CustomSegmentedButtonsWithProps from "../custom/buttons/CustomSegmentedButtonsWithProps";
import CustomLoadingButton from "../custom/buttons/CustomLoadingButton";
import CustomAlert from "../custom/alert/CustomAlert";

interface AdvtEditProps {
  coordinates: [number, number];
  onAdvrtAddedInvite: () => void;
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
          setAddress("Не удалось получить адрес");
        });
    }, [coordinates]);

    const handleSelectedDays = (newSelectedIndices: number[]) => {
      setselectedDays(newSelectedIndices); // Обновляем выбранные индексы
    };

    const showAlert = (title: string, message: string) => {
      setAlertTitle(title);
      setAlertMessage(message);
      setAlertVisible(true);
    };

    const handleSave = async () => {
      if (selectedPets.length === 0) {
        showAlert(
          "Ошибка",
          "Выберите хотя бы одного питомца для участия в прогулке."
        );
        return;
      }

      // Проверка доступности создания прогулки в выбранном месте
      if (!mapStore.isAvaliableToCreateWalk) {
        showAlert("Ошибка", "В этом месте нельзя создать прогулку.");
        return;
      }

      // Проверка на заполнение адреса
      if (!address.trim()) {
        showAlert("Ошибка", "Укажите адрес прогулки.");
        return;
      }
      console.log("duration", duration);
      if (duration <= 0 || duration > 180) {
        showAlert("Ошибка", "Укажите корректную продолжительность прогулки.");
        return;
      }

      // Проверка на заполнение описания
      if (!description.trim()) {
        showAlert("Ошибка", "Добавьте описание прогулки.");
        return;
      }

      // Проверка на заполнение времени и даты
      if (isSwitchOn) {
        // Если регулярная прогулка, проверяем, что дни недели выбраны
        if (selectedDays.length === 0) {
          showAlert(
            "Ошибка",
            "Выберите хотя бы один день для регулярной прогулки."
          );
          return;
        }
      } else {
        // Если разовая прогулка, проверяем, что дата установлена
        if (!date) {
          showAlert("Ошибка", "Укажите дату для разовой прогулки.");
          return;
        }
      }

      const updatedUserWalk: IWalkAdvrtDto = {
        id: undefined,
        isEnabled: true,
        createdAt: new Date(),
        date: date,
        latitude: coordinates[1],
        longitude: coordinates[0],
        participants: [],
        address: address,
        userId: userStore.currentUser?.id || "",
        description: description,
        status: WalkAdvrtStatus.Active,
        type: AdvrtType.Single,
        userPhoto: userStore.currentUser?.thumbnailUrl || "",
        userName: userStore.currentUser?.name || "",
        userPets: userStore.currentUser?.petProfiles || [],
        duration: duration,
        isRegular: isSwitchOn,
        selectedDays: selectedDays,
        startTime: time.getHours() * 60 + time.getMinutes(),
      };

      await mapStore.addWalkAdvrt(updatedUserWalk);

      onAdvrtAddedInvite();
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
              Детали прогулки
            </Text>
            <View className="pt-4">
              <DateOrTimeRangePicker
                mode="time"
                time={time}
                duration={duration}
                onTimeChange={setTime}
                onDurationChange={setDuration}
              />
              <Checkbox.Item
                label={`${
                  isSwitchOn ? "Регулярная прогулка" : "Разовая прогулка"
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
                    { label: "ПН" },
                    { label: "ВТ" },
                    { label: "СР" },
                    { label: "ЧТ" },
                    { label: "ПТ" },
                    { label: "СБ" },
                    { label: "ВС" },
                  ]}
                />
              ) : (
                <DateOrTimeRangePicker
                  mode="date"
                  date={date}
                  onDateChange={handleDateChange}
                />
              )}
            </View>

            <View className="mt-2">
              <CustomOutlineInputText
                label="Адрес"
                value={address}
                handleChange={setAddress}
              />
              <View className="pt-2" />
              <CustomOutlineInputText
                label="Описание"
                value={description}
                handleChange={setDescription}
                numberOfLines={3}
              />
            </View>

            {visiblePets.map((pet, index) => (
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
                  {showAllPets ? "Скрыть" : "Показать еще"}
                </Text>
              </Button>
            )}

            <View className="h-20 mt-4 ">
              <CustomLoadingButton title="Сохранить" handlePress={handleSave} />
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

import React, { ReactNode, useContext, useRef, useState } from "react";
import {
  View,
  Dimensions,
  Platform,
  StyleSheet,
  ImageSourcePropType,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Button, Text } from "react-native-paper";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import CustomButtonOutlined from "../custom/buttons/CustomButtonOutlined";
import * as ImagePicker from "expo-image-picker";
import { Avatar } from "@rneui/themed";
import { IUser } from "@/dtos/Interfaces/user/IUser";
import userStore from "@/stores/UserStore";
import { IPet } from "@/dtos/Interfaces/pet/IPet";
import CustomInputText from "../custom/inputs/CustomInputText";
import * as Crypto from "expo-crypto";
import { User } from "@/dtos/classes/user/UserDTO";
import CustomSegmentedButtons from "../custom/buttons/CustomSegmentedButtons";
import { router } from "expo-router";
import BottomSheetComponent from "../common/BottomSheetComponent";
import BottomSheet from "@gorhom/bottom-sheet";
import AvatarSelector from "../common/AvatarSelector";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { avatarsStringF, avatarsStringM } from "@/constants/Avatars";
import { BREEDS_TAGS } from "@/constants/Strings";
import CustomDropdownList from "../custom/selectors/CustomDropdownList";
import { setUserAvatarDependOnGender } from "@/utils/utils";
import { BonusContex } from "@/contexts/BonusContex";
import { useControl } from "@/hooks/useBonusControl";
import CustomTagsSelector from "../custom/selectors/CustomTagsSelector";
import { INTEREST_TAGS } from "@/constants/Strings";

const { width, height } = Dimensions.get("window");

interface OnBoardingProfileProps {
  onLanguageSelect: (language: number) => void;
  onComplete: (user: IUser) => void; // Добавляем функцию для завершения
}

const TASK_IDS = {
  userEdit: {
    user_name: 13,
    user_birthDate: 14,
    user_gender: 15,
    user_photo: 16,
    dog_name: 17,
    dog_breed: 18,
    dog_birthDate: 19,
    dog_gender: 20,
    dog_photo: 21,
  },
};

const OnBoardingProfile: React.FC<OnBoardingProfileProps> = ({
  onLanguageSelect,
  onComplete,
}) => {
  const user: User = userStore.currentUser!;
  const [editableUser, setEditableUser] = useState<User>(new User({ ...user }));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState("");
  const [gender, setGender] = useState(0);
  const [petGender, setPetGender] = useState(0);
  const [petName, setPetName] = useState("");
  const [age, setAge] = useState<Date>(new Date("2000-01-01T12:00:00"));
  const [petAge, setPetAge] = useState<Date>(new Date("2000-01-01T12:00:00"));

  const [showUserAge, setShowUserAge] = useState(false);
  const [showPetAge, setShowPetAge] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [petImage, setPetImage] = useState("");

  const carouselRef = useRef(null);

  const source: ImageSourcePropType | undefined = userImage
    ? { uri: userImage }
    : undefined;
  const sourcePet: ImageSourcePropType | undefined = petImage
    ? { uri: petImage }
    : undefined;

  const [selectedBreed, setSelectedBreed] = useState<number>(0);
  const sheetRef = useRef<BottomSheet>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [renderContent, setRenderContent] = useState<ReactNode>(() => null);

  const { completedJobs } = useContext(BonusContex)!;

  // Используем useControl для каждого поля
  useControl("user_name", editableUser.name, {
    id: TASK_IDS.userEdit.user_name,
    description: "user name",
  });
  useControl("user_birthDate", age, {
    id: TASK_IDS.userEdit.user_birthDate,
    description: "user birthDate",
  });
  useControl("user_gender", gender, {
    id: TASK_IDS.userEdit.user_gender,
    description: "user gender",
  });
  useControl("user_photo", source, {
    id: TASK_IDS.userEdit.user_photo,
    description: "user photo",
  });
  useControl("dog_name", petName, {
    id: TASK_IDS.userEdit.dog_name,
    description: "dog name",
  });
  useControl("dog_breed", selectedBreed, {
    id: TASK_IDS.userEdit.dog_breed,
    description: "dog breed",
  });
  useControl("dog_birthDate", petAge, {
    id: TASK_IDS.userEdit.dog_birthDate,
    description: "dog birthDate",
  });
  useControl("dog_gender", petGender, {
    id: TASK_IDS.userEdit.dog_gender,
    description: "dog gender",
  });
  useControl("dog_photo", sourcePet, {
    id: TASK_IDS.userEdit.dog_photo,
    description: "dog photo",
  });

  const handleIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const onAgeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined
  ) => {
    setShowUserAge(Platform.OS === "ios");
    if (selectedDate) {
      setAge(selectedDate);
    }
  };

  const onPetAgeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined
  ) => {
    setShowPetAge(Platform.OS === "ios");
    if (selectedDate) setPetAge(selectedDate);
    console.log(selectedDate);
  };

  const showUserDatepicker = () => {
    setShowUserAge(true);
  };

  const showPetDatepicker = () => {
    setShowPetAge(true);
  };

  const handleChange = (field: keyof User, value: any) => {
    setEditableUser({ ...editableUser, [field]: value });
  };

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      (carouselRef.current as any)?.scrollTo({
        index: nextIndex,
        animated: true,
      });
    }

    if (currentIndex === data.length - 1) {
      const currentUser = userStore.currentUser;

      const newPetProfile: Partial<IPet> = {
        id: Crypto.randomUUID(),
        petName: petName,
        breed: selectedBreed,
        birthDate: petAge,
        gender: petGender,
        userId: currentUser!.id,
        thumbnailUrl: petImage,
      };

      currentUser!.name = name;
      currentUser!.gender = gender;
      currentUser!.birthDate = age;
      if (userImage === "" || userImage === null || userImage === undefined) {
        const newAvatar = SetRandomAvatarDependOnGender();
        userStore.fetchImageUrl(newAvatar).then((resp) => {
          if (resp) {
            console.log("resp", resp);
            currentUser.thumbnailUrl = resp;
          }
          currentUser!.petProfiles = [newPetProfile as IPet];
          currentUser.jobs = completedJobs;
          // Продолжает выполнение onComplete после получения результата
          onComplete(currentUser as IUser);
        });
      } else {
        currentUser.thumbnailUrl = userImage;
        currentUser!.petProfiles = [newPetProfile as IPet];
        currentUser.jobs = completedJobs;
        onComplete(currentUser as IUser);
      }
      router.replace("/screenholder");
    }
  };

  const handleLanguageSelection = (language: number) => {
    onLanguageSelect(language);
    handleNext(); // Переключение на следующий слайд после выбора языка
  };

  const SetUserImage = async () => {
    userStore.setUserImage().then((resp) => {
      if (resp) {
        setUserImage(resp);
      }
    });
  };

  const SetRandomAvatarDependOnGender = () => {
    return setUserAvatarDependOnGender(user);
  };

  const SetPetImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPetImage(result.assets[0].uri);
    }
  };

  const handleGenderChange = (value: number) => {
    setGender(value);
  };

  const handlePetGenderChange = (value: number) => {
    setPetGender(value);
  };

  const handleSheetClose = () => {
    setIsSheetVisible(false);
    sheetRef.current?.close();
  };

  const handleAvatarSelect = (avatar: number, isMail: boolean) => {
    const userAv = isMail ? avatarsStringM[avatar] : avatarsStringF[avatar];
    userStore.fetchImageUrl(userAv).then((resp) => {
      if (resp) {
        setUserImage(resp);
        sheetRef.current?.close();
      }
    });
  };

  const handleEscape = async () => {
    router.replace("/screenholder");
    const currentUser = userStore.currentUser!;
    currentUser.gender = 0;
    if (userImage === "" || userImage === null || userImage === undefined) {
      const newAvatar = SetRandomAvatarDependOnGender();

      const resp = await userStore.fetchImageUrl(newAvatar);
      if (resp) {
        console.log("resp", resp);
        currentUser.thumbnailUrl = resp;
      }
    } else currentUser.thumbnailUrl = userImage;
    //router.replace('/(tabs)/map');

    onComplete(currentUser);
  };

  const handleSheetOpen = () => {
    setIsSheetVisible(true);
    setRenderContent(() => (
      <AvatarSelector onAvatarSelect={handleAvatarSelect} />
    ));
    sheetRef.current?.expand();
  };

  const data = [
    {
      id: 1,
      content: (
        <View style={styles.contentContainer}>
          <Image
            source={require("@/assets/images/onboardingProfile/1lang.webp")}
            className="h-[60%]"
            resizeMode="center"
          />
          <Text className="text-lg font-nunitoSansBold text-center">
            Добро пожаловать в PetMap!
          </Text>
          <Text className=" leading-tight text-md font-nunitoSansRegular text-center">
            Выберите язык приложения, чтобы мы могли лучше понимать друг друга.
          </Text>
          <CustomButtonOutlined
            title="Английский"
            handlePress={() => handleLanguageSelection(2)}
            containerStyles="mt-4 w-full min-h-[42px] bg-[#2F00B6]"
            textStyles="text-white"
          />
          <CustomButtonOutlined
            title="Испанский"
            handlePress={() => handleLanguageSelection(0)}
            containerStyles="mt-4 w-full min-h-[42px] bg-[#2F00B6]"
            textStyles="text-white"
          />
          <CustomButtonOutlined
            title="Русский"
            handlePress={() => handleLanguageSelection(1)}
            containerStyles="mt-4 w-full min-h-[42px] bg-[#2F00B6]"
            textStyles="text-white"
          />
        </View>
      ),
    },
    {
      id: 2,
      content: (
        <View className="w-full justify-center items-center ">
          <Image
            source={require("@/assets/images/onboardingProfile/2start.webp")}
            className="h-[80%]"
            resizeMode="center"
          />
          <Text className="px-4 leading-tight text-[18px] font-nunitoSansBold text-center mb-1">
            Начните настройку профиля прямо сейчас
          </Text>
          <Text className=" text-md font-nunitoSansRegular text-center">
            И получите первые бонусы, после прохождения регистрации, чтобы
            обменять их на подарки
          </Text>
        </View>
      ),
    },
    {
      id: 3,
      content: (
        <View className="items-center w-full h-full justify-center">
          {source ? (
            <Avatar
              source={source}
              rounded
              size={200}
              containerStyle={{
                backgroundColor: "#BDBDBD",
                marginTop: 10,
                borderColor: "white",
                borderWidth: 3,
                shadowColor: "black",
                elevation: 4,
              }}
              icon={{ name: "user", type: "font-awesome", color: "white" }}
            />
          ) : (
            <Image
              source={require("@/assets/images/onboardingProfile/3user.webp")}
              className="h-[40%]"
              resizeMode="center"
            />
          )}
          <Text className="px-4 leading-tight text-[18px] font-nunitoSansBold text-center my-2">
            Расскажите немного о себе
          </Text>
          <Text className="text-md font-nunitoSansRegular text-center">
            Ваш профиль будет отображаться другим пользователям с питомцами.
          </Text>
          <CustomInputText
            // placeholder="Как тебя зовут?"
            value={name}
            handleChange={setName}
            containerStyles="my-4"
            labelInput="Как вас зовут?"
          />

          <View className="flex-row items-start justify-between">
            <CustomInputText
              // placeholder="Дата рождения"
              labelInput="Дата рождения"
              value={age ? age.toLocaleDateString("en-US") : ""}
              handleClick={showUserDatepicker}
              handleChange={showUserDatepicker}
              containerStyles="w-1/2 pr-2 mb-2"
            />
            {showUserAge && (
              <DateTimePicker
                value={age}
                mode="date"
                display="spinner"
                onChange={onAgeChange}
              />
            )}
            <CustomSegmentedButtons
              containerStyles="w-[50%] mt-[6px]"
              value={gender}
              onValueChange={handleGenderChange}
            />
          </View>
          <View className="flex-row justify-between">
            <CustomButtonOutlined
              title="Загрузить фото"
              handlePress={SetUserImage}
              containerStyles="mr-1 w-1/2 bg-indigo-700 text-white"
              textStyles="text-white"
            />
            <CustomButtonOutlined
              title="Выбрать аватар"
              handlePress={handleSheetOpen}
              containerStyles="ml-1 w-1/2"
            />
          </View>
        </View>
      ),
    },
    {
      id: 4,
      content: (
        <View className="items-center w-full h-full justify-center">
          {sourcePet ? (
            <Avatar
              source={sourcePet}
              rounded
              size={200}
              containerStyle={{
                backgroundColor: "#BDBDBD",
                marginTop: 20,
                borderColor: "white",
                borderWidth: 3,
                shadowColor: "black",
                elevation: 4,
              }}
              icon={{ name: "dog", type: "font-awesome-5", color: "white" }}
            />
          ) : (
            <Image
              source={require("@/assets/images/onboardingProfile/4pet.webp")}
              className="h-[40%]"
              resizeMode="center"
            />
          )}
          <Text className="px-4 leading-tight text-[18px] font-nunitoSansBold text-center my-2">
            Настройте профиль своего питомца
          </Text>
          <Text className="text-md font-nunitoSansRegular text-center mb-4">
            Профиль питомца будет доступен другим пользователям при отклике на
            прогулку.
          </Text>

          <CustomInputText
            labelInput="Имя"
            value={petName}
            handleChange={setPetName}
            containerStyles="-mb-2"
          />
          <View className="pb-2">
            <CustomDropdownList
              tags={BREEDS_TAGS}
              label=""
              placeholder="Порода"
              initialSelectedTag={selectedBreed}
              onChange={(v) => setSelectedBreed(v as number)}
              searchable={true}
              listMode="MODAL"
            />
          </View>

          <View className="flex-row items-start ">
            <CustomInputText
              labelInput="Дата рождения"
              value={petAge ? petAge.toLocaleDateString("en-US") : ""}
              handleClick={showPetDatepicker}
              handleChange={showPetDatepicker}
              containerStyles="w-[55%]  mb-2"
            />
            {showPetAge && (
              <DateTimePicker
                value={petAge}
                mode="date"
                display="spinner"
                onChange={onPetAgeChange}
              />
            )}
            <CustomSegmentedButtons
              containerStyles="ml-2 w-[43%] mt-[6px]"
              value={petGender}
              onValueChange={handlePetGenderChange}
              showNAButton={false}
            />
          </View>
          <CustomButtonOutlined
            title="Загрузить фото"
            handlePress={SetPetImage}
            containerStyles="w-full  bg-[#2F00B6]"
            textStyles="text-white"
          />
        </View>
      ),
    },
    {
      id: 5,
      content: (
        <ScrollView>
          <View className="items-center w-full h-full justify-start">
            <Text className="text-lg font-nunitoSansBold text-center my-2 mt-10">
              Выберите темы, которые вам интересны
            </Text>
            <Text className=" leading-tight text-md font-nunitoSansRegular text-center mb-4">
              Это поможет в настройке системы по подбору персонального контента.
            </Text>
            <CustomTagsSelector
              tags={INTEREST_TAGS}
              initialSelectedTags={[]}
              //  onSelectedTagsChange={(interests) => handleFieldChange('interests', interests)}
              maxSelectableTags={20}
            />
          </View>
        </ScrollView>
      ),
    },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 h-full">
        <View className="mt-6 mr-6 flex items-end">
          <TouchableOpacity
            onPress={() => {
              router.replace("/map");
            }}
          >
            <Text className="text-md font-nunitoSansBold">Пропустить</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={[{ key: "carousel" }]}
          renderItem={() => (
            <View style={styles.container}>
              <Carousel
                ref={carouselRef}
                width={width}
                height={height - 100}
                data={data}
                pagingEnabled={true}
                loop={false}
                enabled={false} // отключение скрола
                // onProgressChange={(_, absoluteProgress) => {
                //   handleIndex(Math.round(absoluteProgress));
                // }}  // эта функция работает не корректно на пагинации
                onSnapToItem={(index) => setCurrentIndex(index)}
                renderItem={({ item }) => (
                  <View style={styles.carouselItemContainer}>
                    {item.content}
                  </View>
                )}
              />
              <View style={styles.bottomNavigationContainer}>
                <Button
                  onPress={() => {
                    (carouselRef.current as any)?.scrollTo({
                      index: currentIndex - 1,
                      animated: true,
                    });
                  }}
                  style={styles.navigationButton}
                >
                  <Text className="font-nunitoSansBold text-black">
                    {currentIndex === 0 ? "" : "Назад"}
                  </Text>
                </Button>
                <View style={styles.indicatorContainer}>
                  {data.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        currentIndex === index
                          ? styles.activeIndicator
                          : styles.inactiveIndicator,
                      ]}
                    />
                  ))}
                </View>
                <Button onPress={handleNext} style={styles.navigationButton}>
                  <Text className="font-nunitoSansBold text-black">
                    {currentIndex === data.length - 1 ? "Завершить" : "Далее"}
                  </Text>
                </Button>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.key}
        />
        {isSheetVisible && (
          <BottomSheetComponent
            ref={sheetRef}
            snapPoints={["60%", "100%"]}
            renderContent={() => renderContent}
            onClose={handleSheetClose}
            enablePanDownToClose={true}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  titleText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  textInput: {
    backgroundColor: "white",
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 50,

    elevation: 2,
    fontSize: 18,
    marginBottom: 20,
  },
  dropdownContainer: {
    width: "100%",
    marginTop: 10,
  },
  dropdownButton: {
    width: "55%",
    height: 45,
    backgroundColor: "#FFF",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "lightgray",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingRight: 5,
  },
  dropdownButtonText: {
    color: "#111827",
    opacity: 0.7,
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  dropdown: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginTop: -20,
    height: 230,
  },
  dropdownItem: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#444",
  },
  carouselItemContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  bottomNavigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 20,
    marginTop: -10,
  },
  navigationButton: {
    width: 130,
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: "#2F00B6",
  },
  inactiveIndicator: {
    backgroundColor: "#D9CBFF",
  },
});

export default OnBoardingProfile;

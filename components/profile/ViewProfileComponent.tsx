import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  StyleSheet,
  Platform
} from "react-native";
import {
  Text,
  Card,
  Divider,
  IconButton,
  Menu,
  PaperProvider,
} from "react-native-paper";
import { observer } from "mobx-react-lite";
import userStore from "@/stores/UserStore";
import BottomSheetComponent from "../common/BottomSheetComponent";
import {
  FlatList,
  GestureHandlerRootView,
  RefreshControl,
  ScrollView,
} from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomTextComponent from "../custom/text/CustomTextComponent";
import CustomTagsSelector from "../custom/selectors/CustomTagsSelector";
import {
  calculateDogAge,
  calculateHumanAge,
  getTagsByIndex,
} from "@/utils/utils";
import CustomSocialLinkInput from "../custom/text/SocialLinkInputProps";
import { router } from "expo-router";
import petStore from "@/stores/PetStore";
import {
  petUriImage
} from "@/constants/Strings";
import { User } from "@/dtos/classes/user/UserDTO";
import { IUser } from "@/dtos/Interfaces/user/IUser";
import AddCard from "../custom/buttons/AddCard";
import MenuItemWrapper from "../custom/menuItem/MunuItemWrapper";
import { shortenName } from "@/utils/utils";
import i18n from "@/i18n";
import { lightBlue100 } from "react-native-paper/lib/typescript/styles/themes/v2/colors";


const ViewProfileComponent = observer(
  ({
    onEdit,
    onPetOpen,
    loadedUser,
  }: {
    onEdit: () => void;
    onPetOpen: (petId: string) => void;
    loadedUser: IUser;
  }) => {
    const [user, setUser] = useState<IUser>(loadedUser);
    const sheetRef = useRef<BottomSheet>(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [rightIcon, setRightIcon] = useState<string | null>()
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
      setIsIOS(Platform.OS === "ios");
    }, []);

    const loadData = async () => {
      if (user.id === userStore.currentUser?.id) {
        // Загружаем текущего пользователя
        console.log("Загружаем текущего пользователя");
        const user = await userStore.loadUser();
        //console.log(user.thumbnailUrl);
        setUser(user!);
        setIsCurrentUser(true);
        setRightIcon("chevron-right");
      } else {
        // Загружаем другого пользователя
        if (!loadedUser.id) {
          console.log("Пользователь не найден");
          return;
        }
        const otherUser = await userStore.getUserById(loadedUser.id);
        setUser(otherUser as User);
        setIsCurrentUser(false);
        setRightIcon(null);
      }
    };

    useEffect(() => {
      loadData();
    }, [])

    const handleRefresh = async () => {
      setRefreshing(true);
      await loadData(); // Обновляем данные
      setRefreshing(false); // Отключаем индикатор обновления
    };

    const openMenu = () => setMenuVisible(true);

    const closeMenu = () => setMenuVisible(false);

    const logOut = () => {
      closeMenu();
      userStore.signOut();
      router.replace("/(auth)/sign-in");
    };

    const handleAddPet = () => {
      const newPat = petStore.getEmptyPetProfile("new", user.id);
      petStore.setPetProfile(newPat);
      router.push("/profile/pet/new/edit");
    };

    const openChat = () => {

    }
    
    return (
      <GestureHandlerRootView className="h-full">
      
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#6200ee"]}
              />
            }
          >
            <View style={{ alignItems: "center" }}>
              <StatusBar backgroundColor="transparent" translucent />
              <View className="relative w-full aspect-square">
                <Image
                  source={{ uri: user?.thumbnailUrl! }}
                  className="w-full h-full"
                />
               {!isCurrentUser && (<View style={styles.iconContainer}>
                  <IconButton
                    icon="message"
                    size={30}
                    iconColor="black"
                    style={styles.menuButton}
                    onPress={openChat}/>
                </View>)}
                <View style={styles.iconContainer} className={`${isIOS ? 'mt-7' : 'mt-0'}`}>
                  {isCurrentUser && (
                    <Menu
                    style={{ marginTop: 25 }}
                      visible={menuVisible}
                      onDismiss={closeMenu}
                     
                      anchor={
                        <IconButton
                          icon="menu"
                          size={30}
                          iconColor="black"
                          style={styles.menuButton}
                          onPress={openMenu}
                        />
                      }
                    >
                      <MenuItemWrapper
                        onPress={onEdit}
                        title={i18n.t('UserProfile.edit')}
                        icon="pencil-outline"
                      />
                      <MenuItemWrapper
                        onPress={logOut}
                        title={i18n.t('UserProfile.logout')}
                        icon="exit-to-app"
                      />
                    </Menu>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
     
        <BottomSheetComponent
          ref={sheetRef}
          enablePanDownToClose={false}
          snapPoints={["60%", "100%"]}
          renderContent={
            <View className="bg-white h-full">
              <Text className="pl-5 text-2xl font-nunitoSansBold">
                {user.name}
                {", "}
                {calculateHumanAge(user.birthDate)}
              </Text>
              <FlatList
                horizontal={true}
                data={user.petProfiles}
                keyExtractor={(item, index) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ alignItems: "center" }}
                    onPress={() => onPetOpen(item.id)}
                  >
                    <Card className="w-[180px] h-[260px] p-2 m-2 rounded-2xl shadow bg-purple-100">
                      <Card.Cover
                        source={{ uri: item.thumbnailUrl || petUriImage }}
                        style={{ height: 150, borderRadius: 14 }}
                      />
                      <Text className="block font-nunitoSansBold text-lg mt-1 mb-[-8px] leading-5"  numberOfLines = { 1 } ellipsizeMode = 'tail'>
                        {shortenName(item.petName)}, {calculateDogAge(item.birthDate)}
                      </Text>
                      {/* <Text className="block font-nunitoSansBold text-lg mb-auto">
                        {calculateDogAge(item.birthDate)}
                      </Text> */}

                      <View style={{ marginTop: 12 }}>
                        <Text className="font-nunitoSansRegular" numberOfLines = { 2 } ellipsizeMode = 'tail' >
                          {getTagsByIndex(i18n.t("tags.breeds") as string[], item.breed!)}
                        </Text>
                        <Text className="font-nunitoSansRegular">
                          {getTagsByIndex(i18n.t("tags.petGender") as string[], Number(item.gender))}
                          , {item.weight} kg
                        </Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                )}
                ListFooterComponent={() =>
                  isCurrentUser ? (
                    <AddCard
                      buttonText={i18n.t('UserProfile.addPet')}
                      onPress={handleAddPet}
                    />
                  ) : null
                }
              />

              <View className="pr-3 pl-4">
                <View>
               
                  <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">
                    {i18n.t('UserProfile.aboutMe')}
                  </Text>
                  <CustomTextComponent
                    text={user.description}
                    rightIcon={rightIcon}
                    onRightIconPress={onEdit}
                    enableTranslation={true}
                  />
                  <Divider />
                </View>
                <View>
                  <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">
                    {i18n.t('UserProfile.interests')}
                  </Text>
                  <CustomTagsSelector
                    tags={i18n.t("tags.interests") as string[]}
                    initialSelectedTags={user.interests!}
                    maxSelectableTags={5}
                    readonlyMode={true}
                    visibleTagsCount={10}
                  />
                  <Divider className="mt-3" />
                </View>
                <View>
                  <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">
                    {i18n.t('UserProfile.mainInfo')}
                  </Text>
                  <CustomTextComponent
                    text={user.location}
                    leftIcon="location-pin"
                    iconSet="simpleLine"
                    rightIcon={rightIcon}
                    onRightIconPress={onEdit}
                  />
                  <CustomTextComponent
                    text={getTagsByIndex(i18n.t("tags.languages") as string[], user.userLanguages!)}
                    leftIcon="language-outline"
                    iconSet="ionicons"
                    rightIcon={rightIcon}
                    onRightIconPress={onEdit}
                  />
                  <CustomTextComponent
                    text={getTagsByIndex(i18n.t("tags.professions") as string[], user.work!)}
                    leftIcon="work-outline"
                    rightIcon={rightIcon}
                    onRightIconPress={onEdit}
                  />
                  <CustomTextComponent
                    text={user.education}
                    leftIcon="school-outline"
                    iconSet="ionicons"
                    rightIcon={rightIcon}
                    onRightIconPress={onEdit}
                  />
                  <Divider className="mt-3" />
                </View>
                <View>
                  <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">
                    {i18n.t('UserProfile.socialMedia')}
                  </Text>
                  <CustomSocialLinkInput
                    text={user.instagram!}
                    leftIcon="instagram"
                    iconSet="fontAwesome"
                    rightIcon={rightIcon}
                    onRightIconPress={onEdit}
                    platform={"instagram"}
                  />
                  <CustomSocialLinkInput
                    text={user.facebook!}
                    leftIcon="facebook"
                    iconSet="fontAwesome"
                    rightIcon={rightIcon}
                    onRightIconPress={onEdit}
                    platform={"facebook"}
                  />
                  <Divider className="mt-3" />
                </View>

                </View>
              <View className="h-28" />
            </View>
          }
        />
      </GestureHandlerRootView>
    );
  }
);

export default ViewProfileComponent;

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  iconContainer: {
    position: "absolute",
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 8,
    right: 8,
  },
  menuButton: {
    backgroundColor: "white",   
  },
});

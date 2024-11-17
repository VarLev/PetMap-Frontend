import React, { useState } from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import { Button, List, Switch, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/Images";
import userStore from "@/stores/UserStore";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import { useDrawer } from "@/contexts/DrawerProvider";
import { AntDesign, Feather } from "@expo/vector-icons";
import CustomListItemWrapper from "@/components/custom/menuItem/ListItemWrapper";


const SidebarUserProfileComponent = () => {
  const [sosEnabled, setSosEnabled] = useState(false);
  const currentUser = userStore.currentUser;
  const { closeDrawer } = useDrawer();

  const handleToggleSos = () => setSosEnabled(!sosEnabled);

  const handleProfilePress = () => {
    router.replace("/profile");
    closeDrawer();
  };

  const handleJobPress = () => {
    router.replace("/profile/myjobs");
    closeDrawer();
  };

  const handleWalksPress = () => {
    router.replace("/profile/mywalks");
    closeDrawer();
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-1 p-5 bg-white">
        <View className="flex-row">
          <Image
            source={images.logoWithName}
            style={{ width: 175, height: 43 }}
          />
        </View>

        <TouchableRipple
          className="w-full mt-6"
          rippleColor="#E8DFFF"
          onPress={handleProfilePress}
        >
          <View className="flex-row justify-start items-center">
            <Image
              source={{ uri: currentUser?.thumbnailUrl! }}
              className="h-20 w-20 rounded-xl"
            />
            <View className="flex-col ml-3 flex-1">
              <Text className="text-xl text-gray-800 font-nunitoSansBold">
                {currentUser?.name && currentUser.name.length > 31
                  ? `${(currentUser.name as string).slice(0, 31)}...`
                  : currentUser?.name ?? "Анонимный пользователь"}
              </Text>
              <Text className="-mt-1 text-gray-800 font-nunitoSansRegular">
                {currentUser?.email}
              </Text>
              <Text className="mt-1 text-indigo-800 font-nunitoSansBold">
                Открыть профиль
              </Text>
            </View>
          </View>
        </TouchableRipple>
        <TouchableRipple
          className="w-full mt-4 justify-center items-center  "
          onPress={handleProfilePress}
        >
          <View className="h-9 w-full  flex-row justify-center items-center">
            <Image source={images.bonuse} className="h-8 w-8" />
            <View className="flex-col ml-3">
              <Text className="text-xl text-gray-800 font-nunitoSansBold">
                {currentUser?.balance}
              </Text>
            </View>
          </View>
        </TouchableRipple>

        {/* Подписка */}
        <View className="flex-row mt-4  content-center items-center">
          <Button
            icon={() => (
              <FontAwesome
                name="diamond"
                size={20}
                className="bg-indigo-800"
                color="#8F00FF"
              />
            )}
          >
            <Text className="font-nunitoSansBold">Подписка</Text>
          </Button>
          <Button
            mode="elevated"
            className="bg-purple-100 text-xs rounded-3xl text-indigo-800"
            onPress={() => console.log("7 дней бесплатно")}
          >
            <Text className="font-nunitoSansBold">Подписаться</Text>
          </Button>
        </View>

        {/* Меню */}
        <List.Section>
          <CustomListItemWrapper
            title="Задания и бонусы"
            leftIcon={() => (
              <List.Icon
                icon={() => (
                  <AntDesign name="staro" size={20} color="#474747" />
                )}
              />
            )}
            onPress={handleJobPress}
          />
          <CustomListItemWrapper
            title="Мои прогулки"
            leftIcon={() => (
              <List.Icon
                icon={() => <Feather name="users" size={20} color="#474747" />}
              />
            )}
            onPress={handleWalksPress}
          />

          <CustomListItemWrapper
            onPress={() => console.log("Мои локации")}
            title="Мои локации"
            leftIcon={() => (
              <List.Icon
                icon={() => (
                  <Feather name="map-pin" size={20} color="#474747" />
                )}
              />
            )}
          />

          <CustomListItemWrapper
            title="Мои объявления"
            leftIcon={() => (
              <List.Icon
                icon={() => (
                  <Feather name="briefcase" size={20} color="#474747" />
                )}
              />
            )}
            onPress={() => console.log("Мои объявления")}
          />
          <CustomListItemWrapper
            title="Настройки"
            leftIcon={() => (
              <List.Icon
                icon={() => (
                  <AntDesign name="setting" size={20} color="#474747" />
                )}
              />
            )}
            onPress={() => console.log("Настройки")}
          />
          <View className="pl-2">
            <List.Item
              title="SOS Оповещения"
              left={() => (
                <List.Icon
                  icon={() => <Feather name="bell" size={20} color="#474747" />}
                />
              )}
              right={() => (
                <Switch value={sosEnabled} onValueChange={handleToggleSos} />
              )}
              titleStyle={{ fontFamily: "NunitoSans_400Regular" }}
            />
          </View>

          <CustomListItemWrapper
            title="Поддержка"
            leftIcon={() => (
              <List.Icon
                icon={() => (
                  <Feather name="help-circle" size={20} color="#474747" />
                )}
              />
            )}
            onPress={() => console.log("Поддержка")}
          />
        </List.Section>
      </View>
    </SafeAreaView>
  );
};

export default SidebarUserProfileComponent;

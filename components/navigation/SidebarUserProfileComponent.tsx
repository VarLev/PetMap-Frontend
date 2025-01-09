import React from "react";
import { View, Text, Image, Platform } from "react-native";
import { Button, List, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/Images";
import userStore from "@/stores/UserStore";
import { router } from "expo-router";
import { useDrawer } from "@/contexts/DrawerProvider";
import { AntDesign, Feather } from "@expo/vector-icons";
import CustomListItemWrapper from "@/components/custom/menuItem/ListItemWrapper";
import i18n from "@/i18n";
import DismissibleBanner from "../ads/DismissibleBanner";
import { BannerAdSize } from "react-native-google-mobile-ads";

const SidebarUserProfileComponent = () => {
  const currentUser = userStore.currentUser;
  const hasSubscription = userStore.getUserHasSubscription();
  const { closeDrawer } = useDrawer();

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

  const handleSettingsPress = () => {
    router.replace("/profile/settings");
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
          <Text className="font-nunitoSansBold">v0.0.7</Text>
        </View>

        <TouchableRipple
          className="w-full mt-6"
          rippleColor={Platform.OS === "ios" ? "rgba(0,0,0,0.1)" : "#E8DFFF"}
          onPress={handleProfilePress}
        >
          <View className="flex-row justify-start items-center">
          <View className="relative">
            <Image
              source={{ uri: currentUser?.thumbnailUrl ?? 'https://avatar.iran.liara.run/public' }}
              className="h-20 w-20 rounded-xl"
            />
            {hasSubscription && (<Image
              source={require('@/assets/images/subscription-marker.png')}
              className="h-7 w-5 absolute -bottom-2 right-1"
            />)}
           
          </View>
            <View className="flex-col ml-3 flex-1">
              <Text
                className="text-xl text-gray-800 font-nunitoSansBold"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {currentUser?.name
                  ? currentUser?.name
                  : i18n.t("Sidebar.anonymousUser")}
              </Text>
              <Text
                className="-mt-1 text-gray-800 font-nunitoSansRegular"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {currentUser?.email}
              </Text>
              <Text
                className="mt-1 text-indigo-800 font-nunitoSansBold"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {i18n.t("Sidebar.openProfile")}
              </Text>
            </View>
          </View>
        </TouchableRipple>
        <TouchableRipple
          className="w-full mt-4 justify-center items-center  "
          onPress={handleProfilePress}
        >
          <View className="h-9 w-full flex-row justify-center items-center">
            <Image source={images.bonuse} className="h-8 w-8" />
            <View className="flex-col ml-3">
              <Text
                className="text-xl text-gray-800 font-nunitoSansBold"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {currentUser?.balance}
              </Text>
            </View>
          </View>
        </TouchableRipple>
       

        {/* Подписка */}
        {/* <View className="flex-row mt-4 content-center items-center">
          <Button
            icon={() => (
              <FontAwesome
                name="diamond"
                size={20}
                color="#8F00FF"
              />
            )}
          >
            <Text
              className="font-nunitoSansBold"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {i18n.t("Sidebar.subscription")}
            </Text>
          </Button>
          <Button
            mode="elevated"
            className="bg-purple-100 text-xs rounded-3xl text-indigo-800"
            onPress={() => console.log(i18n.t("Sidebar.freeTrial"))}
          >
            <Text
              className="font-nunitoSansBold"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {i18n.t("Sidebar.subscribe")}
            </Text>
          </Button>
        </View> */}

        {/* Меню */}
        <List.Section>
          <CustomListItemWrapper
            title={i18n.t("Sidebar.tasksAndBonuses")}
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
            title={i18n.t("Sidebar.myWalks")}
            leftIcon={() => (
              <List.Icon
                icon={() => <Feather name="users" size={20} color="#474747" />}
              />
            )}
            onPress={handleWalksPress}
          />
          {/* <CustomListItemWrapper
            onPress={() => console.log(i18n.t("Sidebar.myLocations"))}
            title={i18n.t("Sidebar.myLocations")}
            leftIcon={() => (
              <List.Icon
                icon={() => (
                  <Feather name="map-pin" size={20} color="#474747" />
                )}
              />
            )}
          /> */}
          <CustomListItemWrapper
            title={i18n.t("Sidebar.settings")}
            leftIcon={() => (
              <List.Icon
                icon={() => (
                  <AntDesign name="setting" size={20} color="#474747" />
                )}
              />
            )}
            onPress={handleSettingsPress}
          />
          {/* <CustomListItemWrapper
            title={i18n.t("Sidebar.support")}
            leftIcon={() => (
              <List.Icon
                icon={() => (
                  <Feather name="help-circle" size={20} color="#474747" />
                )}
              />
            )}
            onPress={() => console.log(i18n.t("Sidebar.support"))}
          /> */}
        </List.Section>
        {userStore.getUserHasSubscription() && <DismissibleBanner adSize={BannerAdSize.LARGE_BANNER} />}
      </View>
    </SafeAreaView>
  );
};

export default SidebarUserProfileComponent;
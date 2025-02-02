import React, { useState } from "react";
import { View, Text, Image, Platform } from "react-native";
import { Divider, IconButton, List, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/Images";
import userStore from "@/stores/UserStore";
import { router } from "expo-router";
import { useDrawer } from "@/contexts/DrawerProvider";
import { AntDesign, Feather, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import CustomListItemWrapper from "@/components/custom/menuItem/ListItemWrapper";
import i18n from "@/i18n";
import DismissibleBanner from "../ads/DismissibleBanner";
import { BannerAdSize } from "react-native-google-mobile-ads";
import SupportAlert from "../custom/alert/SupportAlert";

const SidebarUserProfileComponent = () => {
  const [alertVisible, setAlertVisible] = useState(false);
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

  const handleSupportPress = () => {
    setAlertVisible(true);
    closeDrawer();
  };

  const handleShalterPress = () => {
    router.replace("/profile/petShelters");
    closeDrawer();
  };


  const handleMarkerPress = () => {
    router.replace("/profile/mymarkers");
    closeDrawer();
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-1 p-5 bg-white">
        <View className="flex-row">

          <Image
            source={images.logoWithName}
            style={{ width: 175, height: 43 }}
          />
          <Text className="font-nunitoSansBold">v0.1.2</Text>
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
              <TouchableRipple
                className="w-full"
                onPress={handleJobPress}
              >
                <View className=" w-full flex-row items-center">
                  <Image source={images.bonuse} className="h-5 w-5" />
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
            </View>
          </View>
        </TouchableRipple>

        {!userStore.getUserHasSubscription() && <TouchableRipple className="w-full mt-0" rippleColor={Platform.OS === "ios" ? "rgba(0,0,0,0.1)" : "#E8DFFF"} onPress={() => router.push('/(paywall)/pay')}>
          <View className="flex-row items-center">
            <IconButton className='-ml-2' size={20} icon={() => <FontAwesome name="diamond" size={20} color="#8F00FF" />} onPress={() => router.push('/(paywall)/pay')} />
            <Text onPress={() => router.push('/(paywall)/pay')} className="font-nunitoSansRegular text-violet-600 text-base">{i18n.t("paywall.subscribe")}</Text>
          </View>
        </TouchableRipple>}




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
          <CustomListItemWrapper
            onPress={handleMarkerPress}
            title={i18n.t("Sidebar.myLocations")}
            leftIcon={() => (
              <List.Icon
                icon={() => (
                  <Feather name="map-pin" size={20} color="#474747" />
                )}
              />
            )}
          />
          <Divider />
          <CustomListItemWrapper
            title={i18n.t("Sidebar.shelter")}
            leftIcon={() => (
              <List.Icon
                icon={() => (
                  <Ionicons name="heart-outline" size={20} color="#474747" />
                )}
              />
            )}
            onPress={handleShalterPress}
          />

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
          <CustomListItemWrapper
            title={i18n.t("support.getSupport")}
            leftIcon={() => (
              <List.Icon
                icon={() => (
                  <MaterialIcons name="support-agent" size={20} color="#474747" />
                )}
              />
            )}
            onPress={handleSupportPress}
          />
          {/* <CustomListItemWrapper
            title={i18n.t("Sidear.support")}
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
        <SupportAlert
          isVisible={alertVisible}
          onClose={() => setAlertVisible(false)}
        />

        {!userStore.getUserHasSubscription() && <DismissibleBanner adSize={BannerAdSize.LARGE_BANNER} />}
      </View>
    </SafeAreaView>
  );
};

export default SidebarUserProfileComponent;
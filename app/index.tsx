import React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { Divider, IconButton, Icon, Text } from "react-native-paper";
import OnboardingCarousel from "../components/auth/OnboardingCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import CustomButtonPrimary from "@/components/custom/buttons/CustomButtonPrimary";
import { Redirect, router } from "expo-router";
import { useStore } from "@/contexts/StoreProvider";
import CustomButtonOutlined from "@/components/custom/buttons/CustomButtonOutlined";
import googleLogo from "../assets/images/google.png";
import facebookLogo from "../assets/images/facebook.png";
import appleLogo from "../assets/images/apple.png";

const App = () => {
  const { loading, isLogged, signOut } = useStore();
  signOut();
  console.log("User signed out");

  console.log(loading, isLogged);
  if (!loading && isLogged) return <Redirect href="/map" />;

  //return <Redirect href="/onboarding" />;

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="w-full h-full px-4 justify-center ">
          <View className="flex-row mt-2 items-start justify-center ">
            <Text
              variant="titleSmall"
              className="ml-0  text-xl font-nunitoSansBold mt-4 mb-2"
            >
              Добро пожаловать в PetMap!
            </Text>
          </View>
          <View className="flex-1 pt-2 justify-center items-center ">
            <OnboardingCarousel />
          </View>
          <View className="pt-1">
            <CustomButtonPrimary
              title="Регистрация"
              handlePress={() => router.push("/sign-up")}
              containerStyles="w-full"
            />
            <CustomButtonOutlined
              title="Уже есть аккаунт"
              handlePress={() => router.push("/sign-in")}
              containerStyles="w-full"
            />
          </View>
          <View className="flex-col justify-center items-center pt-3">
            <Text
              variant="titleSmall"
              className="text-sm font-nunitoSansRegular text-stone-400"
            >
              Другие способы входа
            </Text>
            <View className="flex-row justify-around mt-2 gap-x-4">
              <TouchableOpacity onPress={() => console.log("Pressed Google")}>
                <Image className="w-12 h-12" source={googleLogo} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Pressed Apple")}>
                <Image className="w-12 h-12" source={appleLogo} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Pressed Facebook")}>
                <Image className="w-12 h-12" source={facebookLogo} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

import React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { Text } from "react-native-paper";
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
import userStore from "@/stores/UserStore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import i18n from '@/i18n';

GoogleSignin.configure({
  webClientId: '938397449309-kqee2695quf3ai6ta2hmb82th9l9iifv.apps.googleusercontent.com', // Replace with your actual web client ID
});


const App = () => {
  const { loading, isLogged, signOut } = useStore();

  
  signOut();
  console.log("User signed out");

  console.log(loading, isLogged);
  if (!loading && isLogged) return <Redirect href="/map" />;

  //return <Redirect href="/onboarding" />;

 ;

  const handleGooglePress = async () => {
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId: '938397449309-kqee2695quf3ai6ta2hmb82th9l9iifv.apps.googleusercontent.com',
      offlineAccess: true,
    });
    console.log("Google Pressed");
    const signIn = await userStore.googleSingInUser();
    console.log(signIn);
    if (!signIn[0] && signIn[1])
      router.replace("/(auth)/onboarding");
    else if (signIn[0] && signIn[1])
      router.replace("/map");
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="w-full h-full px-4 justify-center">
          <View className="flex-row mt-2 items-start justify-center">
            <Text variant="titleSmall" className="ml-0 text-xl font-nunitoSansBold mt-4 mb-2">
              {i18n.t('index.welcome')} 
            </Text>
          </View>
          <View className="flex-1 pt-2 justify-center items-center">
            <OnboardingCarousel />
          </View>
          <View className="pt-1">
            <CustomButtonPrimary
              title={i18n.t('index.signUp')} 
              handlePress={() => router.push("/sign-up")}
              containerStyles="w-full"
            />
            <CustomButtonOutlined
              title={i18n.t('index.alreadyHaveAccount')} 
              handlePress={() => router.push("/sign-in")}
              containerStyles="w-full"
            />
          </View>
          <View className="flex-col justify-center items-center pt-3">
            <Text variant="titleSmall" className="text-sm font-nunitoSansRegular text-stone-400">
              {i18n.t('index.otherSignInMethods')}  
            </Text>
            <View className="flex-row justify-around mt-2 gap-x-4">
              <TouchableOpacity onPress={handleGooglePress}>
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

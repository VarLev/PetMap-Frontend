import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Image, Platform, StatusBar } from "react-native";
import { Text } from "react-native-paper";
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import OnboardingCarousel from "../components/auth/OnboardingCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButtonPrimary from "@/components/custom/buttons/CustomButtonPrimary";
import { Redirect, router } from "expo-router";
import { useStore } from "@/contexts/StoreProvider";
import CustomButtonOutlined from "@/components/custom/buttons/CustomButtonOutlined";
import googleLogo from "../assets/images/google.png";

import appleLogo from "../assets/images/apple.png";
import userStore from "@/stores/UserStore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import i18n from '@/i18n';
import ScreenHolderLogo from "@/components/common/ScreenHolderLogo";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAlert } from "@/contexts/AlertContext";
import AppOpenAdHandler from "@/components/ads/AppOpenAdHandler"; 
import { IUser } from "@/dtos/Interfaces/user/IUser";
import { UserStatus } from "@/dtos/enum/UserStatus";
import RevenueCatService from "@/services/RevenueCatService";
import { signInWithApple } from "@/firebaseConfig";


GoogleSignin.configure({
  webClientId: '938397449309-kqee2695quf3ai6ta2hmb82th9l9iifv.apps.googleusercontent.com', // Replace with your actual web client ID
});



const App = () => {
  const { loading, isLogged, isInitialized, isError, isUserJustRegistrated} = useStore();
  const { showAlert } = useAlert();
  const [adShown, setAdShown] = useState(true); // Проверка, показывали ли уже рекламу
  const [userHasSubscription, setUserHasSubscription] = useState(false); // Проверка на наличие подписки у пользователя

  // проверка, если платформа IOS, показываем иконку регистрации через Aple
  
  useEffect(() => {
    //setAdShown(userStore.getUserHasSubscription());

    (async () => {
      await RevenueCatService.initialize( process.env.EXPO_PUBLIC_REVENUECAT_API_KEY!);
      await RevenueCatService.setUserEmail(userStore.currentUser?.email??'');
    })();
    setUserHasSubscription(userStore.getUserHasSubscription());

    const checkAuthAndRedirect = async () => {
      if (isInitialized && adShown && !loading && userStore.getLogged() && !isUserJustRegistrated) {
        console.log("User is logged in");
        const currentUser = await userStore.getCurrentUser() as IUser;
        if(currentUser.userStatus === UserStatus.Onboarding)
          await router.replace("/(auth)/onboarding"); 
        else if(currentUser.userStatus === UserStatus.ReadyToGo)
          await router.replace("/search/news"); // Перенаправление на карту, если пользователь авторизован
      }
    };
   
    checkAuthAndRedirect();

    if (isError) {
      showAlert(
        i18n.t("index.error"),
        "OK",
        require("../assets/images/InternetError.webp")
      );
    }
  }, []);

   // Отображаем загрузочный экран до инициализации
  if (!isError && (loading || !isInitialized)) return <ScreenHolderLogo />;

  // Если есть ошибка и не инициализировано - редирект
  if (isError && !isInitialized) return <Redirect href="/" />;

  const handleGooglePress = async () => {
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId: '938397449309-kqee2695quf3ai6ta2hmb82th9l9iifv.apps.googleusercontent.com',
      offlineAccess: true,
    });
    const signIn = await userStore.googleSingInUser();
    if (!signIn[0] && signIn[1])
      router.replace("/(auth)/onboarding");
    else if (signIn[0] && signIn[1])
      router.replace("/search/news");
  }

  const handleApplePress = async () => {
    try {
      // Вызываем метод, который выполняет авторизацию через Apple с интеграцией Firebase
      const firebaseUserCredential = await signInWithApple();
      // Передаем полученные данные в логику авторизации вашего userStore
      const signIn = await userStore.appleSignInUser(firebaseUserCredential);
      
      if (!signIn[0] && signIn[1])
        router.replace("/(auth)/onboarding");
      else if (signIn[0] && signIn[1])
        router.replace("/search/news");
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        // Пользователь отменил вход
        console.log("Пользователь отменил вход через Apple");
      } else {
        console.error("Ошибка Apple Sign-In: ", error);
      }
    }
  };

  
  // Если у пользователя нет подписки и реклама еще не была показана, показываем AppOpenAdHandler
  if (!userHasSubscription && !adShown) {
    return <AppOpenAdHandler onAdComplete={() => setAdShown(true)} />;
  }

  //Если пользователь авторизован и всё инициализировано, редиректим на /search/news
  if (!isError && !loading && userStore.getLogged() && isInitialized && (adShown || userHasSubscription))
    return (userStore.currentUser?.userStatus === UserStatus.Onboarding ? <Redirect href="/(auth)/onboarding" />: <Redirect href="/search/news" />);


  return (
    <GestureHandlerRootView >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView className="bg-white h-full">
        <View className="w-full h-full px-4 justify-center ">
          <View className="flex-row mt-2 items-start justify-center">
            <Text variant="titleSmall" className="ml-0 text-xl font-nunitoSansBold mt-4 mb-2">
              {i18n.t('index.welcome')} 
            </Text>
          </View>
          <View className="justify-center items-center ">
            <OnboardingCarousel />
          </View>
          <View className="pt-8" >
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
              {Platform.OS === 'android' &&<TouchableOpacity onPress={handleGooglePress}>
                <Image className="w-12 h-12" source={googleLogo} />
              </TouchableOpacity>}
              {Platform.OS === 'ios' && <TouchableOpacity onPress={handleApplePress}>
                <Image className="w-12 h-12" source={appleLogo} />
              </TouchableOpacity>}
              {/* 
              <TouchableOpacity onPress={() => console.log("Pressed Facebook")}>
                <Image className="w-12 h-12" source={facebookLogo} />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;



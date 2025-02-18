import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Platform,
  StatusBar
} from 'react-native';
import { Text } from 'react-native-paper';
import OnboardingCarousel from '../components/auth/OnboardingCarousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButtonPrimary from '@/components/custom/buttons/CustomButtonPrimary';
import { Redirect, router } from 'expo-router';
import { useStore } from '@/contexts/StoreProvider';
import CustomButtonOutlined from '@/components/custom/buttons/CustomButtonOutlined';
import googleLogo from '../assets/images/google.png';
import appleLogo from '../assets/images/apple.png';
import userStore from '@/stores/UserStore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import i18n from '@/i18n';
import ScreenHolderLogo from '@/components/common/ScreenHolderLogo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAlert } from '@/contexts/AlertContext';
import AppOpenAdHandler from '@/components/ads/AppOpenAdHandler';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import { UserStatus } from '@/dtos/enum/UserStatus';
import RevenueCatService from '@/services/RevenueCatService';
import { signInWithApple } from '@/firebaseConfig';

// === Импорт аналитики ===
import { 
  logScreenView,
  logLogin,
  logSignUp,
  logLoginError,
} from '@/services/AnalyticsService';

GoogleSignin.configure({
  webClientId:
    '938397449309-kqee2695quf3ai6ta2hmb82th9l9iifv.apps.googleusercontent.com', 
});

const App = () => {
  const { loading, isLogged, isInitialized, isError, isUserJustRegistrated } = useStore();
  const { showAlert } = useAlert();
  const [adShown, setAdShown] = useState(true);
  const [userHasSubscription, setUserHasSubscription] = useState(false);

  useEffect(() => {
    // === Логируем открытие стартового экрана ===
    logScreenView("AppScreen");

    // Инициализация RevenueCat
    (async () => {
      const revenueCatKey =
        Platform.OS === 'android'
          ? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY
          : process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_APPLE;

      await RevenueCatService.initialize(revenueCatKey!);
      await RevenueCatService.setUserEmail(userStore.currentUser?.email ?? '');
    })();

    const hasSubscription = userStore.getUserHasSubscription();
    setUserHasSubscription(hasSubscription);

    const checkAuthAndRedirect = async () => {
      if (isInitialized && adShown && !loading && userStore.getLogged() && !isUserJustRegistrated) {
        const currentUser = (await userStore.getCurrentUser()) as IUser;
        if (currentUser.userStatus === UserStatus.Onboarding) {
          await router.replace('/(auth)/onboarding');
        } else if (currentUser.userStatus === UserStatus.ReadyToGo) {
          await router.replace('/search/news');
        }
      }
    };

    checkAuthAndRedirect();

    if (isError) {
      showAlert(i18n.t('index.error'), 'OK', require('../assets/images/InternetError.webp'));
    }
  }, []);

  if (!isError && (loading || !isInitialized)) {
    return <ScreenHolderLogo />;
  }

  if (isError && !isInitialized) {
    return <Redirect href="/" />;
  }

  const handleGooglePress = async () => {
    try {
      GoogleSignin.configure({
        scopes: ['email'],
        webClientId:
          '938397449309-kqee2695quf3ai6ta2hmb82th9l9iifv.apps.googleusercontent.com',
        offlineAccess: true,
      });

      const signIn = await userStore.googleSingInUser();
      console.log('[App] Результат Google Sign-In:', signIn);

      // signIn = [isExistingUser, isSuccess]
      if (!signIn[0] && signIn[1]) {
        // Новый пользователь
        logSignUp("google"); // логируем регистрацию
        router.replace('/(auth)/onboarding');
      } else if (signIn[0] && signIn[1]) {
        // Существующий пользователь
        logLogin("google"); // логируем вход
        router.replace('/search/news');
      } else {
        // Обработка ошибки / отмены входа
      }
    } catch (error: any) {
      // Можно логировать ошибку
      logLoginError("google", error.message);
      console.error('[App] Ошибка Google Sign-In:', error);
    }
  };

  const handleApplePress = async () => {
    try {
      const firebaseUserCredential = await signInWithApple();
      const signIn = await userStore.appleSignInUser(
        firebaseUserCredential.name,
        firebaseUserCredential.firebCreds
      );

      if (!signIn[0] && signIn[1]) {
        // Новый пользователь
        logSignUp("apple");
        router.replace('/(auth)/onboarding');
      } else if (signIn[0] && signIn[1]) {
        // Существующий пользователь
        logLogin("apple");
        router.replace('/search/news');
      } else {
        // Обработка ошибки / отмены входа
      }
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        // Пользователь отменил вход
      } else {
        // Логировать ошибку
        logLoginError("apple", error.message);
      }
    }
  };

  if (!userHasSubscription && !adShown) {
    return (
      <AppOpenAdHandler
        onAdComplete={() => {
          setAdShown(true);
        }}
      />
    );
  }

  if (!isError && !loading && userStore.getLogged() && isInitialized && (adShown || userHasSubscription)) {
    if (userStore.currentUser?.userStatus === UserStatus.Onboarding) {
      return <Redirect href="/(auth)/onboarding" />;
    } else {
      return <Redirect href="/search/news" />;
    }
  }

  return (
    <GestureHandlerRootView>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView className="bg-white h-full">
        <View className="w-full h-full px-4 justify-center">
          <View className="flex-row mt-2 items-start justify-center">
            <Text
              variant="titleSmall"
              className="ml-0 text-xl font-nunitoSansBold mt-4 mb-2"
            >
              {i18n.t('index.welcome')}
            </Text>
          </View>
          <View className="justify-center items-center">
            <OnboardingCarousel />
          </View>
          <View className="pt-8">
            <CustomButtonPrimary
              title={i18n.t('index.signUp')}
              handlePress={() => {
                console.log('[App] Переход на экран регистрации (/sign-up)');
                router.push('/sign-up');
              }}
              containerStyles="w-full"
            />
            <CustomButtonOutlined
              title={i18n.t('index.alreadyHaveAccount')}
              handlePress={() => {
                console.log('[App] Переход на экран входа (/sign-in)');
                router.push('/sign-in');
              }}
              containerStyles="w-full"
            />
          </View>
          <View className="flex-col justify-center items-center pt-3">
            <Text
              variant="titleSmall"
              className="text-sm font-nunitoSansRegular text-stone-400"
            >
              {i18n.t('index.otherSignInMethods')}
            </Text>
            <View className="flex-row justify-around mt-2 gap-x-4">
              {Platform.OS === 'android' && (
                <TouchableOpacity onPress={handleGooglePress}>
                  <Image className="w-12 h-12" source={googleLogo} />
                </TouchableOpacity>
              )}
              {Platform.OS === 'ios' && (
                <TouchableOpacity onPress={handleApplePress}>
                  <Image className="w-12 h-12" source={appleLogo} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;

import React, { useEffect } from 'react';
import { TouchableOpacity, View, Image, Platform, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomButtonPrimary from '@/components/custom/buttons/CustomButtonPrimary';
import CustomButtonOutlined from '@/components/custom/buttons/CustomButtonOutlined';
import OnboardingCarousel from '@/components/auth/OnboardingCarousel';
import i18n from '@/i18n';
import { router } from 'expo-router';
import googleLogo from '@/assets/images/google.png';
import appleLogo from '@/assets/images/apple.png';
import userStore from '@/stores/UserStore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signInWithApple } from '@/firebaseConfig';
import { logLogin, logSignUp, logLoginError, logScreenView } from '@/services/AnalyticsService';

const WelcomeScreen = () => {

  useEffect(() => {
    logScreenView("WelcomeScreen");
  }, []);


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



  return (
    <GestureHandlerRootView>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView className="bg-white h-full">
        <View className="w-full h-full px-4 justify-center">
          <View className="flex-row mt-2 items-start justify-center">
            <Text variant="titleSmall" className="ml-0 text-xl font-nunitoSansBold mt-4 mb-2">
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

export default WelcomeScreen;

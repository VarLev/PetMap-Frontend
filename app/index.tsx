import React, { useEffect, useState } from 'react';
import {
  Platform,
} from 'react-native';
import { Redirect, router } from 'expo-router';
import { useStore } from '@/contexts/StoreProvider';
import userStore from '@/stores/UserStore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import i18n from '@/i18n';
import ScreenHolderLogo from '@/components/common/ScreenHolderLogo';
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
      if (isInitialized && adShown && !loading) {
        // Если пользователь залогинен и не только что зарегистрировался – оставить существующую логику
        if (userStore.getLogged() && !isUserJustRegistrated) {
          const currentUser = (await userStore.getCurrentUser()) as IUser;
          if (currentUser.userStatus === UserStatus.Onboarding) {
            await router.replace('/(auth)/onboarding');
          } else if (currentUser.userStatus === UserStatus.ReadyToGo) {
            await router.replace('/search/news');
          }
        } else {
          // Если пользователь не залогинен или новый – перенаправляем сразу в /search/news
          await router.replace('/search/news');
        }
      }
    };
    checkAuthAndRedirect();

    if (isError) {
      showAlert(i18n.t('index.error'), 'OK', require('../assets/images/InternetError.webp'));
    }
  }, [isInitialized, adShown, loading, isError, isUserJustRegistrated]);

  if (!isError && (loading || !isInitialized)) {
    return <ScreenHolderLogo />;
  }

  if (isError && !isInitialized) {
    return <Redirect href="/" />;
  }

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
    <Redirect href="/(auth)/welcomeScreen" />
  );
};

export default App;

import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { NunitoSans_400Regular, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { AlertProvider } from '@/contexts/AlertContext';
import { DefaultTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { StoreProvider } from '@/contexts/StoreProvider';
import { AppState, AppStateStatus, Platform, View } from 'react-native';
import uiStore from '@/stores/UIStore';
import { observer } from 'mobx-react-lite';
import { setUserStatus, initOnDisconnect } from '@/firebaseConfig';
import userStore from '@/stores/UserStore';
import i18n from '@/i18n';

// Создаем кастомную тему для react-native-paper
const customTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    background: '#ffffff',
    surface: '#ffffff',
    text: '#000000',
  },
  fonts: {
    bodyLarge: {
      fontFamily: 'NunitoSans_400Regular',
      fontWeight: 'normal' as 'normal',
    },
    bodyMedium: {
      fontFamily: 'NunitoSans_700Bold',
      fontWeight: 'normal' as 'normal',
    },
    bodySmall: {
      fontFamily: 'NunitoSans_400Regular',
      fontWeight: 'normal' as 'normal',
    },
    labelLarge: {
      fontFamily: 'NunitoSans_400Regular',
      fontWeight: 'normal' as 'normal',
    },
    headlineLarge: {
      fontFamily: 'NunitoSans_700Bold',
      fontWeight: 'normal' as 'normal',
    },
    titleLarge: {
      fontFamily: 'NunitoSans_700Bold',
      fontWeight: 'normal' as 'normal',
    },
    titleMedium: {
      fontFamily: 'NunitoSans_400Regular',
      fontWeight: 'normal' as 'normal',
    },
    titleSmall: {
      fontFamily: 'NunitoSans_400Regular',
      fontWeight: 'normal' as 'normal',
    },
    caption: {
      fontFamily: 'NunitoSans_400Regular',
      fontWeight: 'normal' as 'normal',
    },
    overline: {
      fontFamily: 'NunitoSans_400Regular',
      fontWeight: 'normal' as 'normal',
    },
  },
};

SplashScreen.preventAutoHideAsync();

const Layout = observer(() => {
  const [fontsLoaded, error] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_700Bold,
  });

  // Для отслеживания AppState
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // ========= ОБРАБОТЧИК СМЕНЫ СОСТОЯНИЯ =========
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    // Было background → стало active
    if (nextAppState === 'active') {
      const currentUserId = userStore.getCurrentUserId();
      // Ставим онлайн
      if (currentUserId) {
        setUserStatus(currentUserId, true).catch(console.error);
      }
    }
    // Было active → стало background
    else if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
      const currentUserId = userStore.getCurrentUserId();
      // Ставим офлайн
      if (currentUserId) {
        setUserStatus(currentUserId, false).catch(console.error);
      }
    } else if (appStateRef.current === 'active') {
      const currentUserId = userStore.getCurrentUserId();
      // Ставим онлайн
      if (currentUserId) {
        setUserStatus(currentUserId, true).catch(console.error);
      }
    }
    setAppState(nextAppState);
    appStateRef.current = nextAppState;
  };

  // 1) Подписка на AppState (один раз), не зависящая от userId
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  // 2) Отдельный эффект для onDisconnect, который вызывается при изменении userId
  useEffect(() => {
    const currentUserId = userStore.getCurrentUserId();
    if (currentUserId) {
      initOnDisconnect(currentUserId)
        .then(() => setUserStatus(currentUserId, true)) // При «подключении» ставим онлайн
        .catch(console.error);
    }
  }, [userStore.getCurrentUserId()]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <View key={uiStore.currentLanguage} style={{ flex: 1 }}>
      <StoreProvider>
        <AlertProvider>
          <PaperProvider theme={customTheme}>
            <Stack initialRouteName="index">
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(user)" 
              options={{ 
               headerShown: Platform.OS === 'ios' , 
                headerTransparent:true, 
                title:'', headerBackTitle:'' ,
                headerBackTitleVisible: false,
              }} />
              <Stack.Screen name="(pet)/[petId]/index" 
              options={{ 
                headerShown: true,
                headerBackButtonMenuEnabled: true,
                headerTitleStyle: {fontFamily: 'NunitoSans_400Regular' },
                headerTransparent: true,
                headerTitle: '',
              }} />
              <Stack.Screen name="(pet)/[petId]/edit" 
              options={{ 
                headerShown: true,
                title: i18n.t('ProfileLayout.editUserTitle'),
                headerTitleStyle: {fontFamily: 'NunitoSans_400Regular' },
              }} />
              <Stack.Screen name="(chat)" options={{ headerShown: false }} />
            </Stack>
          </PaperProvider>
        </AlertProvider>
      </StoreProvider>
    </View>
  );
});

export default Layout;

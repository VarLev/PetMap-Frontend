import { useFonts } from 'expo-font';
import { Stack, SplashScreen, router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { NunitoSans_400Regular, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { AlertProvider } from '@/contexts/AlertContext';
import { DefaultTheme, IconButton, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { StoreProvider } from '@/contexts/StoreProvider';
import { AppState, AppStateStatus, StatusBar, View } from 'react-native';
import uiStore from '@/stores/UIStore';
import { observer } from 'mobx-react-lite';
import { setUserStatus, initOnDisconnect } from '@/firebaseConfig';
import userStore from '@/stores/UserStore';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import { registerForPushNotificationsAsync, savePushTokenToServer, setupNotificationListeners } from '@/hooks/notifications';
import { isDevice } from 'expo-device';

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

console.log('[Layout] Предотвращаем автоматическое скрытие SplashScreen');
SplashScreen.preventAutoHideAsync();

const Layout = observer(() => {
  const [fontsLoaded, error] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_700Bold,
  });

  // Отслеживание состояния приложения
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Обработчик изменения состояния приложения
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    console.log(`[Layout] Смена AppState с ${appStateRef.current} на ${nextAppState}`);
    const currentUserId = userStore.getCurrentUserId();

    if (nextAppState === 'active') {
      console.log('[Layout] Приложение активно. Если есть пользователь, устанавливаем статус online.');
      if (currentUserId) {
        setUserStatus(currentUserId, true).catch((err) =>
          console.error('[Layout] Ошибка при установке статуса online:', err)
        );
      }
    } else if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
      console.log('[Layout] Приложение переходит в фон. Если есть пользователь, устанавливаем статус offline.');
      if (currentUserId) {
        setUserStatus(currentUserId, false).catch((err) =>
          console.error('[Layout] Ошибка при установке статуса offline:', err)
        );
      }
    } else if (appStateRef.current === 'active') {
      console.log('[Layout] AppState остается активным. Устанавливаем статус online для пользователя.');
      if (currentUserId) {
        setUserStatus(currentUserId, true).catch((err) =>
          console.error('[Layout] Ошибка при установке статуса online:', err)
        );
      }
    }

    setAppState(nextAppState);
    appStateRef.current = nextAppState;
  };

  // Подписка на изменения AppState
  useEffect(() => {
    console.log('[Layout] Подписка на изменения AppState');
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      console.log('[Layout] Удаление подписки на AppState');
      subscription.remove();
    };
  }, []);

  // Инициализация onDisconnect при наличии текущего пользователя
  useEffect(() => {
    const currentUserId = userStore.getCurrentUserId();
    if (currentUserId) {
      console.log('[Layout] Инициализация onDisconnect для пользователя:', currentUserId);
      initOnDisconnect(currentUserId)
        .then(() => {
          console.log('[Layout] onDisconnect и установка статуса online для пользователя:', currentUserId);
          return setUserStatus(currentUserId, true);
        })
        .catch((err) => console.error('[Layout] Ошибка при инициализации onDisconnect:', err));
    } else {
      console.log('[Layout] Нет текущего пользователя для инициализации onDisconnect');
    }
  }, [userStore.getCurrentUserId()]);

  // Отслеживание загрузки шрифтов и возможных ошибок
  useEffect(() => {
    if (error) {
      console.error('[Layout] Ошибка загрузки шрифтов:', error);
    }
    if (fontsLoaded) {
      console.log('[Layout] Шрифты загружены, скрываем SplashScreen');
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Настройка пуш-уведомлений и слушателей
  useEffect(() => {
    // Если пользователь не определён, не пытаемся регистрировать пуш-уведомления
    if (!userStore.currentUser?.id) {
      console.log('[Layout] Пользователь не определён, пуш-уведомления не регистрируются');
      return;
    }
  
    let removeListeners = () => {};
    console.log('[Layout] Текущий пользователь для пуш-уведомлений:', userStore.currentUser?.id);
  
    if (isDevice) {
      console.log('[Layout] Определено устройство, регистрируем пуш-уведомления');
      registerForPushNotificationsAsync()
        .then((token) => {
          if (token) {
            console.log('[Layout] Получен push-токен:', token);
            savePushTokenToServer(userStore.currentUser?.id, token);
          } else {
            console.log('[Layout] Push-токен не получен');
          }
        })
        .catch((err) => console.error('[Layout] Ошибка регистрации пуш-уведомлений:', err));
    } else {
      console.log('[Layout] Это не устройство, регистрация пуш-уведомлений пропущена');
    }
  
    removeListeners = setupNotificationListeners(
      (notification) => {
        console.log('[Layout] Получено уведомление:', notification);
      },
      (response) => {
        console.log('[Layout] Ответ на уведомление:', response);
        const chatId = response.notification.request.content.data.chatId;
        if (chatId) {
          console.log(`[Layout] Переход к чату с id: ${chatId}`);
          router.replace(`/(chat)/${chatId}`);
          removeListeners();
        }
      }
    );
  
    return () => {
      console.log('[Layout] Удаление слушателей пуш-уведомлений');
      removeListeners();
    };
  }, [userStore.currentUser?.id]);

  if (!fontsLoaded && !error) {
    console.log('[Layout] Шрифты еще не загружены, возвращаем null');
    return null;
  }

  console.log('[Layout] Рендеринг Layout с resetAppId:', uiStore.resetAppId);

  return (
    <View key={uiStore.resetAppId} style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <StoreProvider>
        <AlertProvider>
          <PaperProvider theme={customTheme}>
            <Stack initialRouteName="index">
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="(user)"
                options={{
                  headerShown: false,
                  headerTransparent: true,
                  title: '',
                  headerBackTitle: '',
                  headerBackTitleVisible: false,
                }}
              />
              <Stack.Screen
                name="(pet)/[petId]/index"
                options={{
                  headerShown: true,
                  headerBackButtonMenuEnabled: true,
                  headerTitleStyle: { fontFamily: 'NunitoSans_400Regular' },
                  headerTransparent: true,
                  headerTitle: '',
                  headerLeft: () => (
                    <View
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        borderRadius: 30,
                        padding: 5,
                        marginLeft: 8,
                        height: 45,
                        width: 45,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconButton
                        icon={() => <Ionicons name="arrow-back" size={30} color="#fff" />}
                        onPress={router.back}
                      />
                    </View>
                  ),
                }}
              />
              <Stack.Screen
                name="(pet)/[petId]/edit"
                options={{
                  headerShown: true,
                  title: i18n.t('ProfileLayout.editUserTitle'),
                  headerTitleStyle: { fontFamily: 'NunitoSans_400Regular' },
                  headerBackTitle: i18n.t('onboardingProfile.back'),
                }}
              />
              <Stack.Screen name="(chat)" options={{ headerShown: false }} />
              <Stack.Screen name="(paywall)/pay" options={{ headerShown: false }} />
            </Stack>
          </PaperProvider>
        </AlertProvider>
      </StoreProvider>
    </View>
  );
});

export default Layout;

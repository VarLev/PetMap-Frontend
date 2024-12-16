import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { NunitoSans_400Regular, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { AlertProvider } from '@/contexts/AlertContext';
import { DefaultTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { StoreProvider } from '@/contexts/StoreProvider';
import { View } from 'react-native';
import uiStore from '@/stores/UIStore';
import { observer } from 'mobx-react-lite';

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
            <Stack initialRouteName='index'>
              <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
              <Stack.Screen name='(auth)' options={{ headerShown: false }} />
              <Stack.Screen name='index' options={{ headerShown: false }} />
            </Stack>
          </PaperProvider>
        </AlertProvider>
      </StoreProvider>
    </View>
  );
});

export default Layout;

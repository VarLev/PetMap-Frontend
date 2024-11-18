
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { NunitoSans_400Regular, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { AlertProvider } from '@/contexts/AlertContext';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { StoreProvider } from '@/contexts/StoreProvider';

// Создаем кастомную тему для react-native-paper
const customTheme = {
  ...DefaultTheme,
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

const Layout = () => {
  const [fontsLoaded,error] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_700Bold,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
    }
    if(fontsLoaded){
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded,error]);


  if(!fontsLoaded && !error) return null; 

  return (
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
  );
};

export default Layout;

import StoreProvider from '@/contexts/StoreProvider';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { NunitoSans_400Regular, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { AlertProvider } from '@/contexts/AlertContext';
import { DefaultTheme, PaperProvider } from 'react-native-paper';


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
        <PaperProvider theme={DefaultTheme}>
        <Stack initialRouteName='(tabs)'>
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

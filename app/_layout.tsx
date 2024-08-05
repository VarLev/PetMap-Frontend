import StoreProvider from '@/contexts/StoreProvider';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { NunitoSans_400Regular, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';


SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const [fontsLoaded,error] = useFonts({
    // 'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    // 'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    // 'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    // 'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    // 'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    // 'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.ttf'),
    // 'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    // 'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
    // 'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf')
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

  if (!fontsLoaded) {
    return null;
  }

  if(!fontsLoaded && !error) return null; 

  return (
    <StoreProvider>
      <Stack initialRouteName='(tabs)'>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='search/[query]' options={{ headerShown: false }} />
      </Stack>
    </StoreProvider>
  );
};

export default Layout;

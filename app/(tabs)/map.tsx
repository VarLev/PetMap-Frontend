import PermissionsRequestComponent from '@/components/auth/PermissionsRequestComponent';
import MapBoxMap from '@/components/map/MapComponent';
import userStore from '@/stores/UserStore';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';


const Map = () => {

  useEffect(() => {
    if(!userStore.currentUser || !userStore.currentUser.name || userStore.currentUser.name === '' || userStore.currentUser.name === null) {
      router.push('/(tabs)/profile/');
    }
   
  }, []);

  return (
   
    <SafeAreaView className='bg-violet-100 h-full'>
      <PermissionsRequestComponent/>
       <GestureHandlerRootView style={{ flex: 1 }}>
        <MapBoxMap />
      </GestureHandlerRootView>
    </SafeAreaView>
    
  )
}

export default Map;
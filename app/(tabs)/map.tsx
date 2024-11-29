import PermissionsRequestComponent from '@/components/auth/PermissionsRequestComponent';
import MapBoxMap from '@/components/map/MapComponent';
import userStore from '@/stores/UserStore';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Map = () => {

  useEffect(() => {
    if(!userStore.currentUser || !userStore.currentUser.name || userStore.currentUser.name === '' || userStore.currentUser.name === null) {
      router.push('/(tabs)/profile/');
    }
   
  }, []);

  return (
   
    <>
      <PermissionsRequestComponent/>
       <GestureHandlerRootView style={{ flex: 1 }}>
        <MapBoxMap />
      </GestureHandlerRootView>
      </>
    
  )
}

export default Map;
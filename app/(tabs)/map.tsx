import MapBoxMap from '@/components/map/MapComponent';
import userStore from '@/stores/UserStore';
import { router } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Map = () => {



  if(!userStore.currentUser || !userStore.currentUser.name || userStore.currentUser.name === '' || userStore.currentUser.name === null) {
    router.push('/(tabs)/profile/');
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MapBoxMap />
      </GestureHandlerRootView>
    </>
  )
}

export default Map;
import MapBoxMap from '@/components/map/MapComponent';
import userStore from '@/stores/UserStore';
import {useFocusEffect, useRouter } from 'expo-router';
import React from 'react';


const Map = () => {
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      if (
        !userStore.currentUser ||
        !userStore.currentUser.name ||
        userStore.currentUser.name === '' ||
        userStore.currentUser.name === null ||
        userStore.currentUser.name === undefined
      ) {
        console.log('Редирект на профиль:', userStore.currentUser?.name);
        router.push('/(tabs)/profile/');
      }
    }, [userStore.currentUser])
  );

  return (
    <MapBoxMap />
  )
}

export default Map;
import MapBoxMap from '@/components/map/MapComponent';
import { logScreenView } from '@/services/AnalyticsService';
import userStore from '@/stores/UserStore';
import {useFocusEffect, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React from 'react';


const Map = observer (() => {
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      logScreenView("MapScreen");
      if (
        !userStore.currentUser ||
        !userStore.currentUser.name ||
        userStore.currentUser.name === '' ||
        userStore.currentUser.name === null ||
        userStore.currentUser.name === undefined
      ) {
        router.push('/(tabs)/profile/');
      }
    }, [userStore.currentUser])
  );

  return (
    <MapBoxMap />
  )
});

export default Map;
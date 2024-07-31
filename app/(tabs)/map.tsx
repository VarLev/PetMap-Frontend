import MapBoxMap from '@/components/map/MapComponent';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';




const map = () => {
  return (
   
    <SafeAreaView className='bg-violet-100 h-full'>
       <GestureHandlerRootView style={{ flex: 1 }}>
        <MapBoxMap />
      </GestureHandlerRootView>
    </SafeAreaView>
    
  )
}

export default map;
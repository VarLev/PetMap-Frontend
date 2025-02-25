
import React from 'react'
import TopUsers from '@/components/search/TopUsers'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Provider } from 'react-native-paper'


const explore = () => {
 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider>
        <TopUsers />
      </Provider>
    </GestureHandlerRootView> 
  )
}

export default explore;

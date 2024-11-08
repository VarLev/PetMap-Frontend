import { SafeAreaView } from 'react-native'
import React from 'react'
import TopUsers from '@/components/search/TopUsers'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Provider } from 'react-native-paper'

const explore = () => {
  return (
    
      <SafeAreaView className='bg-violet-100 h-full'>
      <GestureHandlerRootView  style={{ flex: 1 }}>
        <Provider>
        <TopUsers />
        </Provider>
        
      </GestureHandlerRootView> 
    </SafeAreaView>

    
    
  )
}

export default explore;

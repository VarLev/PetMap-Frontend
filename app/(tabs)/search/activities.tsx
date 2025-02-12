import Feed from '@/components/search/feed/Feed';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Activities() {
  return (
    <GestureHandlerRootView className='flex-1 bg-white'>
      <Feed />
    </GestureHandlerRootView>
  );
}

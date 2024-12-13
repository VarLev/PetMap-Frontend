import React from 'react';
import { View } from 'react-native';
import NewsComponent from '@/components/search/news/NewsComponent';
import PermissionsRequestComponent from '@/components/auth/PermissionsRequestComponent';

export default function News() {
  return (
    <View className='flex-1 bg-white'>
      <PermissionsRequestComponent/>
      <NewsComponent />
    </View>
  );
}
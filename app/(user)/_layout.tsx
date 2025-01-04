import React from 'react';
import { Stack } from 'expo-router';
import { BG_COLORS } from '@/constants/Colors';

export default function UserLayout() {
  return (
    <Stack >
      <Stack.Screen 
        name="[userId]" 
        options={{ 
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerTintColor: BG_COLORS.indigo[700],
        }} 
   
      />
    </Stack>
  );
}

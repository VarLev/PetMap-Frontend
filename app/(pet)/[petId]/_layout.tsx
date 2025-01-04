import React from 'react';
import { Stack } from 'expo-router';
import i18n from '@/i18n';
import { BG_COLORS } from '@/constants/Colors';

export default function PetLayout() {
  return (
    <Stack >
      <Stack.Screen 
        name="edit" 
        options={{ 
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerTintColor: BG_COLORS.indigo[700],
        }} 
   
      />
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerTitleStyle: {fontFamily: 'NunitoSans_400Regular' },
          headerTransparent: true,
          headerTitle: '',
          headerTintColor: BG_COLORS.indigo[700],
        }} 
        
      />
    </Stack>
  );
}
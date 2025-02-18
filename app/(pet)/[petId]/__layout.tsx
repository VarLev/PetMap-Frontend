import React from 'react';
import { Stack } from 'expo-router';
import i18n from '@/i18n';


export default function PetLayout() {
  return (
    <Stack >
      <Stack.Screen 
        name="edit" 
        options={{ 
          headerShown: true,
          title: i18n.t('ProfileLayout.editUserTitle'),
          headerTitleStyle: {fontFamily: 'NunitoSans_400Regular' },
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

        }} 
        
      />
    </Stack>
  );
}
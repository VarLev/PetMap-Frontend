import React from 'react';
import { Stack } from 'expo-router';
import i18n from '@/i18n';

export default function ProfileLayout() {
  return (
    <Stack >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: i18n.t('ProfileLayout.profileTitle'),
          headerStyle: {
            backgroundColor: 'transparent', // Прозрачный заголовок
          },
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="edit" 
        options={{ 
          title: i18n.t('ProfileLayout.editUserTitle'),
          headerTitleStyle: {fontFamily: 'NunitoSans_400Regular' }
        }} 
        
      />
      {/* <Stack.Screen 
        name="pet/[petId]/index" 
        options={{ 
          title: '',
          headerBackTitle: i18n.t('onboardingProfile.back'),
          headerTitleStyle: {fontFamily: 'NunitoSans_400Regular', fontSize: 20 },
          headerTintColor: '#000',
          headerTransparent: true,
          //headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="pet/[petId]/edit" 
        options={{ 
          title:i18n.t('ProfileLayout.editPetTitle'),
          headerTitleStyle: {fontFamily: 'NunitoSans_400Regular' }
        }} 
      /> */}
      <Stack.Screen 
        name="myjobs" 
        options={{ 
          title: i18n.t('ProfileLayout.myJobsTitle'),
          headerTitleStyle: {fontFamily: 'NunitoSans_400Regular' }
        }} 
      />
      <Stack.Screen 
        name="mywalks" 
        options={{ 
          title: i18n.t('ProfileLayout.myWalksTitle'),
          headerTitleStyle: {fontFamily: 'NunitoSans_400Regular' }
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: i18n.t('ProfileLayout.settingsTitle'),
          headerTitleStyle: {fontFamily: 'NunitoSans_400Regular' }
        }} 
      />
    </Stack>
  );
}

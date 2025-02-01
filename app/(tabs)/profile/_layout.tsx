import React from 'react';
import { router, Stack } from 'expo-router';
import i18n from '@/i18n';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileLayout() {
  return (
    <Stack >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: '',
          headerStyle: {
            backgroundColor: 'transparent', // Прозрачный заголовок
          },
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerTitleStyle: {fontFamily: 'NunitoSans_400Regular' },
          headerTransparent: true,
          headerLeft: () => (
            <View            
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)', // полупрозрачный черный фон
                borderRadius: 30,
                padding: 5,
                marginLeft: 8,
                height: 45,
                width: 45,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconButton icon={() => <Ionicons name="arrow-back" size={30} color="#fff" />} onPress={router.back}/>
            </View>
          )
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
        name="mymarkers" 
        options={{ 
          title: i18n.t('Sidebar.myLocations'),
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
      <Stack.Screen 
        name="petShelters/index" 
        options={{ 
          title: i18n.t('petShelter.shelter'),
          headerTitleStyle: {fontFamily: 'NunitoSans_400Regular' }
        }} 
      />
      <Stack.Screen 
        name="petShelters/ayudacan" 
        options={{ 
          title: 'AyudaCan',
          headerTitleStyle: {fontFamily: 'NunitoSans_400Regular' }
        }} 
      />
      <Stack.Screen 
        name="petShelters/mascotasenadopcion" 
        options={{ 
          title: 'Mascotas en Adopcion',
          headerTitleStyle: {fontFamily: 'NunitoSans_400Regular' } ,     }} 
      />
    </Stack>
  );
}

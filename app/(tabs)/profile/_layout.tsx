import React from 'react';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <>
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Профиль',
          headerStyle: {
            backgroundColor: 'transparent', // Прозрачный заголовок
          },
          headerShown: false,
        }} 
      />
      <Stack.Screen name="editUser" options={{ title: 'Редактирование профиля' }} />
      
    </Stack>
   
   </>
  );
}
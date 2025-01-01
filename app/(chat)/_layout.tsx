import React from 'react';
import { Stack } from 'expo-router';
import i18n from '@/i18n';
import { BG_COLORS } from '@/constants/Colors';

export default function ChatLayout() {
  return (
    <Stack >
      <Stack.Screen 
        name="[chatId]" 
        options={{ 
          headerShown: false,
          headerTransparent: true,
          headerTitle: '',
          headerTintColor: BG_COLORS.indigo[700],
        }} 
   
      />
    </Stack>
  );
}

import React from 'react';
import { router, Stack } from 'expo-router';
import { BG_COLORS } from '@/constants/Colors';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

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
    </Stack>
  );
}

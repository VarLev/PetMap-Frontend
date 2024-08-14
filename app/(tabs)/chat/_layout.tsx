import React from 'react';
import { Stack } from 'expo-router';

const ChatLayout = () => {
  return (
    <Stack initialRouteName='index'>
      <Stack.Screen name="index" options={{ headerShown: true, title: 'Chat List' }} />
      <Stack.Screen name="[chatId]" options={{ headerShown: true, title: 'Chat' }} />
    </Stack>
  );
};

export default ChatLayout;

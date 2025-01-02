import React from "react";
import { Stack } from "expo-router";
import i18n from "@/i18n";




const ChatLayout = () => {
  return (
      <Stack initialRouteName="index">
        <Stack.Screen
          name="index"
          options={{ 
            headerShown: true, 
            title: i18n.t('chat.messages'),
            // headerLeft: () => (
            //   <IconButton
            //     icon="arrow-left"
            //     size={24}
            //     onPress={() => router.back()}
            //   />
            // )
          }}
          
        />
        <Stack.Screen
          name="[chatId]"
          options={{ headerShown: false, title: "Chat" }}
        />
      </Stack>
  );
};

export default ChatLayout;

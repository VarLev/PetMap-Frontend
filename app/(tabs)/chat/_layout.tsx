import React from "react";
import { Stack } from "expo-router";
import i18n from "@/i18n";



const ChatLayout = () => {
  return (
      <Stack initialRouteName="index">
        <Stack.Screen
          name="index"
          options={{ headerShown: true, title: i18n.t("chat.messages"), 
            headerStyle: { backgroundColor: "white" },
            headerTitleStyle: {fontFamily: 'NunitoSans_400Regular' },       
            headerBackVisible: false,
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

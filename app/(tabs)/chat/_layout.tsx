import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const ChatLayout = () => {
  return (
    <>
      <Stack initialRouteName="index">
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: "Chat List" }}
        />
        <Stack.Screen
          name="[chatId]"
          options={{ headerShown: false, title: "Chat" }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
};

export default ChatLayout;

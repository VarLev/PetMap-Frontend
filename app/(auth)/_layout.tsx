import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="welcomeScreen" options={{ headerShown: false }} />
      <Stack.Screen name="screenholder" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up.mailvalidation" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up.passwordreset" options={{ headerShown: false }} />
      <Stack.Screen name="congrats" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;

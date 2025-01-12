import {
  View,
  ScrollView,
  Alert,
  StatusBar,
  Keyboard,
} from "react-native";
import { Text } from "react-native-paper";
import { TextInput } from "react-native-paper";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import userStore from "@/stores/UserStore";
import CustomLoadingButton from "@/components/custom/buttons/CustomLoadingButton";
import ArrowHelp from "@/components/auth/arrowHelp";
import i18n from "@/i18n"; // Импорт i18n для мультиязычности
import { UserStatus } from "@/dtos/enum/UserStatus";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const [secureText, setSecureText] = useState(true); // состояние видимости пароля

  const handleLogin = async () => {
    Keyboard.dismiss();
    const validEmail = validateEmail(email);
    setIsValidEmail(validEmail);

    if (!validEmail) {
      return;
    }

    try {
      await userStore.singInUser(email, password);
      const user = userStore.currentUser ;
      if(user?.userStatus === UserStatus.Onboarding)
        router.replace("(auth)/onboarding");
      else
        router.replace("/screenholder");
    } catch (error: any) {
      Alert.alert("Login Error", error.message.replace("Firebase:", ""));
    }
  };


  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const tempfunc = () => {
    Alert.alert(
      "", // Заголовок сообщения
      "petmap.app \ninfo@petmap.app",
      [
        {
          text: "Ok",
          onPress: () => router.replace("/"),
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <SafeAreaView className="bg-white h-full">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
        <View className="w-full justify-between h-full px-9 my-10">
          <View>
            <ArrowHelp
              onPressArrow={() => router.replace("/")}
              onPressHelp={tempfunc}
            />
            {/* временная ссылка для отладки */}

            <View className="justify-start mt-10 ">
              <View className="flex-col items-start justify-center">
                <Text
                  variant="titleSmall"
                  className="text-xl mb-2 font-nunitoSansBold"
                >
                  {i18n.t("signIn.welcomeBack")}
                </Text>
                <Text
                  variant="titleSmall"
                  className="pb-4 text-sm font-nunitoSansRegular"
                >
                  {i18n.t("signIn.enterCredentials")}
                </Text>
              </View>

              <TextInput
                mode="outlined"
                label={i18n.t("signIn.email")}
                value={email}
                onChangeText={setEmail}
                onBlur={() => setIsValidEmail(validateEmail(email))}
                keyboardType="email-address"
                autoCapitalize="none"
                theme={{ roundness: 8 }}
                className="mb-2"
              />
              {!isValidEmail && (
                <Text
                  style={{ marginTop: -10 }}
                  className="text-red-500 ml-1 mb-2"
                >
                  {i18n.t("signIn.invalidEmail")}
                </Text>
              )}
              <TextInput
                mode="outlined"
                label={i18n.t("signIn.password")} // предполагаемый перевод для метки "Пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText} // управление видимостью текста
                autoCapitalize="none"
                theme={{ roundness: 8 }}
                className="mb-2"
                right={
                  <TextInput.Icon
                    icon={secureText ? "eye-off" : "eye"}
                    onPress={() => setSecureText(!secureText)} // переключение видимости пароля
                  />
                }
              />
              
                <CustomLoadingButton
                  title={i18n.t("signIn.loginButton")}
                  handlePress={async () => {
                    Keyboard.dismiss();
                    await handleLogin();
                  }}
                  containerStyles="w-full"
                />
            

              <View className="items-center pt-5">
                <Link
                  href="/sign-up.mailvalidation"
                  className="pt-4 text-base text-indigo-800 font-nunitoSansBold"
                >
                  {i18n.t("signIn.forgotPassword")}
                </Link>
              </View>
            </View>
          </View>

          <View className="pb-20">
            <View className="justify-center flex-row gap-2">
              <Text className="text-base text-gray-500 font-nunitoSansRegular">
                {i18n.t("signIn.noAccount")}
              </Text>
              <Link
                href="/sign-up"
                className="text-base text-indigo-800 font-nunitoSansBold"
              >
                {i18n.t("signIn.register")}
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

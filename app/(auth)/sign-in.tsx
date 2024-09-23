import { View, ScrollView, Alert, StatusBar } from "react-native";
import { Text } from "react-native-paper";
import { TextInput } from "react-native-paper";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import userStore from "@/stores/UserStore";
import Icon from "react-native-vector-icons/AntDesign";
import CustomLoadingButton from "@/components/custom/buttons/CustomLoadingButton";
import mapStore from "@/stores/MapStore";


const SignIn = () => {
  const [email, setEmail] = useState("levromf@gmail.com");
  const [password, setPassword] = useState("123456");
  const [isSecure, setIsSecure] = useState(true);

  const handleLogin = async () => {
    try {
      await userStore.singInUser(email, password);
      await mapStore.setWalkAdvrts();
      //router.replace('/screenholder');
      //router.replace("/(tabs)/map");
      router.replace("/(auth)/onboarding");
    } catch (error: any) {
      Alert.alert("Login Error", error.message.replace("Firebase:", ""));
    }
  };

  const handleToggleSecure = () => {
    setIsSecure(!isSecure);
  };

  const handleBack = () => {
    router.back(); // Возврат на предыдущий экран
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full justify-between h-full px-9 my-10">
          {/* Блок 1: Стрелка и Помощь */}
          <View className="flex-row justify-between mx-2">
            <Icon name="arrowleft" size={30} onPress={handleBack} />
            <Text
              onPress={() => console.log("press help")}
              className="text-lg font-nunitoSansBold"
            >
              Помощь
            </Text>
          </View>

          {/* Блок 2: Вход */}
          <View className=" justify-start mb-40 ">
            <View className="flex-col items-start justify-center">
              <Text
                variant="titleSmall"
                className="text-xl mb-2 font-nunitoSansBold"
              >
                Рады видеть вас снова!
              </Text>
              <Text
                variant="titleSmall"
                className="pb-4 text-sm font-nunitoSansRegular"
              >
                Введите данные для входа в существующий аккаунт.
              </Text>
            </View>

            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              theme={{ roundness: 10 }}
              className="mb-2"
            />
            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={isSecure}
              theme={{ roundness: 10 }}
              className="mb-2"
            />
         
            <CustomLoadingButton
              title="Войти"
              handlePress={handleLogin}
              containerStyles="w-full"
            />

            <View className="items-center pt-5">
              <Link
                href="/sign-up"
                className="pt-4 text-base text-indigo-800 font-nunitoSansBold"
              >
                Забыли пароль
              </Link>
            </View>
          </View>

          {/* Блок 3: Регистрация */}
          <View className="pb-20">
            <View className="justify-center flex-row gap-2">
              <Text className="text-base text-gray-500 font-nunitoSansRegular">
                Нет аккаунта?
              </Text>
              <Link
                href="/sign-up"
                className="text-base text-indigo-800 font-nunitoSansBold"
              >
                Зарегистрироваться!
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

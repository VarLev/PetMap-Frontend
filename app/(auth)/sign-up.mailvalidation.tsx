import { View, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Text } from "react-native-paper";
import { Link, router } from "expo-router";
import userStore from "@/stores/UserStore";
import CustomLoadingButton from "@/components/custom/buttons/CustomLoadingButton";
import ArrowHelp from "@/components/auth/arrowHelp";
import PasswordPrompt from "@/components/auth/passwordPrompt";



const SignUpMailValidation = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSecure, setIsSecure] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const [isActive, setIsActive] = useState(false);

  const [isSamePassword, setIsSamePassword] = useState(true);
  const [checkBoxAlert, setCheckBoxAlert] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const handleSubmit = async () => {
    
    const validEmail = validateEmail(email);
    setIsValidEmail(validEmail);

    if (!validEmail) {
      return;
    }

    try {
      await userStore.registerUser(email, password);
      Alert.alert(
        "Success",
        "Account created successfully! A verification email has been sent to your email address. Please check your inbox and verify your email to complete the registration."
      );
      router.replace("/onboarding");
    } catch (error: any) {
      Alert.alert("Registration Error", error.message.replace("Firebase:", ""));
    }
  };

  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full justify-between flex-1 px-9 my-10">
          <View>
          <ArrowHelp />
          <View className=" justify-start mt-10 ">
            <View className="flex-col items-start justify-center">
              <Text
                variant="titleSmall"
                className="text-lg font-nunitoSansBold"
              >
                Упс... вы забыли пароль
              </Text>
              <Text
                variant="titleSmall"
                className="mb-4 text-sm font-nunitoSansRegular"
              >
                Для восстановления пароля введите почту, на которую зарегистрирован аккаунт.
              </Text>
            </View>
            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              onBlur={() => setIsValidEmail(validateEmail(email))}
              keyboardType="email-address"
              autoCapitalize="none"
              className="mb-2"
              theme={{ roundness: 8 }}
            />
            {!isValidEmail && (
              <Text style={{ marginTop: -10 }} className="text-red-500 ml-1 mb-2">Введите корректный email</Text>
            )}
            
            <CustomLoadingButton
              title="Подтвердить"
              handlePress={handleSubmit}
              containerStyles="w-full"
            />
          </View>
          <Link
                href="/sign-up.passwordreset"
                className="text-base mt-20"
              >
                ссылка на экран  сброс пароля (временная) эмитация нажания кнопки Подтвердить
              </Link>
              </View>
          <View>
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-base text-gray-500 font-nunitoSansRegular">
              Ещё нет аккаунта?
              </Text>
              <Link
                href="/sign-up"
                className="text-base text-indigo-800 font-nunitoSansBold"
              >
               Зарегистрироваться
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpMailValidation;

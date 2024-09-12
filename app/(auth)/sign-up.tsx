import { View, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Text, Checkbox } from "react-native-paper";
import { Link, router } from "expo-router";
import userStore from "@/stores/UserStore";
import CustomLoadingButton from "@/components/custom/buttons/CustomLoadingButton";
import ArrowHelp from "@/components/auth/arrowHelp";
import PasswordPrompt from "@/components/auth/passwordPrompt";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSecure, setIsSecure] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const [isActive, setIsActive] = useState(false);


  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!isChecked) {
      Alert.alert("Error", "You must agree to the data processing policy");
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

  const handleToggleSecure = () => {
    setIsSecure(!isSecure);
  };

  const handlePasswordInput = () => {
    setIsActive(true)
  }

  const [strength, setStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
      let strengthScore = 0;
      if (password.length >= 8) strengthScore += 1;
      if (/[A-Z]/.test(password)) strengthScore += 1;
      if (/[0-9]/.test(password)) strengthScore += 1;
      if (/[^A-Za-z0-9]/.test(password)) strengthScore += 1;
      setStrength(strengthScore / 4);
    };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full justify-between h-full px-9 my-10">
          <ArrowHelp />
          <View className=" justify-start mb-40 ">
            <View className="flex-col items-start justify-center">
              <Text
                variant="titleSmall"
                className="text-lg font-nunitoSansBold"
              >
                Станьте частью PetMap!
              </Text>
              <Text
                variant="titleSmall"
                className="mb-4 text-sm font-nunitoSansRegular"
              >
                Введите данные, чтобы создать аккаунт.
              </Text>
            </View>
            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="mb-2"
              theme={{ roundness: 10 }}
            />
            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              onFocus={handlePasswordInput}
              onBlur={() => setIsActive(false)}
              onChangeText={(value) => {
                setPassword(value)
                calculatePasswordStrength(value)}}
              secureTextEntry={isSecure}
              className="mb-2"
              theme={{ roundness: 10 }}
              right={
                <TextInput.Icon
                  icon={isSecure ? "eye-off" : "eye"}
                  onPress={handleToggleSecure}
                  
                />
              }
            />
            {isActive && <PasswordPrompt strengthScore={strength}/>}
            <TextInput
              mode="outlined"
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={isSecure}
              className="mb-2"
              theme={{ roundness: 10 }}
            />
            <View style={{ marginHorizontal: 20 }} className="flex-row items-center justify-center gap-3 py-1">
              <Checkbox
                status={isChecked ? "checked" : "unchecked"}
                onPress={() => setIsChecked(!isChecked)}
                color="#3730a3"
              />
              <Text
                variant="titleSmall"
                className="mb-4 p-2 font-nunitoSansRegular text-xs"
              >
                Я согласен с Политикой обработки данных сервиса
              </Text>
            </View>
            <CustomLoadingButton
              title="Зарегистрироваться"
              handlePress={handleRegister}
              containerStyles="w-full"
            />
          </View>
          <View className="pb-20">
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-base text-gray-500 font-nunitoSansRegular">
              У вас уже есть аккаунт,
            </Text>
            <Link
              href="/sign-in"
              className="text-base text-indigo-800 font-nunitoSansBold"
            >
              Войти!
            </Link>

          </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

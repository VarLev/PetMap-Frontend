import { View, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Text } from "react-native-paper";
import { Link, router } from "expo-router";
import userStore from "@/stores/UserStore";
import CustomLoadingButton from "@/components/custom/buttons/CustomLoadingButton";
import ArrowHelp from "@/components/auth/arrowHelp";
import PasswordPrompt from "@/components/auth/passwordPrompt";
import i18n from "@/i18n"; // Импорт i18n для мультиязычности

const SignUpPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSecure, setIsSecure] = useState(true);
  const [isSamePassword, setIsSamePassword] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [strength, setStrength] = useState(0);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setIsSamePassword(false);
      return;
    }
    setIsSamePassword(true);

    try {
      await userStore.registerUser(email, password);
      Alert.alert(i18n.t("signUpPasswordReset.success"), i18n.t("signUpPasswordReset.successMessage"));
      router.replace("/onboarding");
    } catch (error: any) {
      Alert.alert(i18n.t("signUp.registrationError"), error.message.replace("Firebase:", ""));
    }
  };

  const handleToggleSecure = () => {
    setIsSecure(!isSecure);
  };

  const handlePasswordInput = () => {
    setIsActive(true);
  };

  const calculatePasswordStrength = (password: string) => {
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
        <View className="w-full justify-between grow px-9 my-10">
          <View>
            <ArrowHelp onPressArrow={() => router.back()} onPressHelp={() => {}} />
            <View className="justify-start mt-10">
              <View className="flex-col items-start justify-center ">
                <Text
                  variant="titleSmall"
                  className="text-lg font-nunitoSansBold"
                >
                  {i18n.t('signUpPasswordReset.title')} 
                </Text>
                <Text
                  variant="titleSmall"
                  className="mb-4 text-sm font-nunitoSansRegular"
                >
                  {i18n.t('signUpPasswordReset.description')}
                </Text>
              </View>

              <TextInput
                mode="outlined"
                label={i18n.t('signUpPasswordReset.password')}
                value={password}
                onFocus={handlePasswordInput}
                onBlur={() => setIsActive(false)}
                onChangeText={(value) => {
                  setPassword(value);
                  calculatePasswordStrength(value);
                }}
                secureTextEntry={isSecure}
                className="mb-2"
                theme={{ roundness: 8 }}
                right={
                  <TextInput.Icon
                    icon={isSecure ? "eye-off" : "eye"}
                    onPress={handleToggleSecure}
                  />
                }
              />
              {isActive && (
                <PasswordPrompt password={password} strengthScore={strength} />
              )}

              <TextInput
                mode="outlined"
                label={i18n.t('signUpPasswordReset.confirmPassword')} 
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={isSecure}
                className="mb-2"
                theme={{ roundness: 8 }}
              />
              {!isSamePassword && (
                <Text style={{ marginTop: -10 }} className="text-red-500 ml-1">
                  {i18n.t('signUpPasswordReset.passwordMismatch')} 
                </Text>
              )}

              <CustomLoadingButton
                title={i18n.t('signUpPasswordReset.saveButton')}
                handlePress={handleRegister}
                containerStyles="w-full"
                isLoading={password !== confirmPassword || !password || !confirmPassword}
              />
            </View>
          </View>

          <View>
            <View className="justify-center flex-row gap-2">
              <Text className="text-base text-gray-500 font-nunitoSansRegular">
                {i18n.t('signUpPasswordReset.noAccount')} {/* Ещё нет аккаунта? */}
              </Text>
              <Link
                href="/sign-in"
                className="text-base text-indigo-800 font-nunitoSansBold"
              >
                {i18n.t('signUpPasswordReset.register')} {/* Зарегистрироваться */}
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpPasswordReset;

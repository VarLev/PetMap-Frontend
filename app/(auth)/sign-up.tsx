import { View, ScrollView, Alert, TouchableOpacity, Linking } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Text, Checkbox } from "react-native-paper";
import { Link, router } from "expo-router";
import userStore from "@/stores/UserStore";
import CustomLoadingButton from "@/components/custom/buttons/CustomLoadingButton";
import ArrowHelp from "@/components/auth/arrowHelp";
import PasswordPrompt from "@/components/auth/passwordPrompt";
import i18n from "@/i18n"; // Импорт i18n для мультиязычности

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSecure, setIsSecure] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isSamePassword, setIsSamePassword] = useState(true);
  const [checkBoxAlert, setCheckBoxAlert] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [strength, setStrength] = useState(0);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setIsSamePassword(false);
      return;
    }
    setIsSamePassword(true);

    if (!isChecked) {
      setCheckBoxAlert(false);
      return;
    }
    
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full justify-between px-9 my-10 flex-1">
          <View>
            <ArrowHelp />
            <View className=" justify-start mt-10 ">
              <View className="flex-col items-start justify-center">
                <Text
                  variant="titleSmall"
                  className="text-lg font-nunitoSansBold"
                >
                  {i18n.t('signUp.title')} {/* Станьте частью PetMap! */}
                </Text>
                <Text
                  variant="titleSmall"
                  className="mb-4 text-sm font-nunitoSansRegular"
                >
                  {i18n.t('signUp.description')} 
                </Text>
              </View>
              <TextInput
                mode="outlined"
                label={i18n.t('signUp.email')}
                value={email}
                onChangeText={setEmail}
                onBlur={() => setIsValidEmail(validateEmail(email))}
                keyboardType="email-address"
                autoCapitalize="none"
                className="mb-2"
                theme={{ roundness: 8 }}
              />
              {!isValidEmail && (
                <Text
                  style={{ marginTop: -10 }}
                  className="text-red-500 ml-1 mb-2"
                >
                  {i18n.t('signUp.invalidEmail')} 
                </Text>
              )}
              <TextInput
                mode="outlined"
                label={i18n.t('signUp.password')} 
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
                label={i18n.t('signUp.confirmPassword')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={isSecure}
                className="mb-2"
                theme={{ roundness: 8 }}
              />
              {!isSamePassword && (
                <Text style={{ marginTop: -10 }} className="text-red-500 ml-1">
                  {i18n.t('signUp.passwordMismatch')} 
                </Text>
              )}
              <View className="flex-row items-center justify-start gap-3 py-1 px-1.5">
                <Checkbox
                  status={isChecked ? "checked" : "unchecked"}
                  onPress={() => {
                    setIsChecked(!isChecked);
                    setCheckBoxAlert(true);
                  }}
                  color="#3730a3"
                />
                <TouchableOpacity onPress={() => Linking.openURL('https://www.privacypolicies.com/live/503edef7-c248-4fad-9387-7f7a0a91f751')}>
                  <Text
                    variant="titleSmall"
                    className="mb-4 p-2 font-nunitoSansRegular text-xs underline text-blue-500"
                  >
                    {i18n.t('signUp.dataPolicy')}
                  </Text>
                </TouchableOpacity>
              </View>
              {!checkBoxAlert && (
                <Text style={{ marginTop: -20 }} className="text-red-500 mb-2">
                  {i18n.t('signUp.policyAlert')} 
                </Text>
              )}
              <CustomLoadingButton
                title={i18n.t('signUp.registerButton')} 
                handlePress={handleRegister}
                containerStyles="w-full"
                isLoading={false}
              />
            </View>
          </View>

          <View>
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-base text-gray-500 font-nunitoSansRegular">
                {i18n.t('signUp.alreadyHaveAccount')} {/* У вас уже есть аккаунт? */}
              </Text>
              <Link
                href="/sign-in"
                className="text-base text-indigo-800 font-nunitoSansBold"
              >
                {i18n.t('signUp.login')} {/* Войти! */}
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

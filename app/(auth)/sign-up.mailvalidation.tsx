import { View, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Text } from "react-native-paper";
import { Link, router } from "expo-router";
import CustomLoadingButton from "@/components/custom/buttons/CustomLoadingButton";
import ArrowHelp from "@/components/auth/arrowHelp";
import i18n from "@/i18n"; // Импорт i18n для мультиязычности
import { resetPassword } from "@/firebaseConfig";

const SignUpMailValidation = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleSubmit = async () => {
    const validEmail = validateEmail(email);
    setIsValidEmail(validEmail);

    if (!validEmail) {
      return;
    }

    try {
      await resetPassword(email);
      Alert.alert(
        "",
        i18n.t('signUpMailValidation.successMessage') 
      );
      router.back();
     
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
            <ArrowHelp onPressArrow={() => router.back()} onPressHelp={() => {}} />
            <View className="justify-start mt-10 ">
              <View className="flex-col items-start justify-center">
                <Text
                  variant="titleSmall"
                  className="text-lg font-nunitoSansBold"
                >
                  {i18n.t('signUpMailValidation.forgotPassword')} {/* Упс... вы забыли пароль */}
                </Text>
                <Text
                  variant="titleSmall"
                  className="mb-4 text-sm font-nunitoSansRegular"
                >
                  {i18n.t('signUpMailValidation.enterEmail')} {/* Для восстановления пароля введите почту */}
                </Text>
              </View>
              <TextInput
                mode="outlined"
                label={i18n.t('signUpMailValidation.emailLabel')} 
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
                  {i18n.t('signUpMailValidation.invalidEmail')} 
                </Text>
              )}

              <CustomLoadingButton
                title={i18n.t('signUpMailValidation.submitButton')}
                handlePress={handleSubmit}
                containerStyles="w-full"
              />
            </View>
           
          </View>
          <View>
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-base text-gray-500 font-nunitoSansRegular">
                {i18n.t('signUpMailValidation.noAccount')} 
              </Text>
              <Link
                href="/sign-up"
                className="text-base text-indigo-800 font-nunitoSansBold"
              >
                {i18n.t('signUpMailValidation.register')} 
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpMailValidation;

import { View, ScrollView, Alert, TouchableOpacity, Linking, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Text, Checkbox } from 'react-native-paper';
import { Link, router } from 'expo-router';
import userStore from '@/stores/UserStore';
import CustomLoadingButton from '@/components/custom/buttons/CustomLoadingButton';
import ArrowHelp from '@/components/auth/arrowHelp';
import PasswordPrompt from '@/components/auth/passwordPrompt';
import i18n from '@/i18n'; // Импорт i18n для мультиязычности
import { BG_COLORS } from '@/constants/Colors';
import CustomAlert from '@/components/custom/alert/CustomAlert';
import SupportAlert from '@/components/custom/alert/SupportAlert';
import { logScreenView, logSignUp } from '@/services/AnalyticsService';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSecure, setIsSecure] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [isChildChecked, setIsChildChecked] = useState(false);
  const [isEulaChecked, setIsEulaChecked] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isSamePassword, setIsSamePassword] = useState(true);
  const [checkBoxAlert, setCheckBoxAlert] = useState(true);
  const [checkBoxChildAlert, setCheckBoxChildAlert] = useState(true);
  const [checkBoxEulaAlert, setCheckBoxEulaAlert] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [strength, setStrength] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isValidDomain, setIsValidDomain] = useState(true);
  const [supportAlertVisible, setSupportAlertVisible] = useState(false);

  useEffect(() => {
    logScreenView("SignUpScreen");
  }, []);

  const handleRegister = async () => {
    // 1. Проверка совпадения паролей
    if (password !== confirmPassword) {
      setIsSamePassword(false);
      return;
    }
    setIsSamePassword(true);

    // 2. Проверка галочки «Согласен с политикой...»
    if (!isChecked) {
      setCheckBoxAlert(false);
      return;
    }

    if (Platform.OS === 'ios') {
      if (!isEulaChecked) {
        setCheckBoxEulaAlert(false);
        return;
      }
    }

    if (!isChildChecked) {
      setCheckBoxChildAlert(false);
      return;
    }

    // 3. Проверка e-mail по регулярному выражению
    const validEmail = validateEmail(email);
    setIsValidEmail(validEmail);
    if (!validEmail) {
      return;
    }

    // 4. Проверка существования домена
    const domainIsValid = await checkDomainExists(email);
    setIsValidDomain(domainIsValid);
    if (!domainIsValid) {
      return;
    }

    // 5. Если всё ок — регистрируем
    try {
      const creds = await userStore.registerUser(email, password);
      if (creds) {
        logSignUp('email');
        setAlertVisible(true);
        router.replace('/onboarding');
      }
    } catch (error: any) {
      Alert.alert(i18n.t('signUp.registrationError'), error.message.replace('Firebase:', ''));
    }
  };

  const checkDomainExists = async (email: string) => {
    try {
      // Разделяем email по '@'
      const [, domain] = email.split('@');
      if (!domain) return false;

      // Пробуем стучаться по https:
      // (можно также попробовать http: или использовать другой подход)
      const url = `https://${domain}`;

      // Делаем HEAD-запрос, чтобы не тянуть лишний контент
      const response = await fetch(url, { method: 'HEAD' });

      // Если пришёл ответ (ок = 200) — считаем, что домен живой
      return response.ok;
    } catch (error) {
      // Ошибка сети или домена нет
      return false;
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
            <ArrowHelp onPressArrow={() => router.back()} onPressHelp={() => setSupportAlertVisible(true)} />
            <View className=" justify-start mt-10 ">
              <View className="flex-col items-start justify-center">
                <Text variant="titleSmall" className="text-lg font-nunitoSansBold">
                  {i18n.t('signUp.title')} {/* Станьте частью PetMap! */}
                </Text>
                <Text variant="titleSmall" className="mb-4 text-sm font-nunitoSansRegular">
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
                <Text style={{ marginTop: -10 }} className="text-red-500 ml-1 mb-2">
                  {i18n.t('signUp.invalidEmail')}
                </Text>
              )}
              {!isValidDomain && (
                <Text style={{ marginTop: -10 }} className="text-red-500 ml-1 mb-2">
                  {i18n.t('signUpMailValidation.domain')} {/* Добавьте строку в i18n */}
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
                right={<TextInput.Icon icon={isSecure ? 'eye-off' : 'eye'} onPress={handleToggleSecure} />}
              />
              {isActive && <PasswordPrompt password={password} strengthScore={strength} />}

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
              <View className="flex-row items-center justify-start gap-2 py-4 px-0">
                <Checkbox.Android
                  color={BG_COLORS.indigo[700]}
                  uncheckedColor="gray"
                  status={isChecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setIsChecked(!isChecked);
                    setCheckBoxAlert(true);
                  }}
                />
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://www.privacypolicies.com/live/503edef7-c248-4fad-9387-7f7a0a91f751')}
                >
                  <Text variant="titleSmall" className="mb-2 p-0 w-64 font-nunitoSansRegular text-sm underline text-blue-500">
                    {i18n.t('signUp.dataPolicy')}
                  </Text>
                </TouchableOpacity>
              </View>
              {!checkBoxAlert && (
                <Text style={{ marginTop: -20 }} className="text-red-500 mb-2">
                  {i18n.t('signUp.policyAlert')}
                </Text>
              )}
              {Platform.OS === 'ios' && (
                <>
                  <View className="flex-row items-center justify-start gap-2 -mt-4 px-0">
                    <Checkbox.Android
                      color={BG_COLORS.indigo[700]}
                      uncheckedColor="gray"
                      status={isEulaChecked ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setIsEulaChecked(!isEulaChecked);
                        setCheckBoxAlert(true);
                      }}
                    />
                    <TouchableOpacity onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}>
                      <Text variant="titleSmall" className="mb-2 p-0 w-64 font-nunitoSansRegular text-sm underline text-blue-500">
                        {i18n.t('signUp.eulaPolicy')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {!checkBoxEulaAlert && (
                    <Text style={{ marginTop: -10 }} className="text-red-500 mb-2">
                      {i18n.t('signUp.policyEulaAlert')}
                    </Text>
                  )}
                </>
              )}

              <View className="flex-row items-center justify-start gap-2 -mt-4 px-0">
                <Checkbox.Android
                  color={BG_COLORS.indigo[700]}
                  uncheckedColor="gray"
                  status={isChildChecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setIsChildChecked(!isChildChecked);
                    setCheckBoxAlert(true);
                  }}
                />
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://firebasestorage.googleapis.com/v0/b/petmeetar.appspot.com/o/docs%2FChild%20Safety%20Standards%20Policy.html?alt=media&token=63b78eb6-d952-4234-aaf3-7abd573ed4dc'
                    )
                  }
                >
                  <Text variant="titleSmall" className="mb-2 p-0 w-64 font-nunitoSansRegular text-sm underline text-blue-500">
                    {i18n.t('signUp.childPolicy')}
                  </Text>
                </TouchableOpacity>
              </View>
              {!checkBoxChildAlert && (
                <Text style={{ marginTop: -10 }} className="text-red-500 mb-2">
                  {i18n.t('signUp.policyChildAlert')}
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
              <Link href="/sign-in" className="text-base text-indigo-800 font-nunitoSansBold">
                {i18n.t('signUp.login')} {/* Войти! */}
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
      <CustomAlert
        isVisible={alertVisible}
        onClose={() => setAlertVisible(false)}
        message={i18n.t('registration')}
        type="info"
        image={require('@/assets/images/registration.png')}
        backgroundColor="#E8DFFF"
      />
      <SupportAlert isVisible={supportAlertVisible} onClose={() => setSupportAlertVisible(false)} />
    </SafeAreaView>
  );
};

export default SignUp;

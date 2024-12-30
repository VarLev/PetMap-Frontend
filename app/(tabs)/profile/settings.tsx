import React from 'react';
import { observer } from 'mobx-react-lite';
import { ActivityIndicator, View, BackHandler } from "react-native";
import { List, Switch, Button } from "react-native-paper";
import CustomSegmentedButtonsWithProps from '@/components/custom/buttons/CustomSegmentedButtonsWithProps';
import CustomConfirmAlert from '@/components/custom/alert/CustomConfirmAlert';
import { Language } from '@/dtos/enum/Language';
import uiStore from '@/stores/UIStore';
import i18n from '@/i18n';
import { BG_COLORS } from '@/constants/Colors';
import { router } from 'expo-router';
import userStore from '@/stores/UserStore';
import CustomButtonOutlined from '@/components/custom/buttons/CustomButtonOutlined';
import CustomButtonPrimary from '@/components/custom/buttons/CustomButtonPrimary';

const languageToIndex = (lang: Language): number => {
  switch (lang) {
    case Language.Spanish:
      return 0;
    case Language.Russian:
      return 1;
    case Language.English:
      return 2;
    default:
      return -1;
  }
};

const Settings = observer(() => {
  const selectedLanguage = languageToIndex(uiStore.currentLanguage);
  const [sosEnabled, setSosEnabled] = React.useState(false);

  // Состояния для подтверждения смены языка
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [pendingLanguageChange, setPendingLanguageChange] = React.useState<number | null>(null);

  if (selectedLanguage === -1) {
    return (
      <View className="h-full items-center justify-center">
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const handleToggleSos = () => setSosEnabled(!sosEnabled);

  const confirmLanguageChange = async () => {
    if (pendingLanguageChange !== null) {
      let newLang = Language.Spanish;
      if (pendingLanguageChange === 1) newLang = Language.Russian;
      if (pendingLanguageChange === 2) newLang = Language.English;

      await uiStore.setSystemLanguage(newLang);
    }
    setAlertVisible(false);
    setPendingLanguageChange(null);
  };

  const cancelLanguageChange = () => {
    setAlertVisible(false);
    setPendingLanguageChange(null);
  };

  const handleShowAlert = (value: number) => {
    if (value === selectedLanguage) return;
    setPendingLanguageChange(value);
    setAlertVisible(true);
  };

  const exitApp = async () => {
    userStore.signOut();
    await router.replace("/(auth)/sign-in");
    BackHandler.exitApp();
  };

  return (
    <View className="flex-1 justify-between p-4">
      <List.Section>
        {/* <List.Subheader>{i18n.t('settings.general')}</List.Subheader>
        <List.Item
          title={i18n.t('settings.pushNotifications')}
          right={() => (
            <Switch value={sosEnabled} onValueChange={handleToggleSos} />
          )}
          titleStyle={{ fontFamily: "NunitoSans_400Regular" }}
        /> */}

        <List.Item
          title={i18n.t('settings.appLanguage')}
          description={() => (
            <CustomSegmentedButtonsWithProps
              values={selectedLanguage}
              onValueChange={(value: number | number[]) => handleShowAlert(value as number)}
              buttons={[
                { label: i18n.t('settings.languages.spanish') },
                { label: i18n.t('settings.languages.russian') },
                { label: i18n.t('settings.languages.english') },
              ]}
            />
          )}
          titleStyle={{ fontFamily: 'NunitoSans_400Regular' }}
        />
      </List.Section>

      {/* Кнопка выхода из приложения внизу и по центру */}
      <View className="pb-20 items-center">
        <CustomButtonPrimary handlePress={exitApp} title={i18n.t('UserProfile.logout')} containerStyles='w-full' />
      </View>

      <CustomConfirmAlert
        isVisible={alertVisible}
        onClose={cancelLanguageChange}
        onConfirm={confirmLanguageChange}
        message={i18n.t('settings.changeLanguage')}
        confirmText={i18n.t('ok')}
        cancelText={i18n.t('cancel')}
      />
    </View>
  );
});

export default Settings;
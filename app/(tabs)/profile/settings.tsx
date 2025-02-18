import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { ActivityIndicator, View, BackHandler } from 'react-native';
import { Divider, List, Switch } from 'react-native-paper';
import CustomSegmentedButtonsWithProps from '@/components/custom/buttons/CustomSegmentedButtonsWithProps';
import CustomConfirmAlert from '@/components/custom/alert/CustomConfirmAlert';
import { Language } from '@/dtos/enum/Language';
import uiStore from '@/stores/UIStore';
import i18n from '@/i18n';
import { router } from 'expo-router';
import userStore from '@/stores/UserStore';
import CustomButtonPrimary from '@/components/custom/buttons/CustomButtonPrimary';
import CustomButtonOutlined from '@/components/custom/buttons/CustomButtonOutlined';
import { BG_COLORS } from '@/constants/Colors';

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
  // Состояния для подтверждения смены языка
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [pendingLanguageChange, setPendingLanguageChange] = React.useState<number | null>(null);
  const [deleteAlertVisible, setDeleteAlertVisible] = React.useState(false);
  const [loiading, setLoading] = React.useState(false);
  const [pushNotification, setPushNotification] = React.useState(false);

  useEffect(() => {
      (async () => {
          const toggleState = await uiStore.getPushNotificationToggleState();
          setPushNotification(toggleState);
      })();
  }, []);

  if (selectedLanguage === -1) {
    return (
      <View className="h-full items-center justify-center">
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  if (loiading) {
    return (
      <View className="h-full items-center justify-center">
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const handlePushToggle = (value:boolean) => {
 
    setPushNotification(value);
    uiStore.setPushNotificationToggleState(value);
  };


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
    await router.replace('/(auth)/sign-in');
    BackHandler.exitApp();
  };

  const handleShowDeleteAlert = () => {
    setDeleteAlertVisible(true);
  };

const closeDeleteAlert = () => {
  setDeleteAlertVisible(false);
};

const deleteAccount = async () => {
  setLoading(true);
  const user = userStore.currentUser;
  if (!user) return;
  try{
    //await userStore.deleteUserAccount(user!.id);
    //await petStore.deletePetsFromFireStore(user!);      
    //await userStore.deleteUserFromFireStore(user!);
    const userPets = user?.petProfiles?.map((pet) => pet.id);
    if (!userPets) return;
    for (let i of userPets) {
      //await petStore.deletePetProfile(i);
      console.log('Питомцы удалены из Базы данных');
    }
    //Alert.alert(i18n.t("UserProfile.deletedProfilerAlarm", { email: user?.email }));
    userStore.signOut();
    await router.replace('/(auth)/sign-in');
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);      
  }
};

  return (
    <View className="flex-1 justify-between p-4">
      <List.Section>
        {/* <List.Item
          title={i18n.t('settings.pushNotifications')}
          right={() => (
            <Switch
              value={pushNotification}
              onValueChange={(value) => handlePushToggle(value)}
              color={BG_COLORS.indigo[800]}
            />
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
      <View>
        <View className="items-center pb-2">
          <CustomButtonPrimary handlePress={exitApp} title={i18n.t('UserProfile.logout')} containerStyles="w-full" />
        </View>
        <Divider className='my-2' />
        <View className="pb-20 items-center">
          <CustomButtonOutlined handlePress={handleShowDeleteAlert} title={i18n.t('UserProfile.deleteProfile')} containerStyles="w-full bg-white" textStyles='text-red-500'/>
        </View>
      </View>

      <CustomConfirmAlert
        isVisible={alertVisible}
        onClose={cancelLanguageChange}
        onConfirm={confirmLanguageChange}
        message={i18n.t('settings.changeLanguage')}
        confirmText={i18n.t('ok')}
        cancelText={i18n.t('cancel')}
      />
     
      <CustomConfirmAlert
        isVisible={deleteAlertVisible}
        onClose={closeDeleteAlert}
        onConfirm={deleteAccount}
        message={i18n.t('UserProfile.deleteProfileMessage')}
        confirmText={i18n.t('ok')}
        cancelText={i18n.t('cancel')}
      />
    </View>
  );
});

export default Settings;

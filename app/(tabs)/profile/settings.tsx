import React from 'react';
import { observer } from 'mobx-react-lite';
import { ActivityIndicator, View } from "react-native";
import { List, Switch } from "react-native-paper";
import CustomSegmentedButtonsWithProps from '@/components/custom/buttons/CustomSegmentedButtonsWithProps';
import { Language } from '@/dtos/enum/Language';
import uiStore from '@/stores/UIStore';
import i18n from '@/i18n';

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
  // Вычисляем индекс каждый рендер на основе uiStore.currentLanguage
  const selectedLanguage = languageToIndex(uiStore.currentLanguage);

  const [sosEnabled, setSosEnabled] = React.useState(false);

  // Если currentLanguage до сих пор не инициализирован, ждём
  if (selectedLanguage === -1) {
    return (
      <View className="h-full items-center justify-center">
        <ActivityIndicator size="large" color="#6200ee"  />
      </View>
    );
  }

  const handleToggleSos = () => setSosEnabled(!sosEnabled);

  const handleLanguageChange = async (value: number) => {
    let newLang = Language.Spanish;
    if (value === 1) newLang = Language.Russian;
    if (value === 2) newLang = Language.English;

    await uiStore.setSystemLanguage(newLang);
    // Никаких локальных setState для языка, rely on uiStore.currentLanguage
  };

  return (
    <View className="pl-4">
      <List.Section>
        <List.Subheader>{i18n.t('settings.general')}</List.Subheader>
        <List.Item
          title={i18n.t('settings.pushNotifications')}
          right={() => (
            <Switch value={sosEnabled} onValueChange={handleToggleSos} />
          )}
          titleStyle={{ fontFamily: "NunitoSans_400Regular" }}
        />

        <List.Item
          title={i18n.t('settings.appLanguage')}
          description={() => (
            <CustomSegmentedButtonsWithProps
              values={selectedLanguage}
              onValueChange={(value: number | number[]) => handleLanguageChange(value as number)}
              buttons={[
                { label: i18n.t('settings.languages.spanish'), icon: 'language' },
                { label: i18n.t('settings.languages.russian'), icon: 'language' },
                { label: i18n.t('settings.languages.english'), icon: 'language' },
              ]}
            />
          )}
          titleStyle={{ fontFamily: 'NunitoSans_400Regular' }}
        />
      </List.Section>
    </View>
  );
});

export default Settings;
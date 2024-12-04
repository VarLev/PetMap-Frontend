import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View } from "react-native";
import { List, Switch } from "react-native-paper";
import CustomSegmentedButtonsWithProps from '@/components/custom/buttons/CustomSegmentedButtonsWithProps';
import { Language } from '@/dtos/enum/Language';
import uiStore from '@/stores/UIStore';

const Settings = observer(() => {
  const [sosEnabled, setSosEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<number[]>([0]); // По умолчанию выбираем первый язык
  const handleToggleSos = () => setSosEnabled(!sosEnabled);

  const handleLanguageChange = async (value: number[]) => {
    setSelectedLanguage(value);
    switch (value[0]) {
      case 0:
        console.log('Выбран русский язык');
        await uiStore.setSystemLanguage(Language.Russian);
        await uiStore.setLanguagei18n(Language.Russian);
        break;
      case 1:
        console.log('Выбран английский язык');
        await uiStore.setSystemLanguage(Language.English);
        await uiStore.setLanguagei18n(Language.English);
        break;
      case 2:
        console.log('Выбран испанский язык');
        await uiStore.setSystemLanguage(Language.Spanish);
        await uiStore.setLanguagei18n(Language.Spanish);
        break;
    }

  };

  return (
    <View className="pl-4">
      <List.Section >
        <List.Subheader>Общие настройки</List.Subheader>
        <List.Item
          title="Push-уведомления"
          right={() => (
            <Switch value={true} onValueChange={handleToggleSos} />
          )}
          titleStyle={{ fontFamily: "NunitoSans_400Regular" }}
        />
       
        <List.Item
          title="Язык приложения"
          description={() => (
            <CustomSegmentedButtonsWithProps
              values={selectedLanguage}
              onValueChange={(value) => handleLanguageChange(value)}
              buttons={[
                { label: 'Русский', icon: 'language' },
                { label: 'English', icon: 'language' },
                { label: 'Español', icon: 'language' },
              ]}
              containerStyles="mt-4"
              singleSelect
            />
          )}
          titleStyle={{ fontFamily: 'NunitoSans_400Regular' }}
        />
      </List.Section>
    </View>
  );
});

export default Settings;
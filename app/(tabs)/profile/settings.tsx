import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View } from "react-native";
import { List, Switch } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import CustomSegmentedButtonsWithProps from '@/components/custom/buttons/CustomSegmentedButtonsWithProps';

const Settings = observer(() => {
  const [sosEnabled, setSosEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<number[]>([0]); // По умолчанию выбираем первый язык
  const handleToggleSos = () => setSosEnabled(!sosEnabled);

  return (
    <View className="pl-4">
      <List.Section>
        <List.Subheader>Some title</List.Subheader>
        <List.Item
          title="SOS Оповещения"
          left={() => (
            <List.Icon
              icon={() => <Feather name="bell" size={20} color="#474747" />}
            />
          )}
          right={() => (
            <Switch value={sosEnabled} onValueChange={handleToggleSos} />
          )}
          titleStyle={{ fontFamily: "NunitoSans_400Regular" }}
        />
        {/* Настройка языка */}
        <List.Item
          title="Язык приложения"
          description={() => (
            <CustomSegmentedButtonsWithProps
              values={selectedLanguage}
              onValueChange={(value) => setSelectedLanguage(value)}
              buttons={[
                { label: 'Русский', icon: 'language' },
                { label: 'English', icon: 'language' },
                { label: 'Español', icon: 'language' },
              ]}
              containerStyles="mt-4"
            />
          )}
          titleStyle={{ fontFamily: 'NunitoSans_400Regular' }}
        />
      </List.Section>
    </View>
  );
});

export default Settings;
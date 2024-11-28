import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View } from "react-native";
import { List, Switch } from "react-native-paper";
import { Feather } from "@expo/vector-icons";

const Settings = observer(() => {
  const [sosEnabled, setSosEnabled] = useState(false);
  const handleToggleSos = () => setSosEnabled(!sosEnabled);

  return (
    <View className="pl-4">
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
    </View>
  );
});

export default Settings;
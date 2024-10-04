import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";

import { router } from "expo-router";

function ArrowHelp() {
  const handleBack = () => {
    router.back(); // Возврат на предыдущий экран
  };

  return (
    <View className="flex-row justify-between mx-2">
      <IconButton icon="arrow-left" size={30} onPress={handleBack} />
      <Text
        onPress={() => console.log("press help")}
        className="text-lg font-nunitoSansBold"
      >
        Помощь
      </Text>
    </View>
  );
}

export default ArrowHelp;

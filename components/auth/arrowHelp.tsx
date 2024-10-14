import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { router } from "expo-router";
import i18n from "@/i18n"; // Импорт i18n для мультиязычности

function ArrowHelp() {
  const handleBack = () => {
    router.back(); // Возврат на предыдущий экран
  };

  return (
    <View className="flex-row justify-between items-center mx-2">
      <IconButton icon="arrow-left" size={30} onPress={handleBack} />
      <Text
        onPress={() => console.log("press help")}
        className="text-lg font-nunitoSansBold"
      >
        {i18n.t('arrowHelp.help')}
      </Text>
    </View>
  );
}

export default ArrowHelp;

import { View } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/AntDesign";
import { router } from "expo-router";

function ArrowHelp() {
  const handleBack = () => {
    router.back(); // Возврат на предыдущий экран
  };

  return (
    <View className="flex-row justify-between mx-2">
      <Icon name="arrowleft" size={30} onPress={handleBack} />
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

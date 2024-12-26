import { Text, View, Image, SafeAreaView, Dimensions } from "react-native";
import { router } from "expo-router";
import i18n from "@/i18n";

function EmptyChatScreen() {

  const handleBack = () => {
    router.push('/(tabs)/map/');
  }

  const handleAllUsers = () => {
   console.log('all users')
  }
    

  const { width, height } = Dimensions.get("window");

  return (
    <SafeAreaView className="flex-1">
    <View className="flex-1 justify-start items-center">
      <View className="items-center justify-center">
        <Image
          style={{ width: width, height: height * 0.5 }}
          resizeMode="contain"
          source={require("@/assets/images/Placeholder.png")}
        />
        <Text className="text-center text-xl mt-4 font-nunitoSansBold py-2">
          {i18n.t("chat.noMessages")}
        </Text>
      </View>
    </View>
  </SafeAreaView>
  );
}

export default EmptyChatScreen;

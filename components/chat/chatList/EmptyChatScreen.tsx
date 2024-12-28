import { Text, View, Image, SafeAreaView, Dimensions } from "react-native";
import { IconButton } from "react-native-paper";
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
    <SafeAreaView className="bg-white h-full">
      <View className="justify-start ">
        <View className="justify-between items-center  ">
          <View className="items-center  justify-center  ">
            <View className="items-center justify-center 0 ">
            <Image
            style={{ width: width, height: height * 0.5 }}
              resizeMode="contain"
              
              source={require("@/assets/images/Placeholder.png")}
            />
            </View>
          <Text className="text-center text-xl mt-4 font-nunitoSansBold py-2">{i18n.t("chat.noMessages")}</Text>
          {/* <Text className="text-[16px] font-nunitoSansRegular text-center p-2">
            {i18n.t("chat.enterInSection")}<Text onPress={handleAllUsers} className="color-[#2F00B6] font-bold">{i18n.t("chat.allUsers")} </Text> {i18n.t("chat.or")} <Text onPress={handleBack} className="color-[#2F00B6] font-bold">{i18n.t("chat.map")} </Text> {i18n.t("chat.newConnections")}
          </Text> */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default EmptyChatScreen;

import { Text, View, Image, SafeAreaView, Dimensions } from "react-native";
import { IconButton } from "react-native-paper";
import { router } from "expo-router";

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
      <View className="flex-row items-center justify-start  py-2 mt-8">
        <View className="flex-row items-center">
        <IconButton icon="arrow-left" size={24} onPress={handleBack} />
        <Text className="text-lg font-nunitoSansBold">Сообщения</Text>
        </View>
      </View>
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
          <Text className="text-center text-xl mt-4 font-nunitoSansBold py-2">У вас нет сообщений </Text>
          <Text className="text-[16px] font-nunitoSansRegular text-center p-2">
            Чтобы начать общение, перейдите в раздел <Text onPress={handleAllUsers} className="color-[#2F00B6] font-bold">Все пользователи </Text> или <Text onPress={handleBack} className="color-[#2F00B6] font-bold">Карта </Text> и
            заводите новые знакомства!
          </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default EmptyChatScreen;

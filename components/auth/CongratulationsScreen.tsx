import { View, Text, Image, ImageBackground } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import CustomButtonOutlined from "../custom/buttons/CustomButtonOutlined";

function CongratulationsScreen() {
  return (
    <>
      <View className="flex-1">
        <Svg height="100%" width="100%" className="absolute">
          <Defs>
            <RadialGradient
              id="grad"
              cx="10.38%"
              cy="0.32%"
              rx="99.68%"
              ry="99.68%"
              fx="10.38%"
              fy="0.32%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#BC88FF" />
              <Stop offset="100%" stopColor="#2F00B6" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </Svg>

        <View className="">
          <View className="h-[30%]">
            <Image
              className="w-full"
              source={require("@/assets/images/FrameTop.png")}
              resizeMode="contain"
            />
          </View>
          <View className="px-4">
            <Text className="text-[20px] font-nunitoSansBold text-center color-white my-4 mt-10">
              Вы прошли первичную регистрацию!
            </Text>
            <Text className=" leading-tight text-md font-nunitoSansRegular text-center color-white mb-4">
              Так держать! Теперь ваш профиль активирован. Получите свои первые
              бонусы
            </Text>
            <View className="flex-row justify-center items-center gap-3">
              <Image
                className="w-[55px] h-[55px]"
                source={require("@/assets/images/bonuse.png")}
                resizeMode="contain"
              />
              <Text className="text-[60px] color-white font-nunitoSansBold">
                50
              </Text>
            </View>
            <Text className="color-white text-[16px] font-nunitoSansBold text-center mb-2">
              PetBonuses
            </Text>
            <CustomButtonOutlined
              title="Забрать бонусы"
              handlePress={() => console.log("Pressed")}
              containerStyles="w-full  bg-[#ACFFB9] my-4"
              textStyles=""
            />
            <Text className="color-white text-[15px] font-nunitoSansBold text-center mt-2">
              Перейти в профиль
            </Text>
          </View>
          <View className="h-[10%] mt-[-50px]">
          <Image
            className="w-full"
            source={require("@/assets/images/FrameBottom.png")}
            resizeMode="contain"
          />
          </View>
        </View>
      </View>
    </>
  );
}

export default CongratulationsScreen;

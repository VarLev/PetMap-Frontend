import { View, Text, Image, StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import CustomButtonOutlined from "../custom/buttons/CustomButtonOutlined";
import React, { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
import userStore from "@/stores/UserStore";
import { JobType } from "@/dtos/enum/JobType";
import i18n from '@/i18n';
import uiStore from "@/stores/UIStore";
import { Language } from "@/dtos/enum/Language";

function CongratulationsScreen() {
  const [benefites, setBenefits] = useState<number>(0);
  const confettiRef = useRef<LottieView>(null);

  useEffect(() => {
    const fetchBonuses = async () => {
      const bonuses = await userStore.getEarnedBenefitsByJobType(userStore.currentUser?.id!, JobType.FillOnboarding);
      setBenefits(bonuses);
      console.log(bonuses);
      confettiRef.current?.play(); 
    };
    fetchBonuses();
  }, []);

  const handlePress = async () => {
    const languageMap: { [key: string]: Language } = {
      'ru': Language.Russian,
      'en': Language.English,
      'es': Language.Spanish,
    };

    const selectedLanguage = languageMap[i18n.locale];
    if (selectedLanguage) {
      await uiStore.setSystemLanguage(selectedLanguage);
    }
  };

  return (
    <>
      <View className="h-full">
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
        <View style={styles.lottieContainer} pointerEvents="none">
          <LottieView
            ref={confettiRef}
            source={require('@/assets/animations/confetti.json')}
            autoPlay={false}
            loop={false}
            style={styles.lottie}
            resizeMode="cover"
          />
        </View>

        <View className="-mt-10 h-full">
          <View className="h-[30%]">
            <Image
              className="w-full"
              source={require("@/assets/images/FrameTop.png")}
              resizeMode="contain"
            />
          </View>
          <View className="px-4">
            <Text className="text-[20px] font-nunitoSansBold text-center color-white my-4 mt-10">
              {i18n.t('congratulations.title')} 
            </Text>
            <Text className="leading-tight text-md font-nunitoSansRegular text-center color-white mb-4">
              {i18n.t('congratulations.subtitle')} 
            </Text>
            <View className="flex-row justify-center items-center gap-3">
              <Image
                className="w-[55px] h-[55px]"
                source={require("@/assets/images/bonuse.png")}
                resizeMode="contain"
              />
              <Text className="text-[60px] color-white font-nunitoSansBold">
                {benefites}
              </Text>
            </View>
            <Text className="color-white text-[16px] font-nunitoSansBold text-center mb-2">
              {i18n.t('congratulations.petBonuses')} 
            </Text>
            <CustomButtonOutlined
              title={i18n.t('congratulations.button')} 
              handlePress={handlePress}
              containerStyles="w-full bg-[#ACFFB9] my-4"
            />
          </View>
          <View className="h-[10%]">
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

const styles = StyleSheet.create({
  lottieContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  lottie: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000, 
    pointerEvents: 'none'
  },
});

export default CongratulationsScreen;

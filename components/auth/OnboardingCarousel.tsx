import React, {  useRef } from "react";
import {
  View,
  Dimensions,
  Image,
  StyleSheet, 
} from "react-native";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { Text } from "react-native-paper";
import i18n from "@/i18n";


const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const data = [
  {
    id: 1,
    titleKey: "onboarding.slide1.title", // Ключ для перевода
    image: require("@/assets/images/onboarding/OnbordingMap.png"),
  },
  {
    id: 2,
    titleKey: "onboarding.slide2.title", // Ключ для перевода
    image: require("@/assets/images/onboarding/OnbordingLocation.png"),
  },
  {
    id: 3,
    titleKey: "onboarding.slide3.title", // Ключ для перевода
    image: require("@/assets/images/onboarding/OnbordingServices.png"),
  },
  {
    id: 4,
    titleKey: "onboarding.slide4.title", // Ключ для перевода
    image: require("@/assets/images/onboarding/OnboardingEvents.png"),
  },
];

const OnboardingCarousel: React.FC = () => {
  const ref = useRef<ICarouselInstance>(null);

  const progress = useSharedValue<number>(0);
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View>
      <Carousel
        loop={true}
        width={width}
        ref={ref}
        pagingEnabled={true}
        enabled={true}
        height={height * 0.55} // 480
        autoPlay={true}
        data={data}
        onProgressChange={progress}
        scrollAnimationDuration={2500}
        autoPlayInterval={2500}
        renderItem={({ item }) => (
          <View className="items-center h-full flex-col">
            <Image source={item.image} style={styles.image} />
            <Text
              variant="titleSmall"
              className="pt-3 px-3 text-base text-center font-nunitoSansRegular"
            >
              {i18n.t(item.titleKey)}
            </Text>
          </View>
        )}
      />
      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{
          backgroundColor: "rgba(55, 48, 163, 0.4)",
          borderRadius: 50,
        }}
        activeDotStyle={{
          borderRadius: 50,
          backgroundColor: "rgba(55, 48, 163, 1)",
        }}
        containerStyle={{ gap: 10 }}
        onPress={onPressPagination}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  image: {
    justifyContent: "flex-start",
    width: "80%",
    height: 340, //400
    borderStartColor: "transparent",
    top: 0,
    borderRadius: 30,
  },
  text: {
    textAlign: "center",
    color: "black",
    fontSize: 24,
    paddingTop: 1000,
  },
 
});

export default OnboardingCarousel;

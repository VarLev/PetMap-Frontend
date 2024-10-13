import React from "react";
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import { Text } from "react-native-paper";
import i18n from '@/i18n';

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
  const ref = React.useRef<ICarouselInstance>(null);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);

  const handleScroll = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        width={width}
        ref={ref}
        height={height * 0.6} // 480
        autoPlay={true}
        data={data}
        onSnapToItem={handleScroll}
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
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
            onPress={() => {
              ref.current?.scrollTo({
                count: index - currentIndex,
                animated: true,
              });
              setCurrentIndex(index);
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    flexDirection: "column",
    justifyContent: "center",
  },
  image: {
    justifyContent: "center",
    width: "80%",
    height: 360, //400
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(55, 48, 163, 0.4)",
    margin: 6,
  },
  activeDot: {
    backgroundColor: "rgba(55, 48, 163, 1)",
  },
});

export default OnboardingCarousel;

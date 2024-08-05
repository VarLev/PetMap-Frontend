import React from 'react';
import { View, Dimensions, Image ,StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {Text} from 'react-native-paper';

const { width } = Dimensions.get('window');

const data = [
  {
    id:1,
    title: 'Заводите новые знакомства с владельцами питомцев. Ходите на совместные прогулки.',
    image:'https://placehold.co/400x700.png'
  },
  {
    id:2,
    title: 'Все полезные локации в одном приложении: ветеринарные клиники, парки и многое другое.',
    image:'https://placehold.co/400x700.png'
  },
  {
    id:3,
    title: 'Выбирайте проверенных специалистов для различных услуг: груминг, кинолог и др',
    image:'https://placehold.co/400x700.png'
  },
  {
    id:4,
    title: 'Будьте в курсе всех мероприятий для питомцев.',
    image:'https://placehold.co/400x700.png'
  }
];

const OnboardingCarousel: React.FC = () => {


  return (
    <Carousel
      loop
      width={width}
      height={480}
      autoPlay={true}
      data={data}
      scrollAnimationDuration={2500}
      autoPlayInterval={2500}
      renderItem={({ item }) => (
        <View className='items-center h-full flex-col'> 
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text variant='titleSmall' className='p-3 text-base text-center font-nunitoSansRegular'>{item.title}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    flexDirection: 'column',
    justifyContent: 'center',
   
   
  },
  image: {
    justifyContent: 'center',
    width: '90%',
    height: 400,
    borderStartColor:'transparent',
    top: 0,
    borderRadius: 30,
  },
  text: {
    textAlign: 'center',
    color: 'black',
    fontSize: 24,
    paddingTop: 1000,

  },
});

export default OnboardingCarousel;

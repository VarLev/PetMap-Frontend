import React from 'react';
import { View, Dimensions, Image ,StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {Text} from 'react-native-paper';

const { width } = Dimensions.get('window');

const data = [
  {
    id:1,
    title: 'Текст для онбординга 1',
    image:'https://placehold.co/400x700.png'
  },
  {
    id:2,
    title: 'Текст для онбординга 2',
    image:'https://placehold.co/400x700.png'
  },
  {
    id:3,
    title: 'Текст для онбординга 3',
    image:'https://placehold.co/400x700.png'
  }
];

const OnboardingCarousel: React.FC = () => {


  return (
    <Carousel
      style={styles.onBording}
      loop
      width={width}
      height={650}
      autoPlay={true}
      data={data}
      scrollAnimationDuration={2000}
      autoPlayInterval={2000}
      renderItem={({ item }) => (
        <View style={styles.carouselItem}> 
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text variant='titleSmall' style={styles.text}>{item.title}</Text>
          
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
  onBording:{
  
  },
  image: {
    width: '100%',
    height: 630,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  text: {
    textAlign: 'center',
    color: 'black',
    fontSize: 24,
    paddingTop: 550,

  },
});

export default OnboardingCarousel;

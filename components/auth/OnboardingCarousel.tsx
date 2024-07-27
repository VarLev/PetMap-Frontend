import React from 'react';
import { View, Dimensions, Image ,StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {Text} from 'react-native-paper';

const { width } = Dimensions.get('window');

const data = [
  {
    id:1,
    title: 'Text for onboarding 1',
    image:'https://placehold.co/400x700.png'
  },
  {
    id:2,
    title: 'Text for onboarding 2',
    image:'https://placehold.co/400x700.png'
  },
  {
    id:3,
    title: 'Text for onboarding 3',
    image:'https://placehold.co/400x700.png'
  }
];

const OnboardingCarousel: React.FC = () => {


  return (
    <Carousel
      loop
      width={width}
      height={550}
      autoPlay={true}
      data={data}
      scrollAnimationDuration={2000}
      autoPlayInterval={2000}
      renderItem={({ item }) => (
        <View className='flex-1 items-center justify-center bg-white flex-col'> 
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text variant='titleSmall' className='flex-1 text-3xl font-pextra'>{item.title}</Text>
          
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
    height: 550,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  text: {
    textAlign: 'center',
    color: 'black',
    fontSize: 24,
    paddingTop: 1000,

  },
});

export default OnboardingCarousel;

import { useRef, useEffect } from 'react';
import { Button, StyleSheet, View, Image} from 'react-native';
import LottieView from 'lottie-react-native';

export default function AnimationScreenHolder() {
  const animation = useRef<LottieView>(null);
  useEffect(() => {
    // You can control the ref programmatically, rather than using autoPlay
    // animation.current?.play();
  }, []);

  return (
    <View style={styles.animationContainer}>
      <Image source={require('@/assets/animations/images/img_1.jpg')} style={{width: "100%", height: "100%", position:'absolute'}}/>
      <LottieView
        autoPlay
        ref={animation}
        style={{width: "100%", height: "100%", backgroundColor:'transparent'}}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require('@/assets/animations/screensaver.json')}
        imageAssetsFolder='assets/animations/images'
        loop = {false}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
  },
});

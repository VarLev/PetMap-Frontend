import React from 'react';
import { View, Image} from 'react-native';


const ScreenHolderLogo = () => {

  return (
    <View >
      <Image source={require('@/assets/images/splash.png')} className='h-full w-full'/>
    </View>
  );
};

export default ScreenHolderLogo;
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import OnboardingCarousel from '../components/auth/OnboardingCarousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Image} from 'react-native';
import Images from '@/constants/Images';
import CustomButtonPrimary from '@/components/customButtons/CustomButtonPrimary';
import { Redirect, router } from 'expo-router';
import { useStore } from '@/contexts/StoreProvider';


const App = () => {
  const { loading, isLogged } = useStore();

  console.log(loading, isLogged);
  if (!loading && isLogged) return <Redirect href="/map" />;
 
  //return <Redirect href="/onboarding" />;

  return (
      <SafeAreaView className='bg-violet-100 h-full'>
        <ScrollView contentContainerStyle={{height:'100%'}}>
          <View className='w-full h-full px-4 justify-center'>
            <View className='flex-row items-start justify-center '>
              <Image source={Images.logo} className='w-[80px] h-[60px]' resizeMode='center'/>
              <Text variant='titleSmall' className='ml-0 text-4xl font-pblack mt-4 text-violet-900'>PetMap</Text>
            </View>  
            <View className='flex-1 justify-center items-center '>
              <OnboardingCarousel />
            </View>
            <View className='w-full space-x-7 items-center'>
              <CustomButtonPrimary 
                title='Get Started!' 
                handlePress={() => router.push('/sign-up')} 
                containerStyles='w-full' 
              />        
              <CustomButtonPrimary 
                title='Log In' 
                handlePress={() => router.push('/sign-in')} 
                containerStyles='w-full bg-white border border-violet-900 mt-4 mb-4'
                textStyles='text-violet-900' 
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
};


export default App;



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
import CustomButtonOutlined from '@/components/customButtons/CustomButtonOutlined';


const App = () => {
  const { loading, isLogged } = useStore();

  console.log(loading, isLogged);
  //if (!loading && isLogged) return <Redirect href="/map" />;
 
  return <Redirect href="/onboarding" />;

  return (
      <SafeAreaView className='bg-white h-full'>
        <ScrollView >
          <View className='w-full h-full px-4 justify-center '>
            <View className='flex-row mt-2 items-start justify-center '>
              <Text variant='titleSmall' className='ml-0 text-2xl font-nunitoSansBold mt-4'>Добро пожаловать в PetMap!</Text>
            </View>  
            <View className='flex-1 pt-2 justify-center items-center '>
              <OnboardingCarousel />
            </View>
            <View className='pt-5'>
              <CustomButtonPrimary 
                title='Регистрация' 
                handlePress={() => router.push('/sign-up')} 
                containerStyles='w-full' 
              />        
              <CustomButtonOutlined
                title='Уже есть аккаунт' 
                handlePress={() => router.push('/sign-in')} 
                containerStyles='w-full'
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
};


export default App;



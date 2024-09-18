import React from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProfile from '@/components/auth/OnBoardingProfile';
import userStore from '@/stores/UserStore';
import { IUser } from '@/dtos/Interfaces/user/IUser';

const Onboarding = () => {

  
 
  
  const handleLanguageSelect = (selectedLanguage: number) => {
    userStore.updateUserOnbordingData({ 
      userLanguages: [selectedLanguage], 
      systemLanguage: selectedLanguage,
    });
  };

  const handleComplete = async (user: IUser) => {
    
    await userStore.updateUserOnbordingData(user);
    router.replace('/map');
  
    
  };


  return (
      <SafeAreaView className='bg-violet-100 h-full'>
          <OnboardingProfile 
            onLanguageSelect={handleLanguageSelect}
            onComplete={handleComplete}/>    
      </SafeAreaView>
  );
};

export default Onboarding;

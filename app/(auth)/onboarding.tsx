import React from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProfile from '@/components/auth/OnBoardingProfile';
import userStore from '@/stores/UserStore';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import { BonusProvider } from '@/contexts/BonusContex';
import PermissionsRequestComponent from '@/components/auth/PermissionsRequestComponent';

const Onboarding = () => {

  const handleLanguageSelect = (selectedLanguage: number) => {
    userStore.updateUserOnbordingData({ 
      userLanguages: [selectedLanguage], 
      systemLanguage: selectedLanguage,
    });
  };

  const handleComplete = async (user: IUser) => {
    await userStore.updateUserOnbordingData(user);
    router.replace('/congrats');
  };

  const handleEscape = async (user: IUser) => {
    userStore.updateUserOnbordingData(user);
    router.replace('/map');
  };

  return (
    <BonusProvider>
      <SafeAreaView className='bg-white h-full'>
        <PermissionsRequestComponent/>
          <OnboardingProfile 
            onLanguageSelect={handleLanguageSelect}
            onComplete={handleComplete}  
            onEscape={handleEscape}/>      
      </SafeAreaView>
    </BonusProvider>
  );
};

export default Onboarding;

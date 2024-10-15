import React from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProfile from '@/components/auth/OnBoardingProfile';
import userStore from '@/stores/UserStore';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import { BonusProvider } from '@/contexts/BonusContex';
import PermissionsRequestComponent from '@/components/auth/PermissionsRequestComponent';
import i18n from '@/i18n';

const Onboarding = () => {

  const handleLanguageSelect = (selectedLanguage: number) => {
    userStore.updateUserOnbordingData({ 
      userLanguages: [selectedLanguage], 
      systemLanguage: selectedLanguage,
    });
    if(selectedLanguage === 2) {
      i18n.locale = 'en';
    }
    else if(selectedLanguage === 0) {
      i18n.locale = 'es';
    }else {
      i18n.locale = 'ru';
    }
  };

  const handleComplete = async (user: IUser) => {
    await userStore.updateUserOnbordingData(user);
    router.replace('/congrats');
  };

  const handleEscape = async (user: IUser) => {
    await userStore.updateUserOnbordingData(user);
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

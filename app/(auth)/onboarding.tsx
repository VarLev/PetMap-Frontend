import React from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProfile from '@/components/auth/OnBoardingProfile';
import userStore from '@/stores/UserStore';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import { BonusProvider } from '@/contexts/BonusContex';
import PermissionsRequestComponent from '@/components/auth/PermissionsRequestComponent';
import uiStore from '@/stores/UIStore';

const Onboarding = () => {
  const [selectedLanguage, setSelectedLanguage] = React.useState<number>(0);

  const handleLanguageSelect = async (selectedLanguage: number) => {
    await uiStore.setLanguagei18n(selectedLanguage);
    setSelectedLanguage(selectedLanguage);
  };

  const handleComplete = async (user: IUser) => {
    user.systemLanguage = selectedLanguage;
    user.userLanguages = [selectedLanguage];
    await userStore.updateUserOnbordingData(user);
    router.replace('/congrats');
  };

  return (
    <BonusProvider>
      <SafeAreaView className="bg-white h-full">
        <PermissionsRequestComponent />
        <OnboardingProfile onLanguageSelect={handleLanguageSelect} onComplete={handleComplete} onEscape={() => {}} />
      </SafeAreaView>
    </BonusProvider>
  );
};

export default Onboarding;

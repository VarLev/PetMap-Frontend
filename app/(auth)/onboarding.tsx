import React, { useState } from 'react';
import { Text, Button, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProfile from '@/components/auth/OnBoardingProfile';

const Onboarding = () => {
  const [language, setLanguage] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{ name: string, birthDate: Date } | null>(null);
  const [petInfo, setPetInfo] = useState<{ petName: string, breed: string | null, petBirthDate: Date } | null>(null);

  const handleLanguageSelect = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
  };

  const handleUserInfoSubmit = (name: string, birthDate: Date) => {
    setUserInfo({ name, birthDate });
  };

  const handlePetInfoSubmit = (petName: string, breed: string | null, petBirthDate: Date) => {
    setPetInfo({ petName, breed, petBirthDate });
  };

  return (
    <SafeAreaView className='bg-violet-100 h-full'>
      <ScrollView>
        <OnboardingProfile 
          onLanguageSelect={handleLanguageSelect}
          onUserInfoSubmit={handleUserInfoSubmit}
          onPetInfoSubmit={handlePetInfoSubmit} 
          onComplete={
            function (): void { router.replace('/map');}}/>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Onboarding;

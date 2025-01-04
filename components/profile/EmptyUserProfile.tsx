import React from 'react';
import { View, Text, Image } from 'react-native';
import { useStore } from '@/contexts/StoreProvider';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import { router } from 'expo-router';
import i18n from '@/i18n'; // Подключение i18n для мультиязычности

export default function EmptyUserProfile() {
  const { currentUser } = useStore();
  
  const handleCompleteProfile = () => {
    // Перейти на экран редактирования профиля
    router.push('/profile/edit');
  };

  return (
    <View className='h-full justify-center bg-white'>
      <View className="items-center justify-center p-5 bg-white">
        <Text className="text-lg font-semibold mb-2">
          {i18n.t('emptyProfile.welcome')} {currentUser?.name ?? currentUser?.email}!
        </Text>
        <Text className="text-center text-gray-600 mb-4">
          {i18n.t('emptyProfile.description')}
        </Text>
        <Image
          source={require('../../assets/images/onboardingProfile/3user.webp')} // Замените на путь к вашему изображению
          className="h-64 mb-6"
          resizeMode="contain"
        />
        <CustomButtonOutlined
          title={i18n.t('emptyProfile.button')}
          handlePress={handleCompleteProfile}
          containerStyles='w-full'
        />
      </View>
    </View>
  );
}

import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '@/contexts/StoreProvider';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';

export default function EmptyUserProfile() {
  const navigation = useNavigation();
  const { currentUser } = useStore();
  
  const handleCompleteProfile = () => {
    // Перейти на экран редактирования профиля
    //navigation.navigate('profile/edit');
  };

  return (
    <View className="items-center justify-center  p-5 bg-white">
      <Text className="text-lg font-semibold mb-2">
        Добро пожаловать {currentUser?.name?? currentUser?.email}!
      </Text>
      <Text className="text-center text-gray-600 mb-4">
        Чтобы продолжить необходимо заполнить данные профиля.
      </Text>
      <Image
        source={require('@/assets/images/onboardingProfile/3user.webp')} // Замените на путь к вашему изображению
        className="h-64 mb-6"
        resizeMode="contain"
      />
      <CustomButtonOutlined title='Рассказать о себе' handlePress={handleCompleteProfile} containerStyles='w-full '/>
    </View>
  );
}

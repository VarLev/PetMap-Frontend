import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import ViewProfileComponent from '@/components/profile/ViewProfileComponent';
import { router, useLocalSearchParams } from 'expo-router';
import { IUser } from '@/dtos/Interfaces/user/IUser';

const UserProfileCommon = observer(() => {
  const { userId } = useLocalSearchParams(); // Получаем id из параметров маршрута
  const [editableUser, setEditableUser] = useState<IUser | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); // Устанавливаем состояние загрузки
      setEditableUser(null); // Очищаем данные предыдущего пользователя
      
      if (userId) {
        console.log(userId);
        const user = await userStore.getUserById(userId as string); // Получаем пользователя по ID
        setEditableUser(user);
      }
      setLoading(false); // Выключаем состояние загрузки
    };

    fetchUser();
  }, [userId]); // Добавляем зависимость на изменение id

  const handlePetOpen = (petId:string) => {
    router.push(`(pet)/${petId}`);
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6200ee"  />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <ViewProfileComponent
        loadedUser={editableUser!}
        onEdit={() => {}}
        onPetOpen={(petId:string) => handlePetOpen(petId)}
      />
    </View>
  );
});

export default UserProfileCommon;

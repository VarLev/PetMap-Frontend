import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import ViewProfileComponent from '@/components/profile/ViewProfileComponent';
import EmptyUserProfile from '@/components/profile/EmptyUserProfile';
import { router, useLocalSearchParams } from 'expo-router';
import { IUser } from '@/dtos/Interfaces/user/IUser';

const UserProfile = observer(() => {
  const { id } = useLocalSearchParams(); // Получаем id из параметров маршрута
  const [editableUser, setEditableUser] = useState<IUser | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchUser = async () => {
      setLoading(true); // Устанавливаем состояние загрузки
      setEditableUser(null); // Очищаем данные предыдущего пользователя
      setIsEmpty(false); // Сбрасываем состояние пустого профиля

      
      if (id) {
        const user = await userStore.getUserById(id as string); // Получаем пользователя по ID
        setEditableUser(user);
        if (!user?.name) {
          setIsEmpty(true);
        }
      }
      setLoading(false); // Выключаем состояние загрузки
    };

    fetchUser();
  }, [id]); // Добавляем зависимость на изменение id

  const handlePetOpen = (petId:string) => {
    router.push(`/profile/pet/${petId}`);
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      {isEmpty ? (
        <EmptyUserProfile />
      ) : (
        <ViewProfileComponent
          loadedUser={editableUser!}
          onEdit={() => {}}
          onPetOpen={(petId:string) => handlePetOpen(petId)}
        />
      )}
    </View>
  );
});

export default UserProfile;

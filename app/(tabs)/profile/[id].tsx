import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import ViewProfileComponent from '@/components/profile/ViewProfileComponent';
import EmptyUserProfile from '@/components/profile/EmptyUserProfile';
import { router, useLocalSearchParams } from 'expo-router';
import { IUser } from '@/dtos/Interfaces/user/IUser';

const UserProfile = observer(() => {
  const { id } = useLocalSearchParams(); // Получаем id из параметров маршрута
  const [editableUser, setEditableUser] = useState<IUser>();
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        const user = await userStore.getUserById(id as string); // Получаем пользователя по ID
        setEditableUser(user);
        if (!user?.name) {
          setIsEmpty(true);
        }
      }
    };

    fetchUser();
  }, [id]);

  const handlePetOpen = (petId:string) => {
    router.push(`/profile/pet/${petId}`);
  }

  if (!editableUser) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <View>
      {isEmpty ? (
        <EmptyUserProfile />
      ) : (
        <ViewProfileComponent
          loadedUser={editableUser}
          onEdit={() => {}}
          onPetOpen={(petId:string) => handlePetOpen(petId)}
        />
      )}
    </View>
  );
});

export default UserProfile;

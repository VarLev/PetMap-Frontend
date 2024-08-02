import { View, Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import { SafeAreaView } from 'react-native-safe-area-context';

import 'nativewind';

import EditProfileComponent from '@/components/profile/EditProfileComponent';
import ViewProfileComponent from '@/components/profile/ViewProfileComponent';
import { User } from '@/dtos/classes/user/UserDTO';

const Profile = observer(() => {
  const [editableUser, setEditableUser] = useState<User>();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    setIsEditing(false);
    userStore.loadUser(); 
  };

  const handleCancel = () => setIsEditing(false);
  useEffect(() => {
    // Загрузка данных пользователя, если они еще не загружены
    if (!userStore.currentUser) {
      userStore.loadUser();
    } else {
      console.log('asdasdadasdasdasdasdasdasdasdasd',userStore.currentUser);
      setEditableUser(userStore.currentUser);
      
    }
  }, []);

  
  const handleChange = (field: keyof IUser, value: any) => {
    if (editableUser) {
      setEditableUser({ ...editableUser, [field]: value });
    }
  };

  if (!editableUser) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className='bg-violet-100 h-full p-5'>
      <View className='mb-20'>
        {isEditing ? (
          <EditProfileComponent onSave={handleSave} onCancel={handleCancel} />
        ) : (
          <ViewProfileComponent onEdit={handleEdit} />
        )}
      </View>
    </SafeAreaView>
  );
});

export default Profile;

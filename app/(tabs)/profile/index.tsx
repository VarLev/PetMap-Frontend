import { View, Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import { SafeAreaView } from 'react-native-safe-area-context';

import ViewProfileComponent from '@/components/profile/ViewProfileComponent';
import { User } from '@/dtos/classes/user/UserDTO';
import EmptyUserProfile from '@/components/profile/EmptyUserProfile';
import { router } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

const Profile = observer(() => {
  const [editableUser, setEditableUser] = useState<User>();
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // Загрузка данных пользователя, если они еще не загружены
    if (!userStore.currentUser) {
      userStore.loadUser();
    } else {
      setEditableUser(userStore.currentUser);
      
    }
  }, []);

  const handleEdit = () => {
    router.push('profile/editUser');
  }
  
  const handleSave = () => {};

  const handleCancel = () => {}
  
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
    
      <View>
        {isEditing ? (
          <EmptyUserProfile />
        ) : (
          
            <ViewProfileComponent onEdit={handleEdit}  />
          
        )}
      </View>
   
  );
});

export default Profile;

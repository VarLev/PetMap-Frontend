import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';

import EditProfileComponent from '@/components/profile/EditProfileComponent';

import { User } from '@/dtos/classes/user/UserDTO';
import { router } from 'expo-router';

const EditUserProfile = observer(() => {
  const [editableUser, setEditableUser] = useState<User>();
  const [isEditing, setIsEditing] = useState(false);

 
  const handleSave = async () => {
    await userStore.loadUser(); 
    router.back();
  };

  const handleCancel = () => {
    router.back();
  }
  useEffect(() => {
    // Загрузка данных пользователя, если они еще не загружены
    if (!userStore.currentUser) {
      
    } else {
      
      
    }
  }, []);


  return (
    <EditProfileComponent onSave={handleSave} onCancel={handleCancel} />
  );
});

export default EditUserProfile;
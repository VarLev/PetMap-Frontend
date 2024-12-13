import React from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import EditProfileComponent from '@/components/profile/EditProfileComponent';
import { router } from 'expo-router';
import { BonusProvider } from '@/contexts/BonusContex';
const EditUserProfile = observer(() => {

  const handleSave = async () => {
    await userStore.loadUser(); 
    router.push('/(tabs)/profile');
  };

  const handleCancel = () => {
    router.back();
  }
  

  return (
    <BonusProvider>
      <EditProfileComponent onSave={handleSave} onCancel={handleCancel} />
    </BonusProvider>
  );
});

export default EditUserProfile;
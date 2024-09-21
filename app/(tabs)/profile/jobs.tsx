import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import { BonusProvider } from '@/contexts/BonusContex';
import UserJobsList from '@/components/navigation/userJob/UserJobsList';

const EditUserProfile = observer(() => {

  useEffect(() => {
    // Загрузка данных пользователя, если они еще не загружены
    if (!userStore.currentUser) { 

    } else {  
      
    }
  }, []);

  return (
    <BonusProvider>
      <UserJobsList  />
    </BonusProvider>
  );
});

export default EditUserProfile;
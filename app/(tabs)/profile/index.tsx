import { View, Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import ViewProfileComponent from '@/components/profile/ViewProfileComponent';
import { User } from '@/dtos/classes/user/UserDTO';
import EmptyUserProfile from '@/components/profile/EmptyUserProfile';
import { router } from 'expo-router';

const Profile = observer(() => {
  const [editableUser, setEditableUser] = useState<User>(userStore.currentUser!);
  const [isEmpty, setIsEmpty] = useState(false);
 
  useEffect(() => {
    setEditableUser(userStore.currentUser!);
    if(!editableUser?.name || editableUser?.name === '' || editableUser?.name === null) {
      console.log(editableUser);
      setIsEmpty(true);
    }
  }, []);

  const handleEdit = () => {
    router.push('/profile/editUser');
    
  }

  const handlePetOpen = (petId:string) => {
    router.push(`/profile/pet/${petId}`);
  }

  if (!editableUser) {
    
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      {isEmpty ? (
        <EmptyUserProfile />
      ) : (
        <ViewProfileComponent onEdit={handleEdit} onPetOpen={handlePetOpen} loadedUser={editableUser} />
      )}
    </View>
  );
});

export default Profile;

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import petStore from '@/stores/PetStore';
import { router, useLocalSearchParams } from 'expo-router';
import EditPetProfileComponent from '@/components/profile/EditPetProfileComponent';
import { Pet } from '@/dtos/classes/pet/Pet';
import { View,Text, ActivityIndicator } from 'react-native';
import { BonusProvider } from '@/contexts/BonusContex';

const EditPetProfile = observer(() => {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const [pet, setPet] = useState<Pet>(new Pet());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const loadPet = () => {
      if (petId) {
        setIsLoading(true);
        const pet = petStore.currentPetProfile!;
        setPet(pet);
      }else{
        setError('Invalid pet ID');
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    
    loadPet();
  }, [petId]);


  const handleSave = async (updatedPet: Pet) => {
    try {
      console.log('Profile updated successfully');

      // Возвращаемся на предыдущий экран с обновлением
      
      console.log(`/(pet)/${updatedPet.id}`);
      // Если нужно обновить экран после возвращения
      router.replace(`/(pet)/${updatedPet.id}`);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Loading pet data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{error}</Text>
      </View>
    );
  }

  if (!pet) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Pet not found</Text>
      </View>
    );
  }


  return (
    <BonusProvider>
      <EditPetProfileComponent onSave={handleSave} onCancel={handleCancel} pet={pet!}   />
    </BonusProvider>
  );
});

export default EditPetProfile;
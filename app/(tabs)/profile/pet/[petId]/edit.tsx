import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import petStore from '@/stores/PetStore';
import { router, useLocalSearchParams } from 'expo-router';
import EditPetProfileComponent from '@/components/profile/EditPetProfileComponent';
import { Pet } from '@/dtos/classes/pet/Pet';
import { View,Text, ActivityIndicator } from 'react-native';

const EditPetProfile = observer(() => {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const [pet, setPet] = useState<Pet>(new Pet());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const loadPet = () => {
      if (petId) {
        setIsLoading(true);
        const pet = petStore.currentUserPets.find(pet=>pet.id === petId)!;
        setPet(pet);
      }else{
        setError('Invalid pet ID');
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    
    loadPet();
  }, [petId]);


  const handleSave = async () => {
    
    router.back();
  };

  const handleCancel = () => {
    router.back();
  }
  useEffect(() => {
    
    
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
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
    <EditPetProfileComponent onSave={handleSave} onCancel={handleCancel} pet={pet!}   />
  );
});

export default EditPetProfile;
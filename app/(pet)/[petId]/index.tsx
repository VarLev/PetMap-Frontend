import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import petStore from '@/stores/PetStore';
import ViewPetProfileComponent from '@/components/profile/ViewPetProfileComponent';
import { router, useLocalSearchParams } from 'expo-router';
import { IPet } from '@/dtos/Interfaces/pet/IPet';
import { View, Text, ActivityIndicator } from 'react-native';

const PetScreen = observer(() => {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const [pet, setPet] = useState<IPet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const fetchedPet = await petStore.getPetProfileById(petId!);
        setPet(fetchedPet);
      } catch (err) {
        setError('Failed to load pet data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (petId) {
      fetchData();
    } else {
      setError('Invalid pet ID');
      setIsLoading(false);
    }
  }, [petId]);

  const handleEdit = () => {
    router.replace(`/(pet)/${petId}/edit`);
  }

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

  return <ViewPetProfileComponent pet={pet} onEdit={handleEdit} />;
});

export default PetScreen;

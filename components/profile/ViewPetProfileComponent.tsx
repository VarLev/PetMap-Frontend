import { Pet } from '@/dtos/classes/pet/Pet';
import React from 'react';
import { View } from 'react-native';
import { Text, IconButton, Card, Avatar } from 'react-native-paper';
import { calculateDogAge, getGenderIcon } from '@/utils/utils';
import { Ionicons } from '@expo/vector-icons';

const ViewPetProfileComponent = ({ pet }: { pet: Pet }) => {
  return (
    <Card className="m-2">
      <Card.Cover source={{ uri: pet.thumbnailUrl || 'https://via.placeholder.com/100' }} className='h-40' />
      <Card.Title 
      title={`${pet.petName}`} 
      subtitle={` ${pet.breed}, ${calculateDogAge(pet.birthDate)}`} 
      left={(props) =><Ionicons name={getGenderIcon(pet.gender!) as any} size={30} color="indigo"  />}
      
      titleStyle={{fontSize:20, marginLeft:-10}} 
      subtitleStyle={{marginTop:-10, marginLeft:-14}}
      titleVariant='titleSmall'/>
    </Card>
  );
};

export default ViewPetProfileComponent;

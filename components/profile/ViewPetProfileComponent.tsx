import { Pet } from '@/dtos/classes/pet/Pet';
import React from 'react';
import { View } from 'react-native';
import { Text, IconButton, Card } from 'react-native-paper';


const ViewPetProfileComponent = ({ pet }: { pet: Pet }) => {
  return (
    <Card style={{ margin: 10 }}>
      <Card.Title title={pet.petName} subtitle={pet.breed || 'Unknown breed'} />
      <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="calendar" />
          <Text variant="bodyLarge">Birth Date: {pet.birthDate?.toISOString().split('T')[0]}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="gender-male-female" />
          <Text variant="bodyLarge">Gender: {pet.gender}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="palette" />
          <Text variant="bodyLarge">Color: {pet.color}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="resize" />
          <Text variant="bodyLarge">Size: {pet.size}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="emoticon" />
          <Text variant="bodyLarge">Temperament: {pet.temperament}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="note" />
          <Text variant="bodyLarge">Additional Notes: {pet.additionalNotes}</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

export default ViewPetProfileComponent;

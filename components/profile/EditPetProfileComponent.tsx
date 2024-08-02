import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Pet } from '@/dtos/classes/pet/Pet';

const EditPetProfileComponent = ({
  pet,
  index,
  onPetChange
}: {
  pet: Pet;
  index: number;
  onPetChange: (index: number, updatedPet: Pet) => void;
}) => {
  const [editablePet, setEditablePet] = useState<Pet>({ ...pet });

  const handleFieldChange = (field: keyof Pet, value: any) => {
    const updatedPet = { ...editablePet, [field]: value };
    setEditablePet(updatedPet);
    onPetChange(index, updatedPet);
  };

  return (
    <View key={index} style={{ padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10, marginBottom: 10 }}>
      <TextInput
        label="Pet Name"
        value={editablePet.petName}
        onChangeText={(text) => handleFieldChange('petName', text)}
        left={<TextInput.Icon icon="paw" />}
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="Breed"
        value={editablePet.breed || ''}
        onChangeText={(text) => handleFieldChange('breed', text)}
        left={<TextInput.Icon icon="paw" />}
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="Birth Date"
        value={editablePet.birthDate ? editablePet.birthDate.toISOString().split('T')[0] : ''}
        onChangeText={(text) => handleFieldChange('birthDate', new Date(text))}
        left={<TextInput.Icon icon="calendar" />}
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="Gender"
        value={editablePet.gender || ''}
        onChangeText={(text) => handleFieldChange('gender', text)}
        left={<TextInput.Icon icon="gender-male-female" />}
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="Color"
        value={editablePet.color || ''}
        onChangeText={(text) => handleFieldChange('color', text)}
        left={<TextInput.Icon icon="palette" />}
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="Size"
        value={editablePet.size || ''}
        onChangeText={(text) => handleFieldChange('size', text)}
        left={<TextInput.Icon icon="resize" />}
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="Temperament"
        value={editablePet.temperament || ''}
        onChangeText={(text) => handleFieldChange('temperament', text)}
        left={<TextInput.Icon icon="emoticon" />}
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="Additional Notes"
        value={editablePet.additionalNotes || ''}
        onChangeText={(text) => handleFieldChange('additionalNotes', text)}
        left={<TextInput.Icon icon="note" />}
        style={{ marginBottom: 10 }}
      />
    </View>
  );
};

export default EditPetProfileComponent;

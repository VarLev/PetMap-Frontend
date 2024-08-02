import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, IconButton, TextInput, Text, SegmentedButtons } from 'react-native-paper';
import userStore from '@/stores/UserStore';
import { observer } from 'mobx-react-lite';
import { User } from '@/dtos/classes/user/UserDTO';
import EditPetProfileComponent from './EditPetProfileComponent';
import { Pet } from '@/dtos/classes/pet/Pet';

const EditProfileComponent = observer(({ onSave, onCancel }: { onSave: () => void, onCancel: () => void }) => {
  const user: User = userStore.currentUser!;
  const [editableUser, setEditableUser] = useState<User>(new User({ ...user }));

  const handleChange = (field: keyof User, value: any) => {
    setEditableUser({ ...editableUser, [field]: value });
  };

  const handlePetChange = (index: number, updatedPet: Pet) => {
    const newPetProfiles = [...editableUser.petProfiles!];
    newPetProfiles[index] = updatedPet;
    setEditableUser({ ...editableUser, petProfiles: newPetProfiles });
  };

  const handleSave = async () => {
    await userStore.updateOnlyUserData(editableUser); // Метод для обновления данных пользователя
    onSave();
  };

  return (
    <ScrollView style={{ padding: 2 }}>
      {editableUser.thumbnailUrl && (
        <IconButton icon="account" size={96} style={{ alignSelf: 'center', marginBottom: 10 }} />
      )}
      <TextInput
        label="Name"
        value={editableUser.name || ''}
        onChangeText={(text) => handleChange('name', text)}
        left={<TextInput.Icon icon="account" />}
        style={{ marginBottom: 10 }}
      />

      <View style={{ marginBottom: 20 }}>
        <TextInput
          label="Email"
          value={editableUser.email}
          onChangeText={(text) => handleChange('email', text)}
          left={<TextInput.Icon icon="email" />}
          style={{ marginBottom: 10 }}
        />

        <TextInput
          label="Birth Date"
          value={editableUser.birthDate ? editableUser.birthDate.toLocaleDateString() : undefined}
          onChangeText={(text) => handleChange('birthDate', new Date(text))}
          left={<TextInput.Icon icon="calendar" />}
          style={{ marginBottom: 10 }}
        />

        <SegmentedButtons
          value={editableUser.gender || ''}
          onValueChange={(value) => handleChange('gender', value)}
          buttons={[
            { value: 'male', label: 'М', icon: 'gender-male' },
            { value: 'female', label: 'Ж', icon: 'gender-female' },
            { value: 'N/A', label: 'N/A', icon: 'gender-non-binary' },
          ]}
          style={{ marginBottom: 10 }}
        />

        <TextInput
          label="Description"
          value={editableUser.description || ''}
          onChangeText={(text) => handleChange('description', text)}
          left={<TextInput.Icon icon="information" />}
          style={{ marginBottom: 10 }}
        />

        <Text variant="bodyLarge">Interests:</Text>
        {editableUser.interests?.map((interest, index) => (
          <TextInput
            key={index}
            label={`Interest ${index + 1}`}
            value={interest}
            onChangeText={(text) => {
              const newInterests = [...editableUser.interests!];
              newInterests[index] = text;
              handleChange('interests', newInterests);
            }}
            left={<TextInput.Icon icon="format-list-bulleted" />}
            style={{ marginBottom: 10 }}
          />
        ))}

        <TextInput
          label="Work"
          value={editableUser.work || ''}
          onChangeText={(text) => handleChange('work', text)}
          left={<TextInput.Icon icon="briefcase" />}
          style={{ marginBottom: 10 }}
        />

        <TextInput
          label="Education"
          value={editableUser.education || ''}
          onChangeText={(text) => handleChange('education', text)}
          left={<TextInput.Icon icon="school" />}
          style={{ marginBottom: 10 }}
        />

        <Text variant="bodyLarge">Languages:</Text>
        {editableUser.userLanguages?.map((language, index) => (
          <TextInput
            key={index}
            label={`Language ${index + 1}`}
            value={language}
            onChangeText={(text) => {
              const newLanguages = [...editableUser.userLanguages!];
              newLanguages[index] = text;
              handleChange('userLanguages', newLanguages);
            }}
            left={<TextInput.Icon icon="translate" />}
            style={{ marginBottom: 10 }}
          />
        ))}
      </View>

      <Text variant="bodyLarge" style={{ marginBottom: 10 }}>Pet Profiles:</Text>
      {editableUser.petProfiles?.map((pet, index) => (
        <EditPetProfileComponent key={index} pet={pet} index={index} onPetChange={handlePetChange} />
      ))}

      <Button mode="contained" onPress={handleSave} style={{ marginTop: 20 }}>Save</Button>
      <Button mode="outlined" onPress={onCancel} style={{ marginTop: 10 }}>Cancel</Button>
    </ScrollView>
  );
});

export default EditProfileComponent;

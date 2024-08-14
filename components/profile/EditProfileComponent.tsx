import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, TextInput, Text, SegmentedButtons } from 'react-native-paper';
import userStore from '@/stores/UserStore';
import { observer } from 'mobx-react-lite';
import { User } from '@/dtos/classes/user/UserDTO';
import { Pet } from '@/dtos/classes/pet/Pet';
import { Avatar } from '@rneui/themed';
import { INTEREST_TAGS, LANGUAGE_TAGS } from '@/constants/Strings';

import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';


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
        <Avatar
        source={{ uri: editableUser.thumbnailUrl || 'https://via.placeholder.com/100' }} // Путь к изображению пользователя
        rounded
        size={200}
        containerStyle={{ backgroundColor: "#BDBDBD", marginTop: 10,   borderColor: 'white', borderWidth: 3,  shadowColor: 'black',  elevation: 4, }}
        icon={{ name: 'user', type: 'font-awesome', color: 'white' }}
      />
      
      <TextInput 
        label="Name"
        value={editableUser.name || ''}
        onChangeText={(text) => handleChange('name', text)}
        left={<TextInput.Icon icon="account" />}
        style={{ marginBottom: 10 }}
      />
      <View style={{ marginBottom: 20 }}>

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
         <CustomTagsSelector 
          tags={LANGUAGE_TAGS} 
          initialSelectedTags={editableUser.userLanguages || []}
          onSelectedTagsChange={(selectedTags) => handleChange('userLanguages', selectedTags)} // Обновляем выбранные языки
        />

        <Text variant="bodyLarge">Interests:</Text>
        <CustomTagsSelector 
          tags={INTEREST_TAGS} 
          initialSelectedTags={editableUser.interests || []}
          onSelectedTagsChange={(selectedTags) => handleChange('interests', selectedTags)} 
          maxSelectableTags={5}
        />
      </View>

      <Button mode="contained" onPress={handleSave} style={{ marginTop: 20 }}>Save</Button>
      <Button mode="outlined" onPress={onCancel} style={{ marginTop: 10 }}>Cancel</Button>
    </ScrollView>
  );
});

export default EditProfileComponent;

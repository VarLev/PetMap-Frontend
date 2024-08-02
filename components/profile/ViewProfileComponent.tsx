import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button, IconButton, Text, Avatar } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import { router } from 'expo-router';
import ViewPetProfileComponent from './ViewPetProfileComponent';


const ViewProfileComponent = observer(({ onEdit }: { onEdit: () => void }) => {
  const user = userStore.currentUser!;

  return (
    <ScrollView>
      {user.thumbnailUrl && (
        <Avatar.Image size={96} source={{ uri: user.thumbnailUrl }} style={{ alignSelf: 'center', marginBottom: 10 }} />
      )}
      <Text variant="headlineMedium" style={{ textAlign: 'center', marginBottom: 10 }}>{user.name}</Text>

      <ScrollView horizontal style={{ padding: 10 }}>
        {(user.petProfiles || []).map((pet, index) => (
          <ViewPetProfileComponent key={index} pet={pet} />
        ))}
      </ScrollView>

      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="email" />
          <Text variant="bodyLarge">Email: {user.email}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="calendar" />
          <Text variant="bodyLarge">Birth Date: {user.birthDate?.toLocaleDateString()}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="gender-male-female" />
          <Text variant="bodyLarge">Gender: {user.gender}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="information" />
          <Text variant="bodyLarge">Description: {user.description}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="format-list-bulleted" />
          <Text variant="bodyLarge">Interests:</Text>
        </View>
        {(user.interests || []).map((interest, index) => (
          <Text key={index} variant="bodyLarge" style={{ marginLeft: 40 }}>{interest}</Text>
        ))}

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="briefcase" />
          <Text variant="bodyLarge">Work: {user.work}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="school" />
          <Text variant="bodyLarge">Education: {user.education}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="translate" />
          <Text variant="bodyLarge">Languages:</Text>
        </View>
        {(user.userLanguages || []).map((language, index) => (
          <Text key={index} variant="bodyLarge" style={{ marginLeft: 40 }}>{language}</Text>
        ))}
      </View>

      {/* <Text variant="bodyLarge" style={{ marginBottom: 10 }}>Pet Profiles:</Text>
      {(user.petProfiles || []).map((pet, index) => (
        <ViewPetProfileComponent key={index} pet={pet} />
      ))} */}
      <View style={{ paddingBottom: 10 }}>
        <Button mode="contained" onPress={onEdit} style={{ marginTop: 20 }}>Edit</Button>
        <Button mode="outlined" onPress={() => router.replace('/sign-in')} style={{ marginTop: 10 }}>Logout</Button>
      </View>
    </ScrollView>
  );
});

export default ViewProfileComponent;

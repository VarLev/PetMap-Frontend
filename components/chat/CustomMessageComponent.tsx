import React from 'react';
import { View, Image,Text } from 'react-native';
import { Button, Chip, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MessageType } from '@flyerhq/react-native-chat-ui';

const CustomMessageComponent = ({ message }: { message: MessageType.Custom }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/profile/${message.metadata!.userId}`);
  };

  return (
    <View>
      <Chip
        avatar={<Image source={{ uri: message.metadata?.userAvatar?? 'https://i.pravatar.cc/200' }} style={{ width: 50, height: 50, borderRadius: 15, margin:3 }} />}
        onPress={handlePress}
        className='h-14  items-start '
      >
        <Text className='text-lg'>{message.metadata?.userName}</Text>
      </Chip>
      <Divider />
      <Text className='p-2 text-white bg-indigo-700'>Привет я бы хотел присоедениться к твоей прогулке!</Text>
      <View className='bg-indigo-700 h-10 flex-row justify-between'>
        <Button icon="account" onPress={() => {}} mode='contained-tonal' color='green'>Профиль</Button>
        <Button icon="dog" onPress={() => {}} mode='contained-tonal' color='green'>Питомцы</Button>
      </View>
      
    </View>
  );
};

export default CustomMessageComponent;

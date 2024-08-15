import React, { useState } from 'react';
import { FlatList, Pressable, View, Image } from 'react-native';
import { femaleAvatars, maleAvatars } from '@/constants/Avatars';
import { Button, Text, Switch } from 'react-native-paper';

interface AvatarSelectorProps {
  onAvatarSelect: (avatar: number, isMail:boolean) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ onAvatarSelect }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [isMale, setIsMale] = useState(false);

  const handleAvatarSelect = (index: number) => {
    setSelectedAvatar(index);
    onAvatarSelect(index, isMale);
  };

  const handleToggle = () => {
    setSelectedAvatar(null);
    setIsMale(!isMale);
  };

  const avatars = isMale ? maleAvatars : femaleAvatars;

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="flex-row justify-center items-center mb-4">
        <Text className="text-xl mr-2">Женские</Text>
        <Switch value={isMale} onValueChange={handleToggle} />
        <Text className="text-xl ml-2">Мужские</Text>
      </View>

      <Text className="text-center text-xl mb-4">
        Выберите своего аватара!
      </Text>

      <FlatList
        data={avatars}
        className="items-center"
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => handleAvatarSelect(index)}
            className={`m-2 p-2 rounded ${
              selectedAvatar === index ? 'border-2 border-purple-500' : ''
            }`}
          >
            <Image
              source={item} // Используем item напрямую, так как это объект изображения
              className="w-32 h-32 rounded-full"
            />
          </Pressable>
        )}
        numColumns={2}
        keyExtractor={(_, index) => index.toString()}
      />

      <Button
        mode="contained"
        onPress={() => {
          console.log('Selected avatar index:', selectedAvatar);
        }}
        className="mt-4 bg-indigo-700"
      >
        Сохранить
      </Button>
    </View>
  );
};

export default AvatarSelector;

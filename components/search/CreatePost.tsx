// CreatePost.tsx

import React, { useState } from 'react';
import { View, TextInput, ScrollView, Image } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import feedStore from '@/stores/FeedStore';

const CreatePost: React.FC = () => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSelectImage = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3,
      quality: 0.5,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map(asset => asset.uri);
      setImages(selectedImages);
    }
  };

  const handleCreatePost = async () => {
    try {
      await feedStore.createPost('', content, images);
      setContent('');
      setImages([]);
      setSnackbarMessage('Пост успешно создан!');
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage('Ошибка при создании поста.');
      setSnackbarVisible(true);
    }
  };

  return (
    <ScrollView className="flex-1 p-4">
      <TextInput
        className="border border-gray-300 p-2 mb-2"
        placeholder="Что у вас нового?"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button mode="outlined" onPress={handleSelectImage}>
        Добавить фотографии
      </Button>
      <View className="flex-row flex-wrap mt-4">
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} className="w-24 h-24 mr-2 mb-2" />
        ))}
      </View>
      <Button mode="contained" onPress={handleCreatePost} className="mt-4">
        Создать пост
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

export default CreatePost;
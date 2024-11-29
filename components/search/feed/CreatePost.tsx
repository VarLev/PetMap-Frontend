import React, { useState } from 'react';
import { View, ScrollView, Image, TextInput } from 'react-native';
import { Button, IconButton, Snackbar } from 'react-native-paper';
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
      await feedStore.createPost(content, images);
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
      {/* Контейнер для текстового поля и иконки камеры */}
      <View className="relative mb-2">
        <TextInput
          className="border border-gray-300 rounded-lg p-3 pr-12 min-h-[100px] text-sm"
          placeholder="Что у вас нового?"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <IconButton
          icon="camera"
          size={24}
          className="absolute bottom-2 right-2"
          onPress={handleSelectImage}
        />
      </View>
      {images.length > 0 && (
        <View className="flex-row flex-wrap">
          {images.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              className="w-24 h-24 mr-2 mb-2"
            />
          ))}
        </View>
      )}
      <Button mode="contained" onPress={handleCreatePost}>
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
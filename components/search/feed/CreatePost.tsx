import { FC, useState } from 'react';
import { View, ScrollView, Image, TextInput } from 'react-native';
import { IconButton, Snackbar } from 'react-native-paper';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import searchStore from '@/stores/SearchStore';
import CustomLoadingButton from '@/components/custom/buttons/CustomLoadingButton';
import i18n from '@/i18n';

interface CreatePostProps {
  onClose: () => void; // Метод для закрытия нижнего листа
}

const CreatePost: FC<CreatePostProps> = ({ onClose }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSelectImage = async () => {
    // Проверяем, не достигнуто ли максимальное количество изображений
    if (images.length >= 3) {
      setSnackbarMessage("Можно загрузить максимум 3 фотографии.");
      setSnackbarVisible(true);
      return;
    }

    // Вычисляем, сколько изображений ещё можно добавить
    const remaining = 3 - images.length;

    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remaining, // Ограничиваем выбор оставшимся количеством
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map(asset => asset.uri);
      // Добавляем выбранные изображения и обрезаем массив до 3-х элементов
      setImages(prevImages => [...prevImages, ...selectedImages].slice(0, 3));
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    try {
      if (!content) {
        setSnackbarMessage(i18n.t("feedPosts.addPostText"));
        setSnackbarVisible(true);
        return;
      }
      await searchStore.createPost(content, images);
      handleClear();
      onClose();
    } catch {
      setSnackbarMessage(i18n.t("feedPosts.postCreateError"));
      setSnackbarVisible(true);
    }
  };

  const handleClear = () => {
    setContent('');
    setImages([]);
    setSnackbarVisible(true);
  };

  return (
    <ScrollView className="flex-1 py-4">
      {/* Контейнер для текстового поля и иконки камеры */}
      <View className="relative mb-2">
        <TextInput
          className="border border-gray-300 rounded-lg p-3 pr-12 min-h-[150px] text-sm flex items-start"
          placeholder={i18n.t("feedPosts.createPostInput")}
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={250}
          textAlignVertical='top'
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
            <View key={index} className="relative mr-2 mb-2">
              <Image
                source={{ uri }}
                className="w-24 h-24"
              />
              <IconButton
                icon="close"
                size={16}
                onPress={() => handleRemoveImage(index)}
                style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.7)' }}
              />
            </View>
          ))}
        </View>
      )}
      <CustomLoadingButton handlePress={handleCreatePost} title={i18n.t("feedPosts.loadingButtonTitle")}  />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

export default CreatePost;

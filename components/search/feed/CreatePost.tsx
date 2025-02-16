import { FC, useState } from 'react';
import { View, ScrollView, Image, KeyboardAvoidingView } from 'react-native';
import { IconButton, Snackbar,TextInput} from 'react-native-paper';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import searchStore from '@/stores/SearchStore';
import CustomLoadingButton from '@/components/custom/buttons/CustomLoadingButton';
import * as FileSystem from 'expo-file-system';
import i18n from '@/i18n';
import { Video, ResizeMode } from 'expo-av';

interface CreatePostProps {
  onClose: () => void; // Метод для закрытия нижнего листа
}

const CreatePost: FC<CreatePostProps> = ({ onClose }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isVideo, setIsVideo] = useState(false);

  const MAX_IMAGES = 3;
  const MAX_VIDEOS = 1; // Разрешаем 1 видео
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 МБ в байтах

  const handleSelectImage = async () => {
    // Если уже добавлено видео, не разрешаем добавлять фото
    if (videos.length > 0) {
      setSnackbarMessage("Нельзя добавлять фото, если уже добавлено видео.");
      setSnackbarVisible(true);
      return;
    }
    if (images.length >= MAX_IMAGES) {
      setSnackbarMessage("Можно загрузить максимум 3 фотографии.");
      setSnackbarVisible(true);
      return;
    }
    const remaining = MAX_IMAGES - images.length;
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.8,
    });
    if (!result.canceled) {
      const selectedImages = result.assets.map(asset => asset.uri);
      setIsVideo(false);
      setImages(prev => [...prev, ...selectedImages].slice(0, MAX_IMAGES));
    }
  };

  const handleSelectVideo = async () => {
    // Если уже добавлены фото, не разрешаем добавлять видео
    if (images.length > 0) {
      setSnackbarMessage("Нельзя добавлять видео, если уже добавлены фото.");
      setSnackbarVisible(true);
      return;
    }
    if (videos.length >= MAX_VIDEOS) {
      setSnackbarMessage("Можно загрузить только 1 видео.");
      setSnackbarVisible(true);
      return;
    }
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Videos,
      allowsMultipleSelection: false,
      allowsEditing: false
    });
    
    if (!result.canceled && result.assets.length > 0) {
      const videoAsset = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(videoAsset.uri);
      if (!fileInfo.exists || fileInfo.size === undefined) {
        setSnackbarMessage("Не удалось получить информацию о файле.");
        setSnackbarVisible(true);
        return;
      }
      if (fileInfo.size > MAX_VIDEO_SIZE) {
        setSnackbarMessage("Размер видео не должен превышать 50 МБ.");
        setSnackbarVisible(true);
        return;
      }
      setIsVideo(true);
      setVideos(prev => [...prev, videoAsset.uri].slice(0, MAX_VIDEOS));
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    try {
      // Если отсутствует и текст, и медиа, выводим ошибку
      if (!content && images.length === 0 && videos.length === 0) {
        setSnackbarMessage(i18n.t("feedPosts.addPostText"));
        setSnackbarVisible(true);
        return;
      }
      await searchStore.createPost(content, [...images, ...videos], isVideo);
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
    setVideos([]);
    setSnackbarVisible(true);
  };

  return (
    <ScrollView className="flex-1 py-4 px-4">
      {/* Контейнер для текстового поля и кнопок */}
      <View className="relative -mt-1">
        <View className="flex-row -mb-7 z-50 -gap-2 justify-end -left-2">
          <IconButton icon="camera" size={30} onPress={handleSelectImage} className='bg-slate-100'  />
          <IconButton icon="video" size={30} onPress={handleSelectVideo} className='bg-slate-100'/>
        </View>
        <KeyboardAvoidingView behavior="padding" >
        <TextInput
        className="w-full pt-4"
          
          placeholder={i18n.t("feedPosts.createPostInput")}
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={250}
          style={{ minHeight: 30 }}
          mode='outlined'
          
        />
        </KeyboardAvoidingView>
        
        
      </View>
     
      <CustomLoadingButton handlePress={handleCreatePost} title={i18n.t("feedPosts.loadingButtonTitle")} />
      {images.length > 0 && (
        <View className="flex-row flex-wrap mb-4">
          {images.map((uri, index) => (
            <View key={`img-${index}`} className="relative mr-2 mb-2">
              <Image source={{ uri }} className="w-24 h-24 rounded" />
              <IconButton
                icon="close"
                size={26}
                onPress={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-white/70"
              />
            </View>
          ))}
        </View>
      )}
      {videos.length > 0 && (
        <View className="flex-row flex-wrap mt-4 justify-center border border-gray-300 rounded-2xl">
          {videos.map((uri, index) => (
            <View key={`vid-${index}`} className="relative mr-2 mb-2">
              <Video
                source={{ uri }}
                className="w-56 h-56 rounded"
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
              />
              <IconButton
                icon="close"
                size={36}
                onPress={() => handleRemoveVideo(index)}
                className="absolute -top-1 -right-14 bg-white/70"
              />
            </View>
          ))}
        </View>
      )}
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

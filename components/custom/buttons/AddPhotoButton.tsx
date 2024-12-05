import React, { useState } from 'react';
import { TouchableOpacity, Text, Image, Alert, View } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { launchCameraAsync, launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import i18n from '@/i18n';

interface AddPhotoButtonProps {
  buttonText: string;
  onImageSelected: (imageUri: string) => void;
  compressQuality?: number;
  resizeWidth?: number;
  aspectRatio?: [number, number];
}

const AddPhotoButton: React.FC<AddPhotoButtonProps> = ({
  buttonText,
  onImageSelected,
  compressQuality = 0.5,
  resizeWidth = 400,
  aspectRatio = [4, 3],
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Сжатие изображения
  const compressImage = async (uri: string): Promise<string> => {
    const manipResult = await manipulateAsync(
      uri,
      [{ resize: { width: resizeWidth } }],
      { compress: compressQuality, format: SaveFormat.JPEG }
    );
    return manipResult.uri;
  };

  // Добавление фото
  const handleAddPhoto = async () => {
    Alert.alert(
      i18n.t('AddPhoto.title'), // Заголовок
      i18n.t('AddPhoto.description'), // Описание
      [
        {
          text: i18n.t('AddPhoto.takePhoto'), // "Сделать фото"
          onPress: async () => {
            const result = await launchCameraAsync({
              mediaTypes: MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
              aspect: aspectRatio,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              const compressedUri = await compressImage(result.assets[0].uri);
              setSelectedImage(compressedUri);
              onImageSelected(compressedUri);
            }
          },
        },
        {
          text: i18n.t('AddPhoto.chooseFromGallery'), // "Выбрать из галереи"
          onPress: async () => {
            const result = await launchImageLibraryAsync({
              mediaTypes: MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
              aspect: aspectRatio,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              const compressedUri = await compressImage(result.assets[0].uri);
              setSelectedImage(compressedUri);
              onImageSelected(compressedUri);
            }
          },
        },
        {
          text: i18n.t('AddPhoto.cancel'), // "Отмена"
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Card
      className="h-40 border-3 border-dashed bg-white rounded-2xl shadow-lg items-center justify-center"
      style={{ borderWidth: 1, borderColor: '#bababa' }}
    >
      {selectedImage ? (
        <View>
          <TouchableOpacity className="items-center" onPress={handleAddPhoto}>
            <Image source={{ uri: selectedImage }} className="w-80 h-40 rounded-2xl" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity className="items-center" onPress={handleAddPhoto}>
         <IconButton icon="camera" size={30} className="bg-slate-100 rounded-full" />
        <Text className="font-nunitoSansRegular">{buttonText}</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

export default AddPhotoButton;
import React, { useState } from 'react';
import { TouchableOpacity, Text, Image, Alert, View } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import {launchCameraAsync,launchImageLibraryAsync, MediaTypeOptions} from 'expo-image-picker';
import {manipulateAsync,SaveFormat } from 'expo-image-manipulator';

interface AddPhotoButtonProps {
  buttonText: string;
  onImageSelected: (imageUri: string) => void;
}

const AddPhotoButton: React.FC<AddPhotoButtonProps> = ({ buttonText, onImageSelected }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Функция для сжатия изображения
  const compressImage = async (uri: string): Promise<string> => {
    const manipResult = await manipulateAsync(
      uri,
      [{ resize: { width: 400 } }], // Изменение размера до 400px по ширине
      { compress: 0.5, format: SaveFormat.JPEG } // Сжатие до 50%
    );
    return manipResult.uri;
  };

  const handleAddPhoto = async () => {
    Alert.alert(
      'Добавить фото',
      'Выберите источник',
      [
        {
          text: 'Сделать фотографию',
          onPress: async () => {
            const result = await launchCameraAsync({
              mediaTypes: MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
              aspect:[4,3]
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              const compressedUri = await compressImage(result.assets[0].uri);
              setSelectedImage(compressedUri); 
              onImageSelected(compressedUri); 
            }
          },
        },
        {
          text: 'Выбрать из галереи',
          onPress: async () => {
            const result = await launchImageLibraryAsync({
              mediaTypes: MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
              aspect:[4,3]
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              const compressedUri = await compressImage(result.assets[0].uri);
              setSelectedImage(compressedUri);
              onImageSelected(compressedUri); 
            }
          },
        },
        {
          text: 'Отмена',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Card className='h-40 border-3 border-dashed bg-white rounded-2xl shadow-lg items-center justify-center'
      style={{ borderWidth: 1, borderColor: '#bababa' }}
    >
      {selectedImage ? (
        <View>
          <TouchableOpacity className="items-center" onPress={handleAddPhoto}>
            <Image source={{ uri: selectedImage }} className=' w-80 h-40 rounded-2xl'/>
          </TouchableOpacity>
        </View>
        
      ) : (
        <TouchableOpacity className="items-center" onPress={handleAddPhoto}>
          <IconButton
            icon="camera"
            size={30}
            className="bg-slate-100 rounded-full"
            
          />
          <Text className="font-nunitoSansRegular">
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

export default AddPhotoButton;

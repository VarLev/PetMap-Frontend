import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import ImageView from 'react-native-image-viewing';

interface ImageModalViewerProps {
  images: { uri: string }[];  // Массив объектов с URI изображений
  imageWidth?: number;  // Ширина изображения, по умолчанию 96 (w-24)
  imageHeight?: number; // Высота изображения, по умолчанию 96 (h-24)
}

const ImageModalViewer: React.FC<ImageModalViewerProps> = ({ images, imageWidth = 130, imageHeight = 130 }) => {
  const [visible, setVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <View className="flex-1 items-center justify-center">
      {/* Отображение миниатюр изображений */}
      <View className="flex-row flex-wrap justify-center">
        {images.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => openModal(index)} className="m-2">
            <Image
              source={{ uri: image.uri }}
              className="rounded-lg"
              height={imageHeight}
              width={imageWidth}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Модальное окно для просмотра изображения на весь экран */}
      <ImageView
        images={images}
        imageIndex={selectedImageIndex}
        visible={visible}
        onRequestClose={closeModal}
      />
    </View>
  );
};

export default ImageModalViewer;

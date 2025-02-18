import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import ImageView from 'react-native-image-viewing';

interface ImageModalViewerProps {
  images: { uri: string }[];  // Массив объектов с URI изображений
  imageWidth?: number;  // Ширина изображения, по умолчанию 130
  imageHeight?: number; // Высота изображения, по умолчанию 130
  className_?: string;   // Внешний класс для кастомизации
  borderRadius?: number;  // Радиус скругления изображения, по умолчанию 8
  flexWidth?: string; // Ширина флекс-элемента, по умолчанию 1
}

const ImageModalViewer: React.FC<ImageModalViewerProps> = ({
  images,
  imageWidth = 130,
  imageHeight = 130,
  className_ = '',
  borderRadius = 2,
  flexWidth = 'flex-1'
}) => {
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
    <View className={`${flexWidth} items-center justify-center ${className_}`}>
      {/* Отображение миниатюр изображений */}
      <View className="flex-row flex-wrap justify-center">
        {images.map((image, index) => (
          <TouchableOpacity activeOpacity={0.8} key={index} onPress={() => openModal(index)} className="m-2">
            <Image
              source={{ uri: image.uri }}
              style={{ width: imageWidth, height: imageHeight, borderWidth: borderRadius, borderColor: 'white' }}
              className={`rounded-lg ${className_}`}
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

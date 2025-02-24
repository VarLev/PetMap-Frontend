import { IPostPhotos } from '@/dtos/Interfaces/feed/IPost';
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import { Icon } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';

interface PhotoCaruselProps {
  images: IPostPhotos[]; // Массив объектов с URI изображений
  // Размеры для превью-карусели (по умолчанию — квадрат на ширину экрана)
  imageWidth?: number;
  imageHeight?: number;
  borderRadius?: number; // Радиус скругления изображений
}

const { width } = Dimensions.get('window');

const PhotoCarusel: React.FC<PhotoCaruselProps> = ({
  images,
  imageWidth = width,
  imageHeight = width,
  borderRadius = 8,
}) => {
  // Индекс выбранного изображения для модального окна
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // Флаг видимости модального окна
  const [visible, setVisible] = useState(false);
  // Текущий индекс в основной карусели (превью)
  const [mainIndex, setMainIndex] = useState(0);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  // Функция для рендера пагинации (точки)
  const renderPagination = (activeIndex: number, total: number) => (
    <View style={styles.paginationContainer}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            activeIndex === index ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Основная горизонтальная карусель */}

      {/* Если изображений больше 1, показываем карусель и пагинацию, если нет - только одно изображение */}
      {images.length > 1 ? (
        <View>
          <Carousel
            loop={false}
            width={imageWidth}
            height={imageHeight}
            data={images}
            onSnapToItem={(index) => setMainIndex(index)}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => openModal(index)}
              >
                <Image
                  source={{ uri: item.url }}
                  style={{ width: imageWidth, height: imageHeight, borderRadius }}
                />
              </TouchableOpacity>
            )}
          />
        {renderPagination(mainIndex, images.length)}
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => openModal(0)}
        >
          <Image
            source={{ uri: images[0].url }}
            style={{ width: imageWidth, height: imageHeight, borderRadius }}
          />
        </TouchableOpacity>
      )}
      

      {/* Модальное окно с полноэкранной каруселью */}
      <Modal
        visible={visible}
        transparent={false}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Carousel
            loop={false}
            width={width}
            height={width} // квадратный формат
            data={images}
            defaultIndex={selectedImageIndex}
            onSnapToItem={(index) => setSelectedImageIndex(index)}
            autoPlay={false}
            renderItem={({ item }) => (
              <Animated.View style={styles.carouselItem} key={item.id}>
                <Image
                  source={{ uri: item.url }}
                  style={{ width: width, height: width }}
                  resizeMode="cover"
                />
              </Animated.View>
            )}
          />
          {renderPagination(selectedImageIndex, images.length)}
          {/* Кнопка закрытия модального окна */}
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Icon source="close" size={50} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'black',
  },
  inactiveDot: {
    backgroundColor: 'gray',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselItem: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});

export default PhotoCarusel;

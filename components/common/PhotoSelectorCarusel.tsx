import React from 'react';
import { View, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Carousel from 'react-native-reanimated-carousel';
import type { Photo } from '@/dtos/classes/Photo'; // Проверьте корректность пути
import { LinearGradient } from 'expo-linear-gradient';
import { IconButton } from 'react-native-paper';

type CarouselItem = Photo | { id: string; isAddButton: true };

interface ImageWithActionsProps {
  photos?: Photo[];         // Массив фотографий
  imageUrl?: string;        // Для обратной совместимости
  onReplace: (index: number) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;        // Функция для добавления фото
  onChooseAvatar?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const PhotoSelector: React.FC<ImageWithActionsProps> = ({
  photos,
  imageUrl,
  onReplace,
  onDelete,
  onAdd,
  onChooseAvatar,
}) => {
  // Получаем список фотографий
  let photoList: Photo[] = photos || [];

  // Обратная совместимость с imageUrl
  if (!photos?.length && imageUrl) {
    photoList = [{
      id: 'single-photo',
      url: imageUrl,
      isMain: true,
      dateCreated: new Date(),
      userId: '',
      petProfileId: ''
    }];
  }

  // Формируем данные для карусели
  const carouselData: CarouselItem[] = [
    ...photoList,
  ];

  // Если фотографий меньше 5, добавляем кнопку для добавления
  if (photoList.length < 5) {
    carouselData.push({ id: 'add-button', isAddButton: true } as const);
  }

  return (
    <View className="relative items-center justify-center">
      <Carousel
        loop={false}
        vertical={false}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        width={screenWidth * 0.6}
        height={200}
        data={carouselData}
        renderItem={({ item, index }) => {
          if ('isAddButton' in item) {
            return (
              <TouchableOpacity 
                className='h-[180px] m-2 p-2 border-3 border-dashed rounded-2xl shadow items-center justify-center'
                onPress={onAdd}
                style={{ borderWidth: 3, borderColor: '#D9CBFF' }}
              >
                <IconButton
                  icon="plus"
                  size={30}
                  iconColor="black"
                  className="bg-[#F5ECFF] rounded-full"
                />
              </TouchableOpacity>
            );
          }

          return (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: item.url }} 
                style={styles.image} 
              />
              <View style={styles.actionsContainer}>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => onReplace(index)}
                >
                  <MaterialIcons name="loop" size={24} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]} 
                  onPress={() => onDelete(index)}
                >
                  <MaterialIcons name="delete" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <LinearGradient
        colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0)']}
        locations={[0, 0.4, 1]} // Контроль точек перехода
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.edgeFadeLeft}
      />

      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,1)']}
        locations={[0, 0.6, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.edgeFadeRight}
        shouldRasterizeIOS={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    right: 70,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
  },
  deleteButton: {
    backgroundColor: 'rgba(255,0,0,0.6)',
  },
  addButton: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#3F00FF',
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(191, 168, 255, 0.1)',
  },
  edgeFadeLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 20,
    zIndex: 2,
  },
  edgeFadeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 20,
    zIndex: 2,
  },
});

export default PhotoSelector;

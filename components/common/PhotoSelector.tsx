import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ImageWithActionsProps {
  imageUrl: string;
  onReplace: () => void;
  onDelete: () => void;
  onChooseAvatar?: () => void; // Необязательная кнопка для выбора аватаров
}

const PhotoSelector: React.FC<ImageWithActionsProps> = ({ imageUrl, onReplace, onDelete, onChooseAvatar }) => {
  return (
    <View className="relative items-center justify-center">
      <Image source={{ uri: imageUrl }} className="w-64 h-56 rounded-3xl" />
      <View className="absolute bottom-0 flex-row space-x-6">
        <TouchableOpacity className="bg-purple-300 w-10 h-10 rounded-full items-center justify-center" onPress={onReplace}>
          <MaterialIcons name="loop" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-red-500 w-10 h-10 rounded-full items-center justify-center" onPress={onDelete}>
          <MaterialIcons name="delete" size={20} color="white" />
        </TouchableOpacity>
        {onChooseAvatar && (
          <TouchableOpacity className="bg-indigo-800 w-10 h-10 rounded-full items-center justify-center" onPress={onChooseAvatar}>
            <MaterialIcons name="face" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PhotoSelector;

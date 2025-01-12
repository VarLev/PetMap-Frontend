import i18n from '@/i18n';
import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import Modal from 'react-native-modal';

interface CustomAlertProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  type: 'error' | 'info'; // Ошибка или Информация
  title?: string;
  confirmText?: string;
  image?: ImageSourcePropType; // Добавлен новый проп для изображения
  backgroundColor?: string; // Добавлен новый проп для цвета фона
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isVisible,
  onClose,
  message,
  type,
  title = i18n.t("cancel"),
  confirmText = i18n.t("ok"),
  image,
  backgroundColor = '#FFFFFF',
}) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} backdropOpacity={0.6}>
      <View className="p-6 px-8 rounded-2xl" style={{ backgroundColor: backgroundColor }}>
        {/* Если изображение передано, оно отображается здесь */}
        {image && (
          <Image 
            source={image} 
            style={{ width: 250, height: 230, alignSelf: 'center', marginBottom: 10 }} 
            resizeMode="cover"
          />
        )}
        {/* <Text className="text-lg font-nunitoSansBold mb-2">
          {title}
        </Text> */}
        <Text className="text-base text-justify font-nunitoSansRegular mb-1">
          {message}
        </Text>
        <TouchableOpacity onPress={onClose} className="py-2 px-4 rounded">
          <Text className="font-nunitoSansBold text-center">{confirmText}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CustomAlert;

import i18n from '@/i18n';
import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import Modal from 'react-native-modal';

interface CustomAlertProps {
  isVisible: boolean;
  onClose: () => void;
  message?: string;
  type?: 'error' | 'info'; // Ошибка или Информация
  title?: string;
  confirmText?: string;
  image?: ImageSourcePropType;
  backgroundColor?: string;
  renderContent?: () => React.ReactNode; // Проп для кастомного рендера
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
  renderContent, // Получаем кастомный рендер через пропсы
}) => {
  return (
    <Modal 
    isVisible={isVisible} 
    onBackdropPress={onClose} 
    backdropOpacity={0.6}
    useNativeDriver={true}
    useNativeDriverForBackdrop={true}
    hideModalContentWhileAnimating={true}
    animationIn="zoomIn"
  animationOut="fadeOut"
  animationInTiming={300}
  animationOutTiming={300}
    >
      <View className="p-6 px-8 rounded-2xl" style={{ backgroundColor: backgroundColor }}>
        {/* Если передан renderContent, используем его */}
        {renderContent ? (
          renderContent()
        ) : (
          <>
            {/* Если изображение передано, оно отображается здесь */}
            {image && (
              <Image 
                source={image} 
                style={{ width: 250, height: 230, alignSelf: 'center', marginBottom: 10 }} 
                resizeMode="cover"
              />
            )}
            {/* Заголовок (если нужен) */}
            {title && (
              <Text className="text-lg font-nunitoSansBold mb-2 text-center">
                {title}
              </Text>
            )}
            {/* Основное сообщение */}
            {message && (
              <Text className="text-base text-center font-nunitoSansRegular mb-4">
                {message}
              </Text>
            )}
            {/* Кнопка подтверждения */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              className="py-2 px-4 rounded"
            >
              <Text className="font-nunitoSansBold text-center">{confirmText}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
};

export default CustomAlert;

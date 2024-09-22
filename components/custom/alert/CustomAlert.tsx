import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

interface CustomAlertProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  type: 'error' | 'info'; // Ошибка или Информация
  title?: string;
  confirmText?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isVisible,
  onClose,
  message,
  type,
  title = 'Сообщение',
  confirmText = 'OK'
}) => {
  // Классы для контейнера
  

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} backdropOpacity={0.6}>
      <View className={`p-6 px-8 rounded-2xl bg-white `}>
        <Text className={`text-lg font-nunitoSansBold mb-2 `}>
          {title}
        </Text>
        <Text className="text-base font-nunitoSansRegular  mb-1">
          {message}
        </Text>
        <TouchableOpacity onPress={onClose} className={`py-2 px-4 rounded `}>
          <Text className="font-nunitoSansBold text-center">{confirmText}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CustomAlert;

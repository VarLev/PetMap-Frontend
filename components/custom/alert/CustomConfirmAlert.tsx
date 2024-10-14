import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

interface CustomConfirmAlertProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

const CustomConfirmAlert: React.FC<CustomConfirmAlertProps> = ({
  isVisible,
  onClose,
  onConfirm,
  message,
  title = 'Сообщение',
  confirmText = 'OK',
  cancelText = 'Отмена',
}) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} backdropOpacity={0.6}>
      <View className={`p-6 px-8 rounded-2xl bg-white `}>
        <Text className={`text-lg font-nunitoSansBold mb-2 text-center`}>
          {title}
        </Text>
        <Text className="text-base font-nunitoSansRegular  mb-4 text-center">
          {message}
        </Text>

        <View className="flex-row justify-between">
          <TouchableOpacity onPress={onClose} className="py-2 px-4 rounded w-1/2 mr-2">
            <Text className="font-nunitoSansBold text-center">{cancelText}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onConfirm} className="py-2 px-4 rounded w-1/2">
            <Text className="font-nunitoSansBold text-center">{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomConfirmAlert;

import i18n from '@/i18n';
import React, { useEffect, useState } from 'react';
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
  title = '',
  confirmText = i18n.t("ok"),
  cancelText = i18n.t("cancel"),
}) => {
  // Стейт, отвечающий за блокировку повторного нажатия
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(false);

  // При каждом открытии модалки сбрасываем блокировку
  useEffect(() => {
    if (isVisible) {
      setIsConfirmDisabled(false);
    }
  }, [isVisible]);

  const handleConfirm = () => {
    if (isConfirmDisabled) return; // Если уже нажато, ничего не делаем
    setIsConfirmDisabled(true);
    onConfirm();
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} backdropOpacity={0.6}>
      <View className="p-6 px-8 rounded-2xl bg-white">
        
        {title?.length > 0 && (
          <Text className="text-xl font-nunitoSansBold mb-2 text-center">
            {title}
          </Text>
        )}

        <Text className="text-base font-nunitoSansRegular mb-4 text-center">
          {message}
        </Text>

        <View className="flex-row justify-between">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            className="py-2 px-4 rounded w-1/2 mr-2"
          >
            <Text className="font-nunitoSansBold text-center">{cancelText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleConfirm}
            disabled={isConfirmDisabled} // Отключаем кнопку, если уже нажали
            className="py-2 px-4 rounded w-1/2"
          >
            <Text className="font-nunitoSansBold text-center">
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomConfirmAlert;

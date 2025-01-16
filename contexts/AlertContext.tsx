import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import Modal from 'react-native-modal';

// Интерфейс для контекста
interface AlertContextType {
  showAlert: (
    message: string,
    confirmText?: string,
    imageSource?: ImageSourcePropType
  ) => void;
  hideAlert: () => void;
}

// Создаем контекст
const AlertContext = createContext<AlertContextType | null>(null);

// Кастомный хук для использования контекста
export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }

  return context;
};

// Провайдер контекста
export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  const [confirmText, setConfirmText] = useState('OK');
  const [imageSource, setImageSource] = useState<any>(null);

  const showAlert = (
    msg: string,
    confirmTxt?: string,
    imgSrc?: any
  ) => {
    setMessage(msg);
    setConfirmText(confirmTxt || 'OK');
    setImageSource(imgSrc || null);
    setIsVisible(true);
  };

  const hideAlert = () => {
    setIsVisible(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <CustomAlert
        isVisible={isVisible}
        onClose={hideAlert}
        message={message}
        confirmText={confirmText}
        imageSource={imageSource}
      />
    </AlertContext.Provider>
  );
};

// Компонент CustomAlert
const CustomAlert: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  message: string;
  confirmText?: string;
  imageSource?: any;
}> = ({ isVisible, onClose, message, confirmText = 'OK', imageSource }) => (
  <Modal isVisible={isVisible} backdropOpacity={0.6}>
    <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 20, alignItems: 'center' }}>
      {imageSource && (
        <Image
          source={imageSource}
          style={{  height: 300,  resizeMode:'center'}}
        />
      )}
      <Text style={{ fontSize: 16, marginBottom: 10, fontFamily: 'NunitoSans_700Bold', textAlign: 'center' }}>
        {message}
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClose}
        style={{ padding: 10, alignSelf: 'stretch', alignItems: 'center' }}
      >
        <Text style={{ fontWeight: 'bold', fontFamily: 'NunitoSans_700Bold' }}>{confirmText}</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

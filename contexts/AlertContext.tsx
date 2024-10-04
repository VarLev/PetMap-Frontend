import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

// Интерфейс для контекста
interface AlertContextType {
  showAlert: (message: string, type: 'error' | 'info', title?: string, confirmText?: string) => void;
  hideAlert: () => void;
}

// Создаем контекст
const AlertContext = createContext<AlertContextType | null>(null);

// Кастомный хук для использования контекста
export const useAlert = () => {
  const context = useContext(AlertContext);
  
  // Проверка на null
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  
  return context;
};

// Провайдер контекста
export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'error' | 'info'>('info');
  const [title, setTitle] = useState('Сообщение');
  const [confirmText, setConfirmText] = useState('OK');

  // Функция для отображения алерта
  const showAlert = (msg: string, alertType: 'error' | 'info', alertTitle?: string, confirmTxt?: string) => {
    setMessage(msg);
    setType(alertType);
    setTitle(alertTitle || '');
    setConfirmText(confirmTxt || 'OK');
    setIsVisible(true);
  };

  // Функция для скрытия алерта
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
        type={type}
        title={title}
        confirmText={confirmText}
      />
    </AlertContext.Provider>
  );
};

// Сам компонент CustomAlert
const CustomAlert: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  message: string;
  type: 'error' | 'info';
  title?: string;
  confirmText?: string;
}> = ({ isVisible, onClose, message, type, title = 'Сообщение', confirmText = 'OK' }) => (
  <Modal isVisible={isVisible} backdropOpacity={0.6}>
    <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, fontFamily:'NunitoSans_700Bold' }}>{title}</Text>
      <Text style={{ fontSize: 16, marginBottom: 10,fontFamily:'NunitoSans_700Bold' }}>{message}</Text>
      <TouchableOpacity onPress={onClose} style={{ padding: 10, borderRadius: 5 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontFamily:'NunitoSans_700Bold' }}>{confirmText}</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);


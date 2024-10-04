import React, { useEffect, useState } from 'react';
import {requestForegroundPermissionsAsync} from 'expo-location';
import {requestPermissionsAsync} from 'expo-notifications';
import {requestMediaLibraryPermissionsAsync} from 'expo-image-picker';
import CustomAlert from '../custom/alert/CustomAlert';

const PermissionsRequestComponent = () => {
  const [permissionsGranted, setPermissionsGranted] = useState({
    location: false,
    notifications: false,
    photos: false,
  });
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // Запрос на разрешение локации
        const { status: locationStatus } = await requestForegroundPermissionsAsync();
        const locationGranted = locationStatus === 'granted';

        // Запрос на разрешение уведомлений
        const { status: notificationsStatus } = await requestPermissionsAsync();
        const notificationsGranted = notificationsStatus === 'granted';

        // Запрос на разрешение доступа к фото
        const { status: photosStatus } = await requestMediaLibraryPermissionsAsync();
        const photosGranted = photosStatus === 'granted';

        // Обновляем состояние всех разрешений
        setPermissionsGranted({
          location: locationGranted,
          notifications: notificationsGranted,
          photos: photosGranted,
        });

        // Проверяем, все ли разрешения предоставлены
        if (!locationGranted || !notificationsGranted || !photosGranted) {
          setAlertVisible(true);

        } 
      } catch (error) {
        console.error(error);
      }
    };

    // Запускаем запрос разрешений при монтировании компонента
    requestPermissions();
  }, []);

  return <CustomAlert isVisible={alertVisible} onClose={() =>{}} message={'Не все разрешения были предоставлены, функциональность будет ограничена, предоставьте разрешения в менеджере приложений'} type={'info'} />;
};

export default PermissionsRequestComponent;

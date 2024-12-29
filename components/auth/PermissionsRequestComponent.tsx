import React, { useEffect, useState } from "react";
import { 
  requestForegroundPermissionsAsync 
} from "expo-location";
import { 
  requestPermissionsAsync 
} from "expo-notifications";
import { 
  requestMediaLibraryPermissionsAsync 
} from "expo-image-picker";
import CustomAlert from "../custom/alert/CustomAlert";
import uiStore from "@/stores/UIStore";
import i18n from "@/i18n";

const PermissionsRequestComponent = () => {
  const [permissionsGranted, setPermissionsGranted] = useState({
    location: uiStore.getLocationPermissionGranted(),
    notifications: uiStore.getNotificationPermissionGranted(),
    photos: uiStore.getPhotosPermissionGranted(),
  });
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        console.log("Запрашиваем все разрешения...");

        const [
          { status: locationStatus },
          { status: notificationsStatus },
          { status: photosStatus }
        ] = await Promise.all([
          requestForegroundPermissionsAsync(),
          requestPermissionsAsync(),
          requestMediaLibraryPermissionsAsync(),
        ]);

        const locationGranted = locationStatus === "granted";
        const notificationsGranted = notificationsStatus === "granted";
        const photosGranted = photosStatus === "granted";

        // Сохраняем в локальном стейте
        setPermissionsGranted({
          location: locationGranted,
          notifications: notificationsGranted,
          photos: photosGranted,
        });

        // Сохраняем во внешнем хранилище (UIStore)
        uiStore.setLocationPermissionGranted(locationGranted);
        uiStore.setNotificationPermissionGranted(notificationsGranted);
        uiStore.setPhotosPermissionGranted(photosGranted);

        // Если хотя бы одно разрешение не выдано, показываем Alert
        if (!locationGranted || !notificationsGranted || !photosGranted) {
          setAlertVisible(true);
        }

        console.log("Результат разрешений:", {
          location: locationGranted,
          notifications: notificationsGranted,
          photos: photosGranted,
        });
      } catch (error) {
        console.error("Ошибка при запросе разрешений:", error);
      }
    };

    requestPermissions();

    return () => {
      // Код выполняется при размонтировании
      console.log('Компонент размонтирован');
    };
  }, []);

  return (
    <CustomAlert
      isVisible={alertVisible}
      onClose={() => setAlertVisible(false)}
      message={i18n.t("permissions")}
      type="info"
      image={require("../../assets/images/alert-dog-sad-2.png")}
    />
  );
};

export default PermissionsRequestComponent;
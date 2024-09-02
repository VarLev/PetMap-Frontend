// notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import apiClient from './axiosConfig';

// Регистрация устройства для получения пуш-уведомлений
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.error('Failed to get push token for push notification!');
      return null;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      console.error('Project ID not found');
      return null;
    }
    try {
      const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("Push token:", token);
      return token;
    } catch (error) {
      console.error('Failed to get Expo push token:', error);
      return null;
    }
  } else {
    console.error('Must use physical device for Push Notifications');
    return null;
  }
}

// Настройка слушателей уведомлений
export function setupNotificationListeners(
  onNotificationReceived: (notification: Notifications.Notification) => void,
  onNotificationResponse: (response: Notifications.NotificationResponse) => void
): () => void { // Обратите внимание на возвращаемый тип
  const notificationListener = Notifications.addNotificationReceivedListener(onNotificationReceived);

  const responseListener = Notifications.addNotificationResponseReceivedListener(onNotificationResponse);

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}

// Отправка уведомлений через Expo сервера (пример)
export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data: any = {}
) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export async function savePushTokenToServer(userId: string | undefined , token: string) {
  try {
    if(userId){
      const response = await apiClient.post('/users/save-push-token', {
        userId: userId,
        pushToken: token,
      });
      if (response.status !== 200) {
        throw new Error('Failed to save push token on server');
      }
      
      console.log('Push token successfully saved on server');
    }
    else{
      console.log('Error saving push token, userId is not defined');
    }
  } catch (error) {
    console.error('Error saving push token:', error);
  }
}

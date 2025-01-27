import React, { useEffect, useState } from 'react';
import { router, Tabs, usePathname } from 'expo-router';
import TabBar from '@/components/navigation/TabBar';
import { DrawerProvider } from '@/contexts/DrawerProvider';
import { registerForPushNotificationsAsync, setupNotificationListeners, savePushTokenToServer } from '@/hooks/notifications';
import UserStore from '@/stores/UserStore';
import { Keyboard } from 'react-native';
import {isDevice} from 'expo-device';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DismissibleBanner from '@/components/ads/DismissibleBanner';
import userStore from '@/stores/UserStore';
import { BannerAdSize } from 'react-native-google-mobile-ads';

const Tabslayout = () => {
  const pathname = usePathname();
  const hideTabBar = pathname.includes('/chat/');
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
  
    // Регистрация устройства для пуш-уведомлений
    if(isDevice){
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          // Отправьте токен на сервер или сохраните локально, если это необходимо
          savePushTokenToServer(UserStore.currentUser?.id, token);
        }
      });
    }else{
    }
    

    // Настройка слушателей уведомлений
    const removeListeners = setupNotificationListeners(
      notification => {
        console.log('Получено уведомление:', notification);
      },
      response => {
        console.log('Ответ на уведомление:', response);
        const chatId = response.notification.request.content.data.chatId;
        if (chatId) {
          // Например, перейдите к нужному чату
          router.replace(`/chat/${chatId}`);
        }
      }
    );
    return () => {
      removeListeners();
    };
  },[]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setIsVisible(false));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setIsVisible(true));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView >
     <DrawerProvider> 
      <Tabs
        tabBar={(props: any) =>  (!hideTabBar && isVisible) && <TabBar {...props} />}
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#2f0f48',
          tabBarInactiveTintColor: '#9a76b7',
          
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            height: 70,
          },
        }}
        initialRouteName='map'
      >
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            headerShown: false, 
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            headerShown: false,
           
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
          }}
        />
      </Tabs>
       {!userStore.getUserHasSubscription() && <DismissibleBanner adSize={BannerAdSize.BANNER} />}
      </DrawerProvider>
    </GestureHandlerRootView>
  );
};

export default Tabslayout;

import React, { useCallback, useEffect, useState } from 'react';
import { router, Tabs, useFocusEffect, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import TabBar from '@/components/navigation/TabBar';
import { DrawerProvider } from '@/contexts/DrawerProvider';
import SidebarUserProfileComponent from '@/components/navigation/SidebarUserProfileComponent';
import { registerForPushNotificationsAsync, setupNotificationListeners, savePushTokenToServer } from '@/hooks/notifications';
//import { useStore } from '@/contexts/StoreProvider';
import UserStore from '@/stores/UserStore';
import { Alert, BackHandler } from 'react-native';

import { Pet } from '@/dtos/classes/pet/Pet';
import FilterComponent from '@/components/filter/FilterComponent';




const Tabslayout = () => {
  const pathname = usePathname();
  const hideTabBar = pathname.includes('/chat/');
  

  useEffect(() => {
    // Загрузка пользователей при первом монтировании компонента
    UserStore.loadUsersOnce();
    // Регистрация устройства для пуш-уведомлений
    console.log('Регистрация устройства для пуш-уведомлений');
    
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        // Отправьте токен на сервер или сохраните локально, если это необходимо
        savePushTokenToServer(UserStore.currentUser?.id, token);
      }
    });

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

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Если пользователь авторизован и нажимает "Назад", блокируем переход на экран авторизации
        if (UserStore.currentUser) {
          
          
          router.replace('/map');
    
          return true;
        } else {
          // Если пользователь не авторизован, разрешаем стандартное поведение кнопки "Назад"
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [UserStore.currentUser])
  );




  return (
    <>
     <DrawerProvider> 
      <Tabs
        tabBar={(props) => !hideTabBar && <TabBar {...props} />}
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
            headerShown: true, 
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            headerShown: true,
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
      <StatusBar backgroundColor="#161622" style="light" />
      </DrawerProvider>
    </>
  );
};

export default Tabslayout;

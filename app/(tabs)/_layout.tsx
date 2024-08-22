import React from 'react';
import { Tabs, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import TabBar from '@/components/navigation/TabBar';
import { DrawerProvider } from '@/contexts/DrawerProvider';
import SidebarUserProfileComponent from '@/components/navigation/SidebarUserProfileComponent';

const Tabslayout = () => {
  const pathname = usePathname();
  const hideTabBar = pathname.includes('/chat/');

  return (
    <>
     <DrawerProvider renderNavigationView={() => <SidebarUserProfileComponent />}> 
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

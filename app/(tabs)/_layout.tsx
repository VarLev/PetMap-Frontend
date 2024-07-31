import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import TabBar from '@/components/navigation/TabBar';

const Tabslayout = () => {
  return (
    <>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
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
      >
        <Tabs.Screen
          name="map"
          options={{
            title: 'Explore',
            headerShown: false,
          }}
        />
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
            title: 'Map',
            headerShown: true,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            headerShown: true,
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
    </>
  );
};

export default Tabslayout;

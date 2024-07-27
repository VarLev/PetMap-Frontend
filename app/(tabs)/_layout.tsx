import React from 'react'
import { Tabs } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Feather, Ionicons, FontAwesome} from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { StatusBar } from 'expo-status-bar';

const Tabslayout = () => {
  return (
    <>
      <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#2f0f48',
        tabBarInactiveTintColor: '#9a76b7',
        tabBarStyle: {
          backgroundColor: 'white',
          // borderTopColor: 'grey',
          borderTopWidth: 1,
          height: 70
        }
      }}
      >
        <Tabs.Screen name="explore" options={{
          title: 'Explore',
          headerShown: false,
          tabBarIcon: ({color}) => <MaterialCommunityIcons name="web" size={24} color={color} />}}
        />
        <Tabs.Screen name="search" options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({color}) => <AntDesign name="search1" size={24} color={color}  />}} 
        />
        <Tabs.Screen name="map" options={{
          title: 'map',
          headerShown: false,
          tabBarIcon: ({color}) => <Feather name="map-pin" size={34} color={color}  />}} 
        />
        <Tabs.Screen name="chat" options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({color}) => <Ionicons name="chatbubble-ellipses-outline" size={24} color={color}  />}} 
        />
        <Tabs.Screen name="profile" options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({color}) => <FontAwesome name="user-circle-o" size={24} color={color}  />}} 
        />
      </Tabs>
      <StatusBar backgroundColor='#161622' style='light'/>
    </>
  )
}

export default Tabslayout
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// Импорт экранов
import NewsScreen from './news';
import ActivitiesScreen from './activities';
import WikiScreen from './wiki';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TopTab = createMaterialTopTabNavigator();

export default function Layout() {
  return (
    <SafeAreaView className="bg-white h-full">
    <NavigationContainer>
    <TopTab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: 'blue' }, // Индикатор активной вкладки
        tabBarLabelStyle: { fontSize: 14, color: 'black', fontFamily: 'NunitoSans_700Bold'}, // Стили текста вкладок
        tabBarStyle: { backgroundColor: 'white' }, // Фон панели вкладок
      }}
    >
      <TopTab.Screen name="news" component={NewsScreen} options={{ title: 'Новости' }} />
      <TopTab.Screen name="activities" component={ActivitiesScreen} options={{ title: 'Активности' }} />
      <TopTab.Screen name="wiki" component={WikiScreen} options={{ title: 'WIKI' }} />
    </TopTab.Navigator>
    </NavigationContainer>
    </SafeAreaView>
  );
}

import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// Импорт экранов
import NewsScreen from './news';
import ActivitiesScreen from './activities';
import WikiScreen from './wiki';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '@/i18n';

const TopTab = createMaterialTopTabNavigator();

export default function Layout() {
  const [swipeEnabled, setSwipeEnabled] = useState(true);
  return (
    <SafeAreaView className="bg-white h-full">
    <NavigationContainer>
    <TopTab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: 'blue' }, // Индикатор активной вкладки
        tabBarLabelStyle: { fontSize: 14, color: 'black', fontFamily: 'NunitoSans_700Bold'}, // Стили текста вкладок
        tabBarStyle: { backgroundColor: 'white' }, // Фон панели вкладок
        swipeEnabled: swipeEnabled,
      }}
    >
       <TopTab.Screen
            name="news"
            options={{ title: i18n.t("search.news") }}
          >
            {() => (
              <NewsScreen setSwipeEnabled={setSwipeEnabled} />
            )}
          </TopTab.Screen>
      <TopTab.Screen name="activities" component={ActivitiesScreen} options={{ title: i18n.t("search.activitis") }} />
      <TopTab.Screen name="wiki" component={WikiScreen} options={{ title: 'WIKI' }} />
    </TopTab.Navigator>
    </NavigationContainer>
    </SafeAreaView>
  );
}

// app/(tabs)/search/wiki/index.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ArticlesList from '@/components/search/ArticlesList';
import ArticleView from './articleView';

const Stack = createNativeStackNavigator();

export default function WikiScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ArticlesList"
        component={ArticlesList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="articleView"
        component={ArticleView}
        options={{ headerShown: true, headerBackButtonDisplayMode:'minimal', headerTitleStyle:{fontFamily: 'NunitoSans_700Bold'}, headerTitle: 'Назад' }}
      />
    </Stack.Navigator>

  );
}
// app/(tabs)/search/wiki/index.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ArticlesList from '@/components/search/ArticlesList';
import ArticleView from './articleView';
import CustomHeader from '@/components/navigation/headers/CustomHeader';

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
        options={{ 
          headerTitleStyle:{fontFamily: 'NunitoSans_700Bold'}, 
          header: (props) => <CustomHeader {...props} />
        }}
      />
    </Stack.Navigator>

  );
}
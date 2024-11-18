import React from 'react';
import { View, Text } from 'react-native';

export default function News() {
  return (
    <View className="p-4">
      <Text className="text-lg font-bold">Новости</Text>
      <Text>Здесь будет отображаться новостная лента.</Text>
    </View>
  );
}
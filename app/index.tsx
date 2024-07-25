import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';;

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View className="flex-2 items-center justify-center bg-black">
        <Button title="Go to Auth" onPress={() => router.push('/auth')} />
    </View>
  );
};



export default HomeScreen;

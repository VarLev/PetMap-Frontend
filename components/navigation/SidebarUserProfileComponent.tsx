import React, { useState } from 'react';
import { View, Text,Image  } from 'react-native';
import { Button, List, Switch, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '@/constants/Images';
import userStore from '@/stores/UserStore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useDrawer } from '@/contexts/DrawerProvider';


const SidebarUserProfileComponent = () => {
  const [sosEnabled, setSosEnabled] = useState(false);
  const currentUser = userStore.currentUser;
  const { closeDrawer } = useDrawer();

  const handleToggleSos = () => setSosEnabled(!sosEnabled);

  const handleProfilePress = () => {
    router.replace('/profile');
    closeDrawer();
  }
 
  return (
    <SafeAreaView className='bg-white h-full'>
      <View className="flex-1 p-5 bg-white">
        <View className='flex-row'>
            <Image source={images.logoWithBack} style={{ width: 32, height: 32 }} />
            <Text className="ml-2 text-2xl text-gray-800 font-nunitoSansBold">PetMap</Text>
        </View>
        <TouchableRipple className='w-full mt-2 -ml-4' onPress={handleProfilePress}>
          <View className='p-2 flex-row justify-start items-center'>
            <Image source={{ uri: currentUser?.thumbnailUrl! }} className='h-20 w-20 rounded-xl' />
            <View className='flex-col ml-3'>
              <Text className="text-xl text-gray-800 font-nunitoSansBold">{currentUser?.name}</Text>
              <Text className="-mt-1 text-gray-800 font-nunitoSansRegular">{currentUser?.email}</Text>
              <Text className="mt-1 text-indigo-800 font-nunitoSansBold">Открыть профиль</Text>
            </View>
          </View>
        </TouchableRipple>
  
        {/* Подписка */}
        <View className="flex-row mt-4 border rounded-2xl h-16 bg-purple-300 content-center items-center">
          <Button
            icon={() => <FontAwesome name="diamond" size={20} className='bg-indigo-800' color='#8F00FF' />}>
            <Text className='font-nunitoSansBold' >Подписка</Text>
          </Button>
          <Button mode="elevated" className="items-center content-center align-baseline h-16 -ml-2 text-xs rounded-2xl border text-indigo-800" style={{marginLeft:-5, width:140}}  contentStyle={{ marginTop:10, width:180}}  onPress={() => console.log('7 дней бесплатно')}>
            7 дней бесплатно
          </Button>
        </View>

        {/* Меню */}
        <List.Section>
          <List.Item
            title="Задания и бонусы"
            left={() => <List.Icon icon="star-outline" />}
            onPress={() => console.log('Задания и бонусы')}
          />
          <List.Item
            title="Мои прогулки"
            left={() => <List.Icon icon="walk" />}
            onPress={() => console.log('Мои прогулки')}
          />
          <List.Item
            title="Мои локации"
            left={() => <List.Icon icon="map-marker" />}
            onPress={() => console.log('Мои локации')}
          />
          <List.Item
            title="Мои объявления"
            left={() => <List.Icon icon="briefcase-outline" />}
            onPress={() => console.log('Мои объявления')}
          />
          <List.Item
            title="Настройки"
            left={() => <List.Icon icon="cog-outline" />}
            onPress={() => console.log('Настройки')}
          />
          <List.Item
            title="SOS Оповещения"
            left={() => <List.Icon icon="bell-outline" />}
            right={() => <Switch value={sosEnabled} onValueChange={handleToggleSos} />}
          />
          <List.Item
            title="Поддержка"
            left={() => <List.Icon icon="help-circle-outline" />}
            onPress={() => console.log('Поддержка')}
          />
        </List.Section>

        {/* Выйти */}
        <Button className='mt-8'
          icon="exit-to-app"
          mode="text"
          textColor="red"
          onPress={() => console.log('Выйти')}
        >
          Выйти
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default SidebarUserProfileComponent;

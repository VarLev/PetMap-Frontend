import React, { useEffect } from 'react';
import { Tabs, usePathname } from 'expo-router';
import TabBar from '@/components/navigation/TabBar';
import { DrawerProvider } from '@/contexts/DrawerProvider';
import { Keyboard, Platform, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DismissibleBanner from '@/components/ads/DismissibleBanner';
import userStore from '@/stores/UserStore';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import uiStore from '@/stores/UIStore';

const Tabslayout = () => {
  const pathname = usePathname();
  const hideTabBar = pathname.includes('/chat/')|| pathname.includes('/edit') ;
  // Используем shared value для управления видимостью таббара (1 - виден, 0 - скрыт)
  const tabBarVisibility = useSharedValue(1);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardShowListener = Keyboard.addListener(showEvent, () => {
      tabBarVisibility.value = withTiming(0, { duration: 200 });
      uiStore.setKeyboardVisible(true);
    });
    const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
      tabBarVisibility.value = withTiming(1, { duration: 200 });
      uiStore.setKeyboardVisible(false);
    });

    return () => {

      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [tabBarVisibility]);

  // Анимированный стиль: меняем opacity и смещаем таббар по оси Y
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: tabBarVisibility.value,
      transform: [
        {
          // При значении 0 таббар смещается вниз на 100 единиц, при 1 — возвращается в исходное положение.
          translateY: (1 - tabBarVisibility.value) * 100,
        },
      ],
    };
  });

  return (
    <GestureHandlerRootView>
      <DrawerProvider>
        <Tabs
          tabBar={(props: any) =>
            // Если страница не содержит "/chat/", показываем анимированный таббар
            !hideTabBar  && (
              <Animated.View style={animatedStyle}>
                <TabBar {...props} />
              </Animated.View>
            )
          }
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
          initialRouteName="map"
        >
          <Tabs.Screen
            name="search"
            options={{
              title: 'Search',
              headerShown: false,
              
            }}
            
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
              headerShown: false,
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
        {!userStore.getUserHasSubscription() && (
          <DismissibleBanner adSize={BannerAdSize.BANNER} uId={Platform.OS ==='ios'? 'ca-app-pub-2818079501156274/2800677323':'ca-app-pub-2818079501156274/1135956451'}  />
        )}
      </DrawerProvider>
    </GestureHandlerRootView>
  );
};

export default Tabslayout;

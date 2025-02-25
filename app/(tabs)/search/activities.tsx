import Feed from '@/components/search/feed/Feed';
import { BG_COLORS } from '@/constants/Colors';
import i18n from '@/i18n';
import userStore from '@/stores/UserStore';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Banner, Text } from 'react-native-paper';

export default function Activities() {
  function setBannerVisible(arg0: boolean): void {
    router.replace('/(auth)/welcomeScreen');
  }
  return (
    <GestureHandlerRootView className='flex-1 bg-white'>
      {!userStore.getLogged() && (
        <Banner className='bg-violet-200'

          visible={!userStore.getLogged()}
          icon={({ size, color }) => (
            <FontAwesome5
              name="user-lock"
              size={40}
              color={BG_COLORS.white} // указываем нужный цвет
            />
          )}
          style={{ marginTop: -15, height: 115 }}
          contentStyle={{ marginVertical: 0 }}

          actions={[
            {
              label: i18n.t("makeAnauthorized"),
              onPress: () => setBannerVisible(false),
              textColor: BG_COLORS.indigo[800],
              labelStyle: { fontFamily: 'NunitoSans_700Bold' },
              style: { marginTop: -20 },
            },
          ]}
        >


          <Text className='font-nunitoSansBold' >
            {i18n.t("userAnauthorized")}
          </Text>


        </Banner>
      )}
      <Feed />
    </GestureHandlerRootView>
  );
}

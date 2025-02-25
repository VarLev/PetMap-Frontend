import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
import PermissionsRequestComponent from '@/components/auth/PermissionsRequestComponent';
import PetsGrid from '@/components/search/PetsGrid';
import { BG_COLORS } from '@/constants/Colors';
import i18n from '@/i18n';
import { FontAwesome5 } from '@expo/vector-icons';
import { Banner, Text } from 'react-native-paper';
import { router } from 'expo-router';
import userStore from '@/stores/UserStore';
import { logScreenView } from '@/services/AnalyticsService';

// Тип пропов для NewsScreen
interface NewsScreenProps {
  setSwipeEnabled: (enabled: boolean) => void;
}

const NewsScreen: FC<NewsScreenProps> = ({ setSwipeEnabled }) => {
  
  useEffect(() => {
    logScreenView("PetGridScreen");
  }, []);

  function setBannerVisible(arg0: boolean): void {
    router.replace('/(auth)/welcomeScreen');
  }

  return (
    <View className="flex-1 bg-white">
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

      <PermissionsRequestComponent />
      {/* <NewsWebView setSwipeEnabled={setSwipeEnabled} /> */}
      <PetsGrid />
    </View>
  );
};

export default NewsScreen;

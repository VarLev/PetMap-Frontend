import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

interface DismissibleBannerProps {
  adSize: BannerAdSize;
}

const DismissibleBanner: React.FC<DismissibleBannerProps> = ({ adSize }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null; // Если баннер скрыт, ничего не рендерим
  }

  return (
    <View className="relative items-center justify-center bg-white py-2">
      {/* Кнопка закрытия */}
      <TouchableOpacity
        className="absolute top-0 right-0 p-1 z-10"
        onPress={() => setIsVisible(false)}
      >
        <Text className="text-3xl text-black">✕</Text>
      </TouchableOpacity>
      
      {/* Сам баннер */}
      <BannerAd
        unitId={TestIds.BANNER} // Замените на ваш реальный ID рекламного блока
        size={adSize}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => {
          console.log('Ошибка загрузки баннера:', error);
        }}
      />
    </View>
  );
};

export default DismissibleBanner;

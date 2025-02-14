import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

interface DismissibleBannerProps {
  adSize: BannerAdSize;
  uId: string;
}

const DismissibleBanner: React.FC<DismissibleBannerProps> = ({ adSize, uId }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Если баннер был закрыт или произошла ошибка загрузки, не рендерим его
  if (!isVisible || hasError) {
    return null;
  }

  return (
    <View className="relative items-center justify-center bg-white py-2">
      {/* Кнопка закрытия */}
      {/* <TouchableOpacity
        className="absolute top-0 right-0 p-1 z-10"
        onPress={() => setIsVisible(false)}
      >
        <Text className="text-3xl text-black">✕</Text>
      </TouchableOpacity> */}
      
      {/* Баннер */}
      <BannerAd
        unitId={uId} // Используйте ваш реальный ID рекламного блока
        size={adSize}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          // Если баннер загрузился успешно, можно сбросить флаг ошибки (на случай повторной загрузки)
          setHasError(false);
        }}
        onAdFailedToLoad={(error) => {
          console.log('Ошибка загрузки баннера:', error);
          setHasError(true);
        }}
      />
    </View>
  );
};

export default DismissibleBanner;

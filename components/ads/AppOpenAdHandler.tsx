import React, { useEffect, useState, useRef } from 'react';
import { AppOpenAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { ActivityIndicator, View } from 'react-native';

interface AppOpenAdHandlerProps {
  onAdComplete: () => void;
}

const AppOpenAdHandler: React.FC<AppOpenAdHandlerProps> = ({ onAdComplete }) => {
  const [adLoaded, setAdLoaded] = useState(false);

  // Используем useRef, чтобы экземпляр объявления не пересоздавался при каждом рендере
  const appOpenAdRef = useRef(
    AppOpenAd.createForAdRequest(TestIds.APP_OPEN, {
      requestNonPersonalizedAdsOnly: true,
    })
  );

  useEffect(() => {
    const appOpenAd = appOpenAdRef.current;

    const unsubscribeLoaded = appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      setAdLoaded(true);
    });

    const unsubscribeClosed = appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
      onAdComplete();
    });

    const unsubscribeError = appOpenAd.addAdEventListener(AdEventType.ERROR, () => {
      // Если не удалось загрузить объявление, продолжим без рекламы
      onAdComplete();
    });

    appOpenAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, [onAdComplete]);

  useEffect(() => {
    const appOpenAd = appOpenAdRef.current;
    if (adLoaded) {
      // Показываем объявление только после того, как оно действительно загрузилось
      appOpenAd.show().catch(() => onAdComplete());
    }
  }, [adLoaded, onAdComplete]);

  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default AppOpenAdHandler;

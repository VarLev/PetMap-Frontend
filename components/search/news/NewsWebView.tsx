import React, { FC, useEffect, useState, useMemo, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { View, ActivityIndicator, Animated, Easing } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import searchStore from '@/stores/SearchStore';

interface NewsWebViewProps {
  setSwipeEnabled: (enabled: boolean) => void;
}

const NewsWebView: FC<NewsWebViewProps> = observer(({ setSwipeEnabled }) => {
  const [loading, setLoading] = useState(false);

  // Animated.Value для плавного появления
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchData();
  }, []);

  // Когда загрузка завершилась (loading === false), запускаем анимацию

  const fetchData = () => {
    setLoading(true);
    searchStore.fetchNews().finally(() => {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500, // Длительность анимации
        easing: Easing.ease, // Тип "смягчения" анимации
        useNativeDriver: true,
      }).start();
    });
  };

  const combinedHTML = useMemo(() => {
    // Формируем содержимое, где в одной из «новостей» есть iframe
    const content = searchStore.news.map((itemHtml) => itemHtml).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=0.9"/>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;
  }, [searchStore.news]);

  const onHandlerStateChange = (event: any) => {
    const { state } = event.nativeEvent;
    if (state === State.BEGAN) {
      setSwipeEnabled(false);
    } else if (state === State.END || state === State.CANCELLED || state === State.FAILED) {
      setSwipeEnabled(true);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99,
            backgroundColor: '#ffffffcc',
          }}
        >
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      )}

      <PanGestureHandler onHandlerStateChange={onHandlerStateChange} failOffsetY={[-9999, 9999]}>
        <View style={{ flex: 1 }}>
          {/* Анимируем WebView, меняя opacity с 0 до 1 */}
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <WebView source={{ html: combinedHTML }} javaScriptEnabled onContentProcessDidTerminate={() => setLoading(false)} style={{ flex: 1 }} />
          </Animated.View>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
});

export default NewsWebView;

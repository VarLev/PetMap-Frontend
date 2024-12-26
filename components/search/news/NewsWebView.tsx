import React, { FC, useEffect, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { View, ActivityIndicator } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import searchStore from '@/stores/SearchStore';

interface NewsWebViewProps {
  setSwipeEnabled: (enabled: boolean) => void;
}

const NewsWebView: FC<NewsWebViewProps> = observer(({ setSwipeEnabled }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    searchStore.fetchNews().finally(() => {
      setLoading(false);
    });
  };

  const combinedHTML = useMemo(() => {
    if (searchStore.news.length === 0) {
      return `
        <!DOCTYPE html>
        <html>
          <head><meta charset="UTF-8"/></head>
          <body style="display:flex;align-items:center;justify-content:center;height:100%;margin:0;font-family:sans-serif">
            <h2>Новостей пока нет</h2>
          </body>
        </html>
      `;
    }

    // Формируем содержимое, где в одной из «новостей» есть iframe
    const content = searchStore.news
      .map((itemHtml) => `
        <div style="border-bottom:1px solid #ccc; padding: 16px 0;">
          ${itemHtml}
        </div>
      `)
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          body {
            margin: 0;
            padding: 16px;
            font-family: sans-serif;
            color: #333;
            background-color: #f5f5f5;
          }
          .card {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 16px;
            padding: 16px;
            line-height: 1.4;
            text-align: justify;
          }
          .card img {
            width: 100%;
            display: block;
            margin: 0 auto 10px;
            border-radius: 6px;
          }
          h2 { margin: 0 0 8px; }
          iframe {
            display: block;
            margin: 10px auto;
            border: none;
          }
        </style>
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
    } else if (
      state === State.END ||
      state === State.CANCELLED ||
      state === State.FAILED
    ) {
      setSwipeEnabled(true);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading && (
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          justifyContent: 'center', alignItems: 'center', zIndex: 99,
          backgroundColor: '#ffffffcc'
        }}>
          <ActivityIndicator size="large" color="#6200ee" />
          
        </View>
      )}

      <PanGestureHandler
        onHandlerStateChange={onHandlerStateChange}
        failOffsetY={[-9999, 9999]}
      >
        <View style={{ flex: 1 }}>
          <WebView
            source={{ html: combinedHTML }}
            javaScriptEnabled
            onLoadEnd={() => setLoading(false)}
            style={{ flex: 1 }}
          />
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
});

export default NewsWebView;

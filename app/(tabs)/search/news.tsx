import React, { FC } from 'react';
import { View } from 'react-native';
import PermissionsRequestComponent from '@/components/auth/PermissionsRequestComponent';
import NewsWebView from '@/components/search/news/NewsWebView';

// Тип пропов для NewsScreen
interface NewsScreenProps {
  setSwipeEnabled: (enabled: boolean) => void;
}

const NewsScreen: FC<NewsScreenProps> = ({ setSwipeEnabled }) => {
  return (
    <View className="flex-1 bg-white">
      <PermissionsRequestComponent />
      {/* 
        Передаём setSwipeEnabled дальше в NewsWebView,
        где будем блокировать/разблокировать свайп табов.
      */}
      <NewsWebView setSwipeEnabled={setSwipeEnabled} />
    </View>
  );
};

export default NewsScreen;

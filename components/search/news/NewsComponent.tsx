import { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { FlatList, View, ActivityIndicator, Text } from 'react-native';
import searchStore from '@/stores/SearchStore';
import PostNewsItem from './PostNewsItem';

const NewsComponent: FC = observer(() => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  useEffect(() => {
    searchStore.fetchNews(); // Загружаем новости при монтировании
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    searchStore.fetchNews().finally(() => {
      setIsRefreshing(false);
    }); 
  };

  if (searchStore.loading && searchStore.news.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!searchStore.loading && searchStore.news.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Новостей пока нет</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={searchStore.news}
        keyExtractor={(index) => `${ index}`} // Используем уникальный идентификатор или индекс
        renderItem={({ item }) => <PostNewsItem news={item} />}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={
          searchStore.loading ? (
            <ActivityIndicator size="large" color="#6200ee" />
          ) : (
            <View className="h-24" />
          )
        }
      />
    </View>
  );
});

export default NewsComponent;

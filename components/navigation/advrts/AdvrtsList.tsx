import AdvrtCard from '@/components/custom/cards/AdvrtCard';
import { IWalkAdvrtShortDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtShortDto';
import mapStore from '@/stores/MapStore';
import React, { useState, useEffect, useCallback } from 'react';
import {FlatList, ActivityIndicator } from 'react-native';


const AdvrtsList: React.FC = () => {
  const [ads, setAds] = useState<IWalkAdvrtShortDto[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);

  const pageSize = 20; // Количество объявлений на странице

  const loadAds = async (pageNumber: number) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      
      const newAds = await mapStore.getPagenatedWalks(pageNumber, pageSize);
      const items = newAds.data;
      console.log('newAds:', items.length);
      if (items.length < pageSize) {
        setHasMoreData(false);
      }
      setAds(prevAds => [...prevAds, ...items]);
    } catch (error) {
      console.error('Ошибка при загрузке объявлений:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAds(page);
  }, [page]);

  const handleLoadMore = () => {
    if (!hasMoreData || isLoading) return;
    setPage(prevPage => prevPage + 1);
  };

  const handleRefresh = () => {
    // setIsRefreshing(true);
    // setAds([]);
    // setPage(1);
    // setHasMoreData(true);
    // setIsRefreshing(false);
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator size="large" />;
  };

  const renderItem = useCallback(({ item }: { item: IWalkAdvrtShortDto }) => <AdvrtCard ad={item} />, []);

  return (
    <FlatList
      data={ads}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      ListFooterComponent={renderFooter}
    />
  );
};

export default AdvrtsList;

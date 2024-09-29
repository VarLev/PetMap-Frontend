import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, ActivityIndicator, View } from 'react-native';
import AdvrtCard from '@/components/custom/cards/AdvrtCard';
import MapPointDangerCard from '@/components/custom/cards/MapPointDangerCard';
import { MapPointType } from '@/dtos/enum/MapPointType';
import { IWalkAdvrtShortDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtShortDto';
import { IPointDangerDTO } from '@/dtos/Interfaces/map/IPointDangerDTO';
import mapStore from '@/stores/MapStore';
import SkeletonCard from '@/components/custom/cards/SkeletonCard';


interface AdvrtsListProps {
  renderType: MapPointType;
}



const MapItemList: React.FC<AdvrtsListProps> = ({ renderType }) => {
  const [points, setPoints] = useState<IWalkAdvrtShortDto[] | IPointDangerDTO[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);

  const pageSize = 20; // Количество объявлений на странице

  const loadAds = async (pageNumber: number, reset: boolean = false) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const newAds = await mapStore.getPagenatedPointItems(renderType, pageNumber, pageSize);
      const items = newAds.data;

      if (items.length < pageSize) {
        setHasMoreData(false);
      }

      // Если сброс, заменяем данные, иначе добавляем к существующим
      setPoints(reset ? items : (prevAds) => [...prevAds, ...items]);
    } catch (error) {
      console.error('Ошибка при загрузке объявлений:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление данных при изменении типа или страницы
  useEffect(() => {
    setPage(1); // Сбрасываем страницу при изменении типа
    setHasMoreData(true); // Сбрасываем флаг наличия данных
    loadAds(1, true); // Загружаем данные с первой страницы
  }, [renderType]);

  useEffect(() => {
    if (page > 1) {
      loadAds(page);
    }
  }, [page]);

  const handleLoadMore = () => {
    if (!hasMoreData || isLoading) return;
    setPage((prevPage) => prevPage + 1);
  };

  const handleRefresh = async () => {
    if (isRefreshing || isLoading) return;

    setIsRefreshing(true);
    setPage(1);
    setHasMoreData(true);

    try {
      const newAds = await mapStore.getPagenatedPointItems(renderType, 1, pageSize);
      setPoints(newAds.data);
    } catch (error) {
      console.error('Ошибка при обновлении объявлений:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderFooter = () => {
    if (!isLoading) return <View className="h-24" />;
    return <ActivityIndicator className="h-32" size="large" />;
  };

  // Рендеринг элемента списка в зависимости от типа
  const renderItem = useCallback(
    ({ item }: { item: IWalkAdvrtShortDto | IPointDangerDTO }) => {
      switch (renderType) {
        case MapPointType.Walk:
          return <AdvrtCard ad={item as IWalkAdvrtShortDto} />;
        case MapPointType.Danger:
          return <MapPointDangerCard mapPointDanger={item as IPointDangerDTO} />;
        default:
          return null;
      }
    },
    [renderType]
  );

  // Рендеринг скелетона (например, 5 элементов)
  const renderSkeletons = () => (
    <FlatList
      data={[...Array(5).keys()]} // Создаём 5 элементов для отображения скелетона
      keyExtractor={(item) => item.toString()}
      renderItem={() => (
 
          <View className="items-center ">
            
            <SkeletonCard/> 
          
          </View>
      
      )}
    />
  );

  return (
    <View className="pt-14">
      {isLoading && page === 1 ? (
        // Показываем скелетоны только если загружается первая страница
        renderSkeletons()
      ) : (
        <FlatList
          data={points}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

export default MapItemList;

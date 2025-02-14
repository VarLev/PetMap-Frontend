import React, { useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { FlatList, ActivityIndicator, View } from 'react-native';
import AdvrtCard from '@/components/custom/cards/AdvrtCard';
import DangerCard from '@/components/custom/cards/DangerCard';
import { MapPointType } from '@/dtos/enum/MapPointType';
import { IWalkAdvrtShortDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtShortDto';
import { IPointDangerDTO } from '@/dtos/Interfaces/map/IPointDangerDTO';
import mapStore from '@/stores/MapStore';
import SkeletonCard from '@/components/custom/cards/SkeletonCard';
import { LinearGradient } from 'expo-linear-gradient';
import uiStore from '@/stores/UIStore';
import { IPointEntityDTO } from '@/dtos/Interfaces/map/IPointEntityDTO';
import MapPointCard from '@/components/custom/cards/MapPointCard';
import BottomSheetComponent from '@/components/common/BottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet';
import ViewDangerOnMap from '@/components/map/point/ViewDangerOnMap';
import ViewUserPointOnMap from '@/components/map/point/ViewUserPointOnMap';

interface AdvrtsListProps {
  renderType: MapPointType;
}

const MapItemList: React.FC<AdvrtsListProps> = ({ renderType}) => {
  const [points, setPoints] = useState<IWalkAdvrtShortDto[] | IPointDangerDTO[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const sheetRef = useRef<BottomSheet>(null);
  const [renderContent, setRenderContent] = useState<React.ReactElement | null>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(uiStore.getIsBottomTableViewSheetOpen());

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
      setHasMoreData(false); // Останавливаем дальнейшие попытки загрузки
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
    return <ActivityIndicator className="h-32" size="large" color="#6200ee"  />;
  };

  const handleSheetClose = async () => {
    await sheetRef.current?.close();
    setIsSheetVisible(false);
  };

  const handleSheetOpen = async (id:string, mapPointType: MapPointType) => {

    const point = await mapStore.getMapPointById(id, mapPointType);
    if(mapPointType === MapPointType.Danger){
      const pointDanger = point as IPointDangerDTO;
      setRenderContent(() => (
        <ViewDangerOnMap mapPoint={pointDanger} />
      ));
    }
    else {
      const pointUser = point as IPointEntityDTO;
      setRenderContent(() => (
        <ViewUserPointOnMap mapPoint={pointUser} />
      ));
    }

    setIsSheetVisible(true);
    await sheetRef.current?.snapToIndex(0);
  }

  // Рендеринг элемента списка в зависимости от типа
  const renderItem = useCallback(
    ({ item }: { item: IWalkAdvrtShortDto | IPointDangerDTO | IPointEntityDTO}) => {
      switch (renderType) {
        case MapPointType.Walk:
          return <AdvrtCard ad={item as IWalkAdvrtShortDto} />;
        case MapPointType.Danger:
          return <DangerCard mapPointDanger={item as IPointDangerDTO} onDetailPress={handleSheetOpen}/>;
        case MapPointType.Park:
          return <MapPointCard mapPoint={item as IPointEntityDTO} onDetailPress={handleSheetOpen}  />;
        default:
          return <MapPointCard mapPoint={item as IPointEntityDTO} onDetailPress={handleSheetOpen}  />;
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
    <View className="flex-1">
      <LinearGradient
        colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
        className={`absolute top-0 left-0 right-0 ${uiStore.getIsPointSearchFilterTagSelected() ? 'h-40':'h-48'} z-10`}
      />
      {isLoading && page === 1 ? (
        // Показываем скелетоны только если загружается первая страница
        renderSkeletons()
      ) : (
        <FlatList
          data={points}
          ListHeaderComponent={<View className={`${uiStore.getIsPointSearchFilterTagSelected() ? 'h-20':'h-28'}`} />}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          initialNumToRender={10} // Количество элементов для рендеринга при старте
          maxToRenderPerBatch={10} // Максимальное количество элементов за один рендер
          windowSize={5} // Количество экранов данных для загрузки
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={renderFooter}
        />
      )}
     {isSheetVisible && ( <BottomSheetComponent
            ref={sheetRef}
            snapPoints={['85%']}
            renderContent={renderContent}
            onClose={handleSheetClose} 
            enablePanDownToClose={true}
            initialIndex={0}
          />)}
    </View>
  );
};

export default MapItemList;

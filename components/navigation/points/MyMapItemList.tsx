import React, { useState, useEffect, useCallback } from "react";
import { FlatList, ActivityIndicator, View, ScrollView,
  RefreshControl } from "react-native";
import MapPointDangerCard from "@/components/custom/cards/MapPointDangerCard";
import { MapPointType } from "@/dtos/enum/MapPointType";
import { IWalkAdvrtShortDto } from "@/dtos/Interfaces/advrt/IWalkAdvrtShortDto";
import { IPointDangerDTO } from "@/dtos/Interfaces/map/IPointDangerDTO";
import SkeletonCard from "@/components/custom/cards/SkeletonCard";
import userStore from "@/stores/UserStore";
import MyAdvrtCard from "@/components/custom/cards/MyAdvrtCard";
import mapStore from "@/stores/MapStore";
import CustomPlug from "@/components/custom/plug/CustomPlug";
import i18n from "@/i18n";

interface AdvrtsListProps {
  renderType: MapPointType;
}

const MyMapItemList: React.FC<AdvrtsListProps> = ({ renderType }) => {
  const [points, setPoints] = useState<
    IWalkAdvrtShortDto[] | IPointDangerDTO[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadAds = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const walks = await userStore.getUserWalks(userStore.currentUser!.id);
      setPoints(walks);
    } catch (error) {
      console.error("Ошибка при загрузке объявлений:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление данных при изменении типа или страницы
  useEffect(() => {
    loadAds(); // Загружаем данные с первой страницы
  }, [renderType]);

  const handleRefresh = async () => {
    if (isRefreshing || isLoading) return;
    setIsRefreshing(true);
    try {
      const walks = await userStore.getUserWalks(userStore.currentUser!.id);
      setPoints(walks);
    } catch (error) {
      console.error("Ошибка при обновлении объявлений:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderFooter = () => {
    if (!isLoading) return <View className="h-24" />;
    return <ActivityIndicator className="h-32" size="large" color="#6200ee" />;
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await mapStore.deleteWalkAdvrt(id);
      // После успешного удаления, обновляем состояние, фильтруя удалённый элемент
      setPoints((prevPoints) => prevPoints.filter((point) => point.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении объявления:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Рендеринг элемента списка в зависимости от типа
  const renderItem = useCallback(
    ({ item }: { item: IWalkAdvrtShortDto | IPointDangerDTO }) => {
      switch (renderType) {
        case MapPointType.Walk:
          return (
            <MyAdvrtCard
              ad={item as IWalkAdvrtShortDto}
              pressDelete={handleDelete}
            />
          );
        case MapPointType.Danger:
          return (
            <MapPointDangerCard mapPointDanger={item as IPointDangerDTO} />
          );
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
        <View className="items-center bg-white ">
          <SkeletonCard />
        </View>
      )}
    />
  );

  return (
    <View>
      {isLoading ? (
        renderSkeletons()
      ) : points.length === 0 ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["#6200ee"]}
            />
          }
        >
          <CustomPlug text={i18n.t("myWalks.noWalks")} />
        </ScrollView>
      ) : (
        <FlatList
          data={points}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

export default MyMapItemList;

import React, { useEffect, useState } from 'react';
import { FlatList, Image, View, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import petStore from '@/stores/PetStore';
import { IPetShortProfileGridDTO } from '@/dtos/Interfaces/pet/IPetShortProfileGridDTO';
import { router } from 'expo-router';
import ManualTagSelector from '../custom/inputs/ManualTagSelector';
import i18n from '@/i18n';

const PetsGrid = () => {
  // Состояния для списка питомцев, номера страницы, загрузки и выбранного статуса (тега)
  const [pets, setPets] = useState<IPetShortProfileGridDTO[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  // Выбранный статус, передаваемый в запрос (индекс выбранного тега).
  // По умолчанию выбираем первый тег, например, "С хозяином" (индекс 0)
  const [selectedStatus, setSelectedStatus] = useState<number>(0);

  // Функция запроса питомцев с сервера для указанной страницы.
  // isRefresh === true используется при pull-to-refresh.
  const fetchPets = async (pageToLoad: number, isRefresh: boolean = false) => {
    if (pageToLoad === 1 && !isRefresh) {
      setInitialLoading(true);
    }
    setLoading(true);
    try {
      // Здесь передаются параметры country, city, выбранный статус, страница и размер страницы.
      const data = await petStore.getPetsForGrid('USA', 'New York', selectedStatus, pageToLoad, 20);
      if (data) {
        if (pageToLoad === 1) {
          setPets(data);
        } else {
          setPets(prevPets => [...prevPets, ...data]);
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке питомцев:', error);
    } finally {
      if (pageToLoad === 1 && !isRefresh) {
        setInitialLoading(false);
      }
      setLoading(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  };

  // Первоначальная загрузка при монтировании компонента
  useEffect(() => {
    fetchPets(1);
  }, []);

  // При изменении выбранного статуса (тега) обновляем данные с первой страницы
  useEffect(() => {
    setPage(1);
    fetchPets(1, true);
  }, [selectedStatus]);

  // Обработчик бесконечной прокрутки – загружаем следующую страницу
  const handleLoadMore = () => {
    if (!loading && !refreshing) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPets(nextPage);
    }
  };

  // Обработчик pull-to-refresh – обновляем данные с первой страницы
  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchPets(1, true);
  };

  // Обработчик перехода на экран деталей питомца
  const handleOpenAccount = (pet: IPetShortProfileGridDTO) => {
    router.push(`/(pet)/${pet.id}`);
  };

  // Функция отрисовки элемента FlatList
  const renderItem = ({ item }: { item: IPetShortProfileGridDTO }) => {
    const imageUri = item.thumbnailUrl;
    return (
      <View className="flex-1 p-[3px]">
        <Card className="aspect-square" onPress={() => handleOpenAccount(item)}>
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full rounded-lg"
          />
        </Card>
      </View>
    );
  };

  // Футер для FlatList – индикатор загрузки при подгрузке новых страниц
  const renderFooter = () => {
    return loading && page > 1 ? (
      <View className="p-4 h-32">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ) : (
      <View className="h-32" />
    );
  };

  // Если идет первоначальная загрузка, отображаем индикатор по центру экрана
  if (initialLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="p-2">
      {/* ManualTagSelector передает индекс выбранного тега в onToggleTag */}
      <ManualTagSelector 
        tags={[i18n.t("petStatus.with_owner"), i18n.t("petStatus.lost"), i18n.t("petStatus.adoptable"), i18n.t("petStatus.mating"), i18n.t("petStatus.for_sale")]} 
        onToggleTag={(selectedIndex) => {
          // Если тег снят (null) — можно оставить значение по умолчанию или реализовать логику "без фильтра"
          setSelectedStatus(selectedIndex !== null ? selectedIndex : 0);
        }}
      />
      <FlatList
        data={pets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

export default PetsGrid;

import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Platform, Text, Pressable, Modal, Button } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import IconSelectorComponent from '../icons/IconSelectorComponent';
import CustomButtonWithIcon from '../buttons/CustomButtonWithIcon';
import CustomBudgeButton from '../buttons/CustomBudgeButton';
import CustomSnackBar from '../alert/CustomSnackBar';
import uiStore from '@/stores/UIStore';
import i18n from '@/i18n';
import { MapPointType } from '@/dtos/enum/MapPointType';
import userStore from '@/stores/UserStore';

interface SearchAndTagsProps {
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  onSearchTextChange: (text: string) => void;
  onTagSelected: (tag: number) => void;
  onOpenFilter: () => void;
  onOpenCardView: () => void;
  badgeCount: number;
  setSnackbarVisible: (visible: boolean) => void;
  snackbarVisible: boolean;
  onAddressSelected: (coordinates: [number, number]) => void;
}

const SearchAndTags: React.FC<SearchAndTagsProps> = ({
  selectedTag,
  setSelectedTag,
  onSearchTextChange,
  onTagSelected,
  onOpenFilter,
  onOpenCardView,
  badgeCount,
  setSnackbarVisible,
  snackbarVisible,
  onAddressSelected,
}) => {
  // Проверяем, есть ли подписка
  const hasSubscription = userStore.getUserHasSubscription();

  // Модальное окно для призыва к подписке
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const [isTagSelected, setIsTagSelected] = useState(false);
  const [isCardView, setIsCardView] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [loadingTag, setLoadingTag] = useState<MapPointType | null>(null);

  // Строка ввода
  const [searchText, setSearchText] = useState('');
  // Результаты поиска
  const [searchResults, setSearchResults] = useState<any[]>([]);
  // Флаг загрузки при запросе
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsIOS(Platform.OS === 'ios');
  }, []);

  // Debounce-логика для поиска
  useEffect(() => {
    // 1. Если тег выбран — отключаем поиск
    if (isTagSelected) {
      setSearchResults([]);
      return;
    }
    // 2. Если у пользователя нет подписки — тоже отключаем поиск
    if (!hasSubscription) {
      setSearchResults([]);
      return;
    }
    // 3. Если меньше 3 символов — не ищем
    if (searchText.length < 3) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsSearching(true);
        const queryParam = `${searchText},${userStore.getCurrentUserCity()},${userStore.getCurrentUserCountry()}`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&accept-language=en&q=${encodeURIComponent(
            queryParam
          )}`
        );
        const data = (await response.json()) as any[];
        console.log('Полученные данные:', data);

        if (data.length > 0) uiStore.setIsSearchAddressExpanded(true);
        setSearchResults(data);
      } catch (error) {
        console.log('Ошибка при поиске:', error);
      } finally {
        setIsSearching(false);
      }
    }, 900);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchText, isTagSelected, hasSubscription]);

  // При выборе адреса
  const handleSelectSearchResult = (item: any) => {
    setSearchText(item.display_name);
    setSearchResults([]);
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    onAddressSelected([lon, lat]);
  };

  // Очистка строки
  const handleClearSearchText = () => {
    setSearchText('');
    setSearchResults([]);
  };

  // === ЛОГИКА С ТЕГАМИ ===
  const handleSelectTag = (tagName: string, type: MapPointType = 0) => {
    setLoadingTag(type);
    setSnackbarVisible(false);

    setTimeout(() => {
      setLoadingTag(null);
      setIsTagSelected(true);
      setSelectedTag(tagName);
      setSearchText(tagName);
      setSearchResults([]);
      uiStore.setIsPointSearchFilterTagSelected(true);

      onTagSelected(type);
    }, 1500);
  };

  const handleClearTag = () => {
    setSelectedTag('');
    setIsTagSelected(false);
    setSearchText('');
    uiStore.setIsPointSearchFilterTagSelected(false);
  };

  // Переключение карты/списка
  const handleOpenCardView = () => {
    setIsCardView(!isCardView);
    onOpenCardView();
  };

  // Обработка ввода текста
  const handleChangeText = (text: string) => {
    // Если выбран тег — не даём вводить
    if (isTagSelected) {
      return;
    }
    // Если нет подписки — показываем модал и сбрасываем ввод
    if (!hasSubscription) {
      setShowSubscriptionModal(true);
      // Сбрасываем строку обратно, чтобы пользователь не видел ввод
      return;
    }
    // Иначе вводим
    setSearchText(text);
    onSearchTextChange(text);
  };

  return (
    <View style={{ position: 'relative', top: 0, left: 0, right: 0, zIndex: 1 }}>
      {/* Модальное окно призыва подключить подписку */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSubscriptionModal}
        onRequestClose={() => setShowSubscriptionModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Подключите Премиум</Text>
            <Text style={{ marginTop: 8 }}>
              С подпиской вы сможете искать адреса, видеть дополнительные функции и т.д.
            </Text>
            <View style={{ marginTop: 20 }}>
              <Button title="Закрыть" onPress={() => setShowSubscriptionModal(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Верхняя панель: поле ввода / фильтр / переключатель */}
      <View
        className={`flex-row w-full ${isIOS ? 'pt-6' : 'pt-2'} px-2 justify-center items-center`}
      >
        <View style={{ flex: 1 }}>
          <Searchbar
            // При выбранном теге поле ввода блокируем
            editable={!isTagSelected}
            value={isTagSelected ? selectedTag : searchText}
            onChangeText={handleChangeText}
            onClearIconPress={() => {
              if (isTagSelected) {
                handleClearTag();
              } else {
                handleClearSearchText();
              }
            }}
            elevation={1}
            style={{ backgroundColor: 'white' }}
            inputStyle={{
              color: 'black',
              fontFamily: 'NunitoSans_400Regular',
              padding: -10,
              alignSelf: 'center',
            }}
            className="h-12"
            placeholder={i18n.t('Map.searchAddress')}
          />

          {/* Показываем выпадающий список, только если тег не выбран и есть подписка */}
          {!isTagSelected && hasSubscription && searchResults.length > 0 && (
            <FlatList
              style={styles.dropdown}
              data={searchResults}
              renderItem={({ item }) => (
                <Pressable
                  onPressOut={() => handleSelectSearchResult(item)}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>{item.display_name}</Text>
                </Pressable>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>

        <CustomBudgeButton
          iconSet="Ionicons"
          iconName="filter"
          badgeCount={badgeCount}
          onPress={onOpenFilter}
        />

        <TouchableOpacity onPress={handleOpenCardView} activeOpacity={0.7}>
          <View
            className="bg-white justify-center items-center w-11 h-11 rounded-full"
            style={[styles.shadow, { elevation: 3 }]}
          >
            {isCardView ? (
              <IconSelectorComponent iconSet="Ionicons" iconName="map-outline" />
            ) : (
              <IconSelectorComponent iconSet="Ionicons" iconName="list-outline" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Если тег выбран — SnackBar, иначе — горизонтальный список тегов */}
      {isTagSelected ? (
        <CustomSnackBar visible={snackbarVisible} setVisible={setSnackbarVisible} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-2 px-1">
            <CustomButtonWithIcon
              iconName="people-outline"
              iconSet="Ionicons"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.walk'), MapPointType.Walk)}
              text={i18n.t('FilterSearchTags.walk')}
              buttonStyle="bg-white"
              isLoading={loadingTag === MapPointType.Walk}
            />
            <CustomButtonWithIcon
              iconName="alert-circle-outline"
              iconSet="Ionicons"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.danger'), MapPointType.Danger)}
              text={i18n.t('FilterSearchTags.danger')}
              buttonStyle="bg-white"
              isLoading={loadingTag === MapPointType.Danger}
            />
            <CustomButtonWithIcon
              iconName="leaf-outline"
              iconSet="Ionicons"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.park'), MapPointType.Park)}
              text={i18n.t('FilterSearchTags.park')}
              buttonStyle="bg-white"
              isLoading={loadingTag === MapPointType.Park}
            />
            <CustomButtonWithIcon
              iconName="basketball-outline"
              iconSet="Ionicons"
              onPress={() =>
                handleSelectTag(i18n.t('FilterSearchTags.playground'), MapPointType.Playground)
              }
              text={i18n.t('FilterSearchTags.playground')}
              buttonStyle="bg-white"
              isLoading={loadingTag === MapPointType.Playground}
            />
            <CustomButtonWithIcon
              iconName="select-place"
              iconSet="MaterialCommunityIcons"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.zone'), MapPointType.DogArea)}
              text={i18n.t('FilterSearchTags.zone')}
              buttonStyle="bg-white"
              isLoading={loadingTag === MapPointType.DogArea}
            />
            <CustomButtonWithIcon
              iconName="cafe-outline"
              iconSet="Ionicons"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.cafe'), MapPointType.Cafe)}
              text={i18n.t('FilterSearchTags.cafe')}
              buttonStyle="bg-white"
              isLoading={loadingTag === MapPointType.Cafe}
            />
            <CustomButtonWithIcon
              iconName="restaurant-outline"
              iconSet="Ionicons"
              onPress={() =>
                handleSelectTag(i18n.t('FilterSearchTags.restaurant'), MapPointType.Restaurant)
              }
              text={i18n.t('FilterSearchTags.restaurant')}
              buttonStyle="bg-white"
              isLoading={loadingTag === MapPointType.Restaurant}
            />
            <CustomButtonWithIcon
              iconName="heart-outline"
              iconSet="Ionicons"
              onPress={() =>
                handleSelectTag(i18n.t('FilterSearchTags.veterinary'), MapPointType.Veterinary)
              }
              text={i18n.t('FilterSearchTags.veterinary')}
              buttonStyle="bg-white"
              isLoading={loadingTag === MapPointType.Veterinary}
            />
            <CustomButtonWithIcon
              iconName="storefront-outline"
              iconSet="Ionicons"
              onPress={() =>
                handleSelectTag(i18n.t('FilterSearchTags.store'), MapPointType.PetStore)
              }
              text={i18n.t('FilterSearchTags.store')}
              buttonStyle="bg-white"
              isLoading={loadingTag === MapPointType.PetStore}
            />
            <CustomButtonWithIcon
              iconName="location-pin"
              iconSet="SimpleLine"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.note'), MapPointType.Note)}
              text={i18n.t('FilterSearchTags.note')}
              buttonStyle="bg-white"
              isLoading={loadingTag === MapPointType.Note}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    // iOS тени
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    // Android тени
    elevation: 3,
  },
  dropdown: {
    position: 'absolute',
    top: 52, // чтобы список был под Searchbar
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 9999,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 500,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },

  // Пример простого стиля для модального окна
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // полупрозрачный фон
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SearchAndTags;

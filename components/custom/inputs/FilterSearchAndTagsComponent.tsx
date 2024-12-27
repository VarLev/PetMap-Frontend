import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconSelectorComponent from '../icons/IconSelectorComponent';
import CustomButtonWithIcon from '../buttons/CustomButtonWithIcon';
import CustomBudgeButton from '../buttons/CustomBudgeButton';
import CustomSnackBar from '../alert/CustomSnackBar';
import uiStore from '@/stores/UIStore';
import i18n from '@/i18n';
import { MapPointType } from '@/dtos/enum/MapPointType';

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
  snackbarVisible
}) => {
  // Показывать ли сейчас список тегов или нет
  const [isTagSelected, setIsTagSelected] = useState(false);
  // Показываем ли сейчас карту/список (переключение иконки)
  const [isCardView, setIsCardView] = useState(false);
  // Проверяем платформу (iOS или нет)
  const [isIOS, setIsIOS] = useState(false);
  // Храним, для какого тега идёт загрузка (показывается ActivityIndicator на кнопке)
  const [loadingTag, setLoadingTag] = useState<MapPointType | null>(null);

  useEffect(() => {
    setIsIOS(Platform.OS === 'ios');
  }, []);

  // Вызывается при выборе конкретного тега
  const handleSelectTag = (tagName: string, type: MapPointType = 0) => {
    // Ставим «идёт загрузка» на выбранный тег
    setLoadingTag(type);
    // Скрываем снэкбар, если вдруг был показан
    setSnackbarVisible(false);

    // Эмулируем запрос к серверу (замените setTimeout на ваш реальный запрос)
    setTimeout(() => {
      // Когда получили ответ, снимаем загрузку
      setLoadingTag(null);
      // Теперь окончательно считаем, что тег выбран => список тегов скрывается
      setIsTagSelected(true);

      // Устанавливаем выбранный тег и флаг в UIStore
      setSelectedTag(tagName);
      uiStore.setIsPointSearchFilterTagSelected(true);

      // Вызываем колбэк родителя
      onTagSelected(type);
    }, 1500);
  };

  // Сброс выбранного тега
  const handleClearTag = () => {
    setSelectedTag('');
    setIsTagSelected(false);
    uiStore.setIsPointSearchFilterTagSelected(false);
  };

  // Переключаем вид (карта / список)
  const handleOpenCardView = () => {
    setIsCardView(!isCardView);
    onOpenCardView();
  };

  return (
    <View style={{ position: 'relative', top: 0, left: 0, right: 0, zIndex: 1 }}>
      {/* Поиск и две кнопки (Фильтры, переключатель Карта/Список) */}
      <View
        className={`flex-row w-full ${isIOS ? 'pt-6' : 'pt-2'} px-2 justify-center items-center`}
      >
        <Searchbar
          onChangeText={onSearchTextChange}
          value={selectedTag}
          onClearIconPress={handleClearTag}
          elevation={1}
          style={{ backgroundColor: 'white' }}
          inputStyle={{
            color: 'black',
            fontFamily: 'NunitoSans_400Regular',
            padding: -10,
            alignSelf: 'center',
          }}
          className="flex-1 h-12"
        />

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

      {/* Если тег уже «окончательно» выбран (isTagSelected = true), то показываем снэкбар.
          Если нет, показываем список тегов (при этом на нажатой кнопке будет спиннер). */}
      {!isTagSelected ? (
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
      ) : (
        // Снэкбар, который виден, когда тег уже «окончательно» выбран
        <CustomSnackBar visible={snackbarVisible} setVisible={setSnackbarVisible} />
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
    // Android тени через elevation
    elevation: 3,
  },
});

export default SearchAndTags;
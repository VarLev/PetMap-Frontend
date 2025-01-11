import i18n from '@/i18n';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';

interface CityDropdownProps {
  initialSelectedTag?: string; // Начально выбранный тег (по индексу или строке)
  label?: string; // Метка для выпадающего спискаь
  onChange?: (selectedTag: string | null) => void; // Обработчик изменения выбранного тега
}

const CustomDropDownCityList: React.FC<CityDropdownProps> = ({
  initialSelectedTag = '',
  label, // Метка для выпадающего списка
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(initialSelectedTag);
  const [items, setItems] = useState<ItemType<string>[]>(
    initialSelectedTag ? [{ label: initialSelectedTag, value: initialSelectedTag }] : []
  );
  const [searchText, setSearchText] = useState('');

  /**
   * Функция получения городов из Overpass API
   * по префиксу, который вводят в поиске DropDownPicker.
   */
  const fetchCities = async (prefix: string) => {
    // Для примера проверяем длину строки
    if (prefix.length < 5) {
      // Если меньше 3 символов, очищаем список
      
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      prefix
    )}&format=json&addressdetails=1&accept-language=en&namedetails=1&featureType=city&limit=10`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const json = await response.json();

      // Обработка данных
      const cityItems = json
        // 1. Фильтруем только подходящие типы результатов (если нужно)
        // 2. Убираем дубликаты ПОКА мы ещё не преобразовали структуру
        .filter(
          (city: { display_name: string }, index: number, self: { display_name: string }[]) =>
            index === self.findIndex((c: { display_name: string }) => c.display_name === city.display_name)
        )
        .map(
          (city: {
            address: {
              city?: string;
              town?: string;
              village?: string;
              municipality?: string;
              hamlet?: string;
              country?: string;
            };
            lat: string;
            lon: string;
          }) => {
            const cityName =
              city.address.city ||
              city.address.town ||
              city.address.village ||
              city.address.municipality ||
              city.address.hamlet ||
              'Unknown City';
            const countryName = city.address.country || 'Unknown Country';
            return {
              label: `${cityName}, ${countryName}`,
              value: `${cityName}, ${countryName}`,
            };
          }
        );

      console.log('cityIteфывфывms:', cityItems);
      setItems([...cityItems]);
      setValue(null);
    } catch (error) {
      console.error('Ошибка при запросе к Nominatim API:', error);
    }
  };

  /**
   * useEffect c "дебаунсом": срабатывает при каждом изменении searchText,
   * но выполняет fetchCities только по истечении 500 мс тишины.
   */
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Когда пользователь 500 мс не вводит текст, отправляем запрос
      fetchCities(searchText);
    }, 800);

    // Если searchText изменился (пользователь продолжил ввод),
    // то очищаем старый таймер, чтобы запрос не отправился слишком рано.
    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  return (
    <View style={{ paddingTop: 16, position: 'relative', zIndex: 3000 }}>
      {label && (
        <Text
          style={{
            color: '#454545',
            fontFamily: 'NunitoSans_400Regular',
            fontSize: 12,
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: '#fff',
            paddingHorizontal: 4,
            zIndex: 3001,
          }}
        >
          {label}
        </Text>
      )}
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Укажите ваш город"
        zIndex={3000}
        zIndexInverse={1}
        modalAnimationType="slide"
        /* Включаем встроенный поиск DropDownPicker */
        searchable
        disableLocalSearch
        searchPlaceholder={i18n.t('searchWord')}
        onChangeValue={onChange}
        /* Вместо прямого fetch внутри onChangeSearchText
           просто обновляем state searchText */
        onChangeSearchText={(text) => {
          //setValue(null);
          //setItems([]);
          setSearchText(text);
        }}
        searchTextInputProps={{
            autoCorrect: false,
            autoCapitalize: 'none',
            autoComplete: 'off',
            spellCheck: false,
            accessibilityElementsHidden:false,
            "aria-hidden":false,

        }}
        placeholderStyle={{
          color: '#454545',
          fontFamily: 'NunitoSans_400Regular',
          fontSize: 16,
        }}
        dropDownContainerStyle={{
          backgroundColor: '#ffffff',
          borderColor: '#5e5e5e',
          zIndex: 9999,
        }}
        disabledItemLabelStyle={{
          color: '#d5d5d5',
          fontFamily: 'NunitoSans_400Regular',
          fontSize: 16,
        }}
        textStyle={{
          color: '#454545',
          fontFamily: 'NunitoSans_400Regular',
          fontSize: 16,
        }}
        style={{
          borderColor: '#bfbfbf',
          backgroundColor: '#ffffff',
          borderRadius: 8,
        }}
        translation={{
          NOTHING_TO_SHOW: i18n.t('tagSelectors.nothingToShow'),
          SEARCH_PLACEHOLDER: i18n.t('tagSelectors.nothingToShow'),
        }}
        listMode="MODAL"
      />
    </View>
  );
};

export default CustomDropDownCityList;

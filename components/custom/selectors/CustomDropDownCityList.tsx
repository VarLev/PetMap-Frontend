import i18n from '@/i18n';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';

interface CityDropdownProps {
    initialSelectedTag?: string ; // Начально выбранный тег (по индексу или строке)
    label?: string; // Метка для выпадающего спискаь
    onChange?: (selectedTag: string | null) => void; // Обработчик изменения выбранного тега
}

const CustomDropDownCityList: React.FC<CityDropdownProps> = ({
    initialSelectedTag = 'czxcsac',
    label, // Метка для выпадающего списка
    onChange
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(initialSelectedTag);
  const [items, setItems] = useState<ItemType<string>[]>(initialSelectedTag ? [{label: initialSelectedTag, value: initialSelectedTag}] : []);
  const [searchText, setSearchText] = useState('');

  /**
   * Функция получения городов из Overpass API
   * по префиксу, который вводят в поиске DropDownPicker.
   */
  const fetchCities = async (prefix: string) => {
    if (prefix.length < 4) {
      // Если меньше 4 символов, очищаем список
      //setItems([]);
      return;
    }

    const overpassQuery = `
    [out:json][timeout:25];
    (
      node["place"="city"]["name:en"="${prefix}"];
      node["place"="city"]["name"="${prefix}"];
    );
    out;`;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const json = await response.json();
      const elements = json.elements || [];

      const cityItems = elements.map((element: any) => ({
        label: element.tags?.['name:en'] || element.tags?.name || 'No name',
        value: element.tags?.['name:en'] || element.tags?.name || 'No name',
      }));
      console.log('cityItems:', cityItems);
      setItems(cityItems);
    } catch (error) {
      console.error('Ошибка при запросе к Overpass API:', error);
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
    }, 500);

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
        searchPlaceholder={i18n.t('searchWord')}
        onChangeValue={onChange}
        searchTextInputProps={{ accessibilityLanguage: 'en' }}
        
        /* Вместо прямого fetch внутри onChangeSearchText
           просто обновляем state searchText */
        onChangeSearchText={text => {
            setItems([]);
            setSearchText(text);
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
            SEARCH_PLACEHOLDER: i18n.t('tagSelectors.nothingToShow')
          }}

        listMode="MODAL"
      />
    </View>
  
  );
};



export default CustomDropDownCityList;
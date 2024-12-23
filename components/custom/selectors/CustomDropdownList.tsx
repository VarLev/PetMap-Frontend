import i18n from '@/i18n';
import React, { useEffect, useState } from 'react';
import { View, Text, Platform} from 'react-native';
import DropDownPicker, { ListModeType } from 'react-native-dropdown-picker';

type MultiTagDropdownProps = {
  tags: string[]; // Коллекция доступных тегов как массив строк
  initialSelectedTag?: string | number; // Начально выбранный тег (по индексу или строке)
  placeholder?: string; // Плейсхолдер для выпадающего списка
  onChange?: (selectedTag: string | number | null) => void; // Обработчик изменения выбранного тега
  searchable?: boolean; // Возможность поиска тегов
  label?: string; // Метка для выпадающего списка
  listMode?: ListModeType;
  disabledIndexes?: number[]; // Индексы тегов, которые нужно заблокировать
};

const CustomDropdownList: React.FC<MultiTagDropdownProps> = ({
  tags,
  initialSelectedTag = '',
  placeholder = i18n.t('tagSelectors.selectTag'),
  onChange,
  searchable = false,
  label,
  listMode = 'SCROLLVIEW',
  disabledIndexes = [],
}) => {
  const [open, setOpen] = useState(false);
  
  const [items, setItems] = useState(
    tags.map((tag, index) => ({
      label: tag,
      value: index.toString(),
      disabled: disabledIndexes.includes(index),
    }))
  );

  // Синхронизация значения `value` с `initialSelectedTag`
  const initialValue = (() => {
    if (typeof initialSelectedTag === 'number') {
      if (initialSelectedTag >= 0 && initialSelectedTag < tags.length) {
        return initialSelectedTag.toString();
      } else {
        console.warn('initialSelectedTag is out of range');
        return null;
      }
    } else if (typeof initialSelectedTag === 'string') {
      const index = tags.indexOf(initialSelectedTag);
      return index !== -1 ? index.toString() : null;
    }
    return null;
  })();
  
  const [value, setValue] = useState<string | null>(initialValue);

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
        placeholder={placeholder}
        
        dropDownDirection={Platform.OS === 'ios' ? 'TOP' : 'AUTO'}
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
        searchable={searchable}
        maxHeight={300}
        zIndex={3000}
        zIndexInverse={1}
        onChangeValue={(selectedValue) => {
          
          const selectedIndex = parseInt(selectedValue || '', 10); // Преобразуем обратно в число
          if (!isNaN(selectedIndex)) {
            if (onChange) {
              onChange(selectedIndex); // Возвращаем строку, если начальный тег был строкой
            }
          } else if (onChange) {
            onChange(null);
          }
        }}
        modalAnimationType="slide"
        listMode={listMode}
        translation={{
          NOTHING_TO_SHOW: i18n.t('tagSelectors.nothingToShow'),
          SEARCH_PLACEHOLDER: i18n.t('tagSelectors.searchPlaceholder')
        }}
      />
    </View>
  );
};

export default CustomDropdownList;
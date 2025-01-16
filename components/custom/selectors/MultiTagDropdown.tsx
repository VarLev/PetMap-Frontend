import i18n from '@/i18n';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DropDownPicker, { ItemType, ListModeType, RenderBadgeItemPropsInterface } from 'react-native-dropdown-picker';

type MultiTagDropdownProps = {
  tags: string[]; // Коллекция доступных тегов как массив строк
  initialSelectedTags?: number[]; // Начальные выбранные теги (по индексам)
  placeholder?: string; // Плейсхолдер для выпадающего списка
  onChange?: (selectedTags: number[]) => void; // Обработчик изменения выбранных тегов
  label?: string; // Метка для выпадающего списка
  searchable?: boolean; // Возможность поиска тегов
  searchPlaceholder?: string; // Плейсхолдер для поисковой строки
  nothingToShow?: string; // Сообщение, о том, что теги не найдены
  listMode?: ListModeType; // Режим отображения списка
};

const MultiTagDropdown: React.FC<MultiTagDropdownProps> = ({
  tags,
  initialSelectedTags = [],
  placeholder = i18n.t('tagSelectors.selectTags'),
  onChange,
  label,
  searchable = false,
  searchPlaceholder = i18n.t('tagSelectors.searchPlaceholder'),
  nothingToShow = i18n.t('tagSelectors.nothingToShow'),
  listMode = 'FLATLIST'
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number[]>(initialSelectedTags); // Хранение индексов
  const items = tags.map((tag, index) => ({ label: tag, value: index.toString() })); // Преобразуем индексы в строки для DropDownPicker

  // Обновляем value при изменении initialSelectedTags
  useEffect(() => {
    setValue(initialSelectedTags);
  }, [initialSelectedTags]);

  const handleRemoveTag = (tagIndex: number) => {
    const updatedValue = value.filter(v => v !== tagIndex);
    setValue(updatedValue);
    if (onChange) {
      onChange(updatedValue);
    }
  };

  const handleSelectTag = (selectedValue: ItemType<string>[]) => {
    if (selectedValue) {
      const vals = selectedValue.map(v => parseInt(v.value!, 10)); // Преобразуем строковые индексы обратно в числа
      setValue(vals);
      if (onChange) {
        onChange(vals); // Возвращаем массив индексов
      }
    }
  };

  const renderCustomBadgeItem = ({ label, value }: RenderBadgeItemPropsInterface<string>) => {
    const index = parseInt(value, 10);
    return (
      <View
        key={value}
        style={{
          backgroundColor: '#F3E8FF', // Цвет фона бейджа
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
          marginRight: 5,
          marginBottom: 0,
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 3000
        }}
      >
        <Text style={{ color: 'black', marginRight: 5, fontFamily: 'NunitoSans_700Bold', fontSize: 12 }}>{label}</Text>
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleRemoveTag(index)}>
          <Text style={{ color: 'black' }}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="pt-4">
      {label && (
        <Text style={{
          color: '#454545',
          fontFamily: 'Arial',
          fontSize: 12,
          position: 'absolute',
          top: 8,
          left: 8,
          backgroundColor: '#fff',
          paddingHorizontal: 4,
          zIndex: 3001
        }}>
          {label}
        </Text>
      )}
      <DropDownPicker
        open={open}
        value={value.map(v => v.toString())} // Преобразуем индексы в строки для DropDownPicker
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        searchable={searchable}
        labelProps={{ style: { color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 } }}
        labelStyle={{ color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        onSelectItem={(c) => handleSelectTag(c as ItemType<string>[])}
        placeholder={placeholder}
        placeholderStyle={{ color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        dropDownContainerStyle={{
          backgroundColor: '#ffffff',
          borderColor: '#5e5e5e',
          zIndex: 3005,

        }}
        max={5}
        textStyle={{ color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        multiple={true}
        mode="BADGE"
        zIndex={3000}
        zIndexInverse={1000}
        style={{ borderColor: '#bfbfbf', backgroundColor: '#ffffff', borderRadius: 5 }}
        renderBadgeItem={renderCustomBadgeItem}
        modalAnimationType='slide'
        listMode={listMode}
        translation={{
          NOTHING_TO_SHOW: nothingToShow,
          SEARCH_PLACEHOLDER: searchPlaceholder
        }}
      />
    </View>
  );
};

export default MultiTagDropdown;

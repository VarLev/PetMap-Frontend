import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

type MultiTagDropdownProps = {
  tags: string[]; // Коллекция доступных тегов как массив строк
  initialSelectedTag?: string; // Начальные выбранные теги
  placeholder?: string; // Плейсхолдер для выпадающего списка
  onChange?: (selectedTag: string | null) => void; // Обработчик изменения выбранных тегов
  searchable?: boolean; // Возможность поиска тегов
  label?: string; // Метка для выпадающего списка
};

const CustomDropdownList: React.FC<MultiTagDropdownProps> = ({
  tags,
  initialSelectedTag = '',
  placeholder = "Выберите теги",
  onChange,
  searchable = false,
  label
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(initialSelectedTag);
  const [items, setItems] = useState(tags.map(tag => ({ label: tag, value: tag })));

  // Обновляем value при изменении initialSelectedTag
  useEffect(() => {
    setValue(initialSelectedTag || null);
  }, [initialSelectedTag]);

  return (
    <View style={{ paddingTop: 16 }}>
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
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={placeholder}
        placeholderStyle={{ color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        dropDownContainerStyle={{
          backgroundColor: '#ffffff',
          borderColor: '#5e5e5e',
          zIndex: 3005,
        }}
        textStyle={{ color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        style={{ borderColor: '#bfbfbf', backgroundColor: '#ffffff', borderRadius: 5 }}
        searchable={searchable}
        maxHeight={300}
        zIndex={3000}
        zIndexInverse={1000}
        onChangeValue={(selectedValue) => {
          if (onChange) onChange(selectedValue);
        }}
      />
    </View>
  );
};

export default CustomDropdownList;

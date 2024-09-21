import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker, { ListModeType } from 'react-native-dropdown-picker';

type MultiTagDropdownProps = {
  tags: string[]; // Коллекция доступных тегов как массив строк
  initialSelectedTag?: string | number; // Начально выбранный тег (по индексу или строке)
  placeholder?: string; // Плейсхолдер для выпадающего списка
  onChange?: (selectedTag: string | number | null) => void; // Обработчик изменения выбранного тега
  searchable?: boolean; // Возможность поиска тегов
  label?: string; // Метка для выпадающего списка
  listMode?: ListModeType;
  disabledInexes?: number[]; // Индексы тегов, которые нужно заблокировать  

};

const CustomDropdownList: React.FC<MultiTagDropdownProps> = ({
  tags,
  initialSelectedTag = '',
  placeholder = "Выберите теги",
  onChange,
  searchable = false,
  label,
  listMode = 'FLATLIST',
  disabledInexes = []
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState(tags.map((tag, index) => ({ label: tag, value: index.toString(), disabled: disabledInexes.includes(index) })));

  // Определение типа начального тега
  const isInitialTagNumber = typeof initialSelectedTag === 'number';

  // Обновляем value при изменении initialSelectedTag
  useEffect(() => {
    console.log(initialSelectedTag);
    if (isInitialTagNumber) {
      setValue(initialSelectedTag.toString()); // Сохраняем индекс как строку
    } else {
      setValue(tags.indexOf(initialSelectedTag as string) !== -1 ? tags.indexOf(initialSelectedTag as string).toString() : null);
    }
  }, [initialSelectedTag, tags, isInitialTagNumber]);

  return (
    <View style={{ paddingTop: 16 }}>
      {label && (
        <Text style={{
          color: '#454545',
          fontFamily:'NunitoSans_400Regular',
          fontSize: 12,
          position: 'absolute',
          top: 8,
          left: 8,
          backgroundColor: '#fff',
          paddingHorizontal: 4,
          zIndex: 3001
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
        placeholderStyle={{ color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        dropDownContainerStyle={{
          backgroundColor: '#ffffff',
          borderColor: '#5e5e5e',
          zIndex: 3005,
        }}
        disabledItemLabelStyle={{ color: '#d5d5d5', fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        textStyle={{ color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        style={{ borderColor: '#bfbfbf', backgroundColor: '#ffffff', borderRadius: 8 }}
        searchable={searchable}
        maxHeight={300}
        zIndex={3000}
        zIndexInverse={1000}
        onChangeValue={(selectedValue) => {
          const selectedIndex = parseInt(selectedValue || '', 10); // Преобразуем обратно в число
          if (!isNaN(selectedIndex)) {
             // Возвращаем индекс
            if (onChange) {
              console.log(tags[selectedIndex]);
              onChange(selectedIndex); // Возвращаем строку, если начальный тег был строкой
            }
          }
        }}
        modalAnimationType='slide'
        listMode={listMode}
      />
    </View>
  );
};

export default CustomDropdownList;

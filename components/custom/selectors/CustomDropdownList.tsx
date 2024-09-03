import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker, { RenderBadgeItemPropsInterface } from 'react-native-dropdown-picker';

type MultiTagDropdownProps = {
  tags: string[]; // Коллекция доступных тегов как массив строк
  initialSelectedTag?: string; // Начальные выбранные теги
  placeholder?: string; // Плейсхолдер для выпадающего списка
  onChange?: (selectedTags: string | null) => void; // Обработчик изменения выбранных тегов
  searchable?: boolean; // Возможность поиска тегов
  label?: string;
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

  const items = tags.map(tag => ({ label: tag, value: tag }));

  // Используем эффект для вызова onChange при изменении value
  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value]);

  // const handleSelectTag = (selectedValue: string | null) => {
  //   if (selectedValue !== value) {
  //     setValue(selectedValue);
  //     if (onChange) {
  //       onChange(selectedValue);
  //     }
  //   }
  // };

  return (
    <View className="pt-4">
      {label && (
        <Text
          style={{
            color: '#454545',
            fontFamily: 'Arial',
            fontSize: 12,
            position: 'absolute',
            top: 7,
            left: 10,
            backgroundColor: 'white',
            paddingHorizontal: 5,
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
        setValue={setValue} // Возвращаем setValue сюда
        
        placeholder={placeholder}
        placeholderStyle={{ color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        dropDownContainerStyle={{
          backgroundColor: '#ffffff',
          borderColor: '#5e5e5e',
          zIndex: 3002
        }}
        textStyle={{ color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        mode="BADGE"
        zIndex={3000}
        zIndexInverse={1000}
        style={{ borderColor: '#bfbfbf', backgroundColor: '#ffffff', borderRadius: 5 }}
        searchable={searchable}
        maxHeight={300}
      />
    </View>
  );
};

export default CustomDropdownList;

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DropDownPicker, { RenderBadgeItemPropsInterface } from 'react-native-dropdown-picker';

type MultiTagDropdownProps = {
  tags: string[]; // Коллекция доступных тегов как массив строк
  initialSelectedTag?: string; // Начальные выбранные теги
  placeholder?: string; // Плейсхолдер для выпадающего списка
  onChange?: (selectedTags: string) => void; // Обработчик изменения выбранных тегов
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
  const [value, setValue] = useState<string>(initialSelectedTag);
  const items = tags.map(tag => ({ label: tag, value: tag }));


   const handleSelectTag = (selectedValue: string) => {
    setValue(selectedValue);
    if (onChange) {
      onChange(selectedValue);
    }
  };

  const renderCustomBadgeItem = ({ label, value }: RenderBadgeItemPropsInterface<string>) => {
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
        }}
      >
        <Text style={{ color: 'black', marginRight: 5, fontFamily: 'NunitoSans_700Bold', fontSize:12 }}>{label}</Text>
        
      </View>
    );
  };

  return (
    <View className="pt-4">
      {label && (
        <Text
          style={{
            color: '#454545',
            fontFamily: 'Arial',
            fontSize: 12,
            position: 'absolute',
            top: 7, // Смещение лейбла вверх
            left: 10, // Смещение лейбла вправо
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
        labelProps={{ style: { color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 } }}
        labelStyle={{ color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
  
        setValue={setValue as (callback: any) => void} // Приведение типа к нужному
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
        style={{ borderColor: '#bfbfbf', backgroundColor: '#ffffff', borderRadius: 5, }}
        renderBadgeItem={renderCustomBadgeItem} 
        searchable={searchable}
        maxHeight={300}
      />
    </View>
  );
};

export default CustomDropdownList;

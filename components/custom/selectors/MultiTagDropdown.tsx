import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DropDownPicker, { ItemType, RenderBadgeItemPropsInterface } from 'react-native-dropdown-picker';

type MultiTagDropdownProps = {
  tags: string[]; // Коллекция доступных тегов как массив строк
  initialSelectedTags?: string[]; // Начальные выбранные теги
  placeholder?: string; // Плейсхолдер для выпадающего списка
  onChange?: (selectedTags: string[]) => void; // Обработчик изменения выбранных тегов
};

const MultiTagDropdown: React.FC<MultiTagDropdownProps> = ({
  tags,
  initialSelectedTags = [],
  placeholder = "Выберите теги",
  onChange
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[]>(initialSelectedTags);
  const items = tags.map(tag => ({ label: tag, value: tag }));

  const handleRemoveTag = (tag: string) => {
    const updatedValue = value.filter(v => v !== tag);
    setValue(updatedValue);
    if (onChange) {
      onChange(updatedValue);
    }
  };

  const handleSelectTag = (selectedValue: ItemType<string>[]) => {
    
    if(selectedValue){
      const vals = selectedValue.map(v => v.value!)
      
      if (onChange) {
        console.log(vals);
        onChange(vals);
      }
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
        <TouchableOpacity onPress={() => handleRemoveTag(value)}>
          <Text style={{ color: 'black' }}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="pt-4">
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        labelProps={{ style: { color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 } }}
        labelStyle={{ color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        setValue={setValue}// Приведение типа к нужному
        onSelectItem={(c)=>handleSelectTag(c as ItemType<string>[])}
        placeholder={placeholder}
        placeholderStyle={{ color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        dropDownContainerStyle={{
          backgroundColor: '#ffffff',
          borderColor: '#5e5e5e',
        }}
        textStyle={{ color: '#454545', fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
        multiple={true}
        mode="BADGE"
        zIndex={3000}
        zIndexInverse={1000}
        style={{ borderColor: '#bfbfbf', backgroundColor: '#ffffff', borderRadius: 5 }}
        renderBadgeItem={renderCustomBadgeItem} // Используем кастомный рендер бейджей
      />
    </View>
  );
};

export default MultiTagDropdown;

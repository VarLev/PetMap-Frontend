import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BG_COLORS } from '@/constants/Colors';

interface Button {  
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface CustomSegmentedButtonsProps {
  values: number | number[]; // Может быть число или массив
  onValueChange: (value: number | number[]) => void; // Возвращаем число или массив
  buttons: Button[]; // Кнопки передаются как пропс
  containerStyles?: object;
  buttonStyles?: object;
}

const CustomSegmentedButtonsWithProps: React.FC<CustomSegmentedButtonsProps> = ({
  values,
  onValueChange,
  buttons,
  containerStyles = {},
  buttonStyles = {},
}) => {
  const isSingleSelect = !Array.isArray(values);

  const handlePress = (index: number) => {
    if (isSingleSelect) {
      // Если одинарный выбор, не позволяем снять выбор.
      // Если выбранная кнопка уже активна, то ничего не делаем.
      if (values !== index) {
        onValueChange(index);
      }
    } else {
      const selectedValues = values as number[];
      if (selectedValues.includes(index)) {
        // Если уже выбран, снимаем выбор
        onValueChange(selectedValues.filter((value) => value !== index));
      } else {
        // Если не выбран, добавляем в список выбранных
        onValueChange([...selectedValues, index]);
      }
    }
  };

  const selectedIndexes = useMemo(() => {
    if (isSingleSelect) {
      return [values];
    }
    return values as number[];
  }, [values, isSingleSelect]);

  const isSelected = (index: number) => selectedIndexes.includes(index);

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          height: 52,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          overflow: 'hidden',
        },
        containerStyles,
      ]}
    >
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={[
            {
              flex: 1,
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isSelected(index) ? BG_COLORS.indigo[800] : '#fff',
              borderRightWidth: index !== buttons.length - 1 ? 1 : 0,
              borderColor: '#ccc',
            },
            buttonStyles,
          ]}
          onPress={() => handlePress(index)}
        >
          {button.icon && (
            <Ionicons
              name={button.icon}
              size={20}
              color={isSelected(index) ? '#fff' : '#000'}
            />
          )}
          <Text
            style={{
              color: isSelected(index) ? '#fff' : '#000',
              marginTop: button.icon ? 4 : 0,
            }}
          >
            {button.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CustomSegmentedButtonsWithProps;
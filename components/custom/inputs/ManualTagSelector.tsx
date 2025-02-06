// ManualTagSelector.tsx
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import CustomButtonWithIcon from '../buttons/CustomButtonWithIcon';

interface ManualTagSelectorProps {
  /** Массив строк, задающих текст для каждого тега */
  tags: string[];
  /**
   * Колбэк, вызываемый при переключении тега.
   * Передается индекс выбранного тега или null, если выбор снят.
   */
  onToggleTag?: (selectedIndex: number | null) => void;
}

const ManualTagSelector: React.FC<ManualTagSelectorProps> = ({ tags, onToggleTag }) => {
  // Состояние для хранения индекса выбранного тега (null — ни один не выбран)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Функция-обработчик переключения тега
  const handleToggle = (index: number) => {
    // Если текущий тег не выбран, выбираем его, иначе снимаем выбор (делаем null)
    const newSelectedIndex = selectedIndex === index ? null : index;
    setSelectedIndex(newSelectedIndex);
    onToggleTag?.(newSelectedIndex);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row items-center">
        {tags.map((tag, index) => {
          const isSelected = selectedIndex === index;
          return (
            <CustomButtonWithIcon
              key={index}
              onPress={() => handleToggle(index)}
              text={tag}
              // Меняем стиль кнопки в зависимости от выбранности
              buttonStyle={isSelected ? 'bg-violet-200' : 'bg-white'}
              selected={isSelected}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

export default ManualTagSelector;

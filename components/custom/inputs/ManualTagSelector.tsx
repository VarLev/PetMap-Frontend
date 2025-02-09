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
  /**
   * Массив индексов тегов, которые должны быть видимыми.
   * Если не указан, то отображаются все теги.
   */
  visibleIndices?: number[];
}

const ManualTagSelector: React.FC<ManualTagSelectorProps> = ({
  tags,
  onToggleTag,
  visibleIndices,
}) => {
  // Состояние для хранения индекса выбранного тега (null — ни один не выбран)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Обработчик переключения тега
  const handleToggle = (index: number) => {
    // Если тег уже выбран, то сбрасываем выбор, иначе выбираем его
    const newSelectedIndex = selectedIndex === index ? null : index;
    setSelectedIndex(newSelectedIndex);
    onToggleTag?.(newSelectedIndex);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row items-center">
        {tags.map((tag, index) => {
          // Если задан список видимых индексов и текущий индекс не входит в него – не рендерим тег
          if (visibleIndices && !visibleIndices.includes(index)) {
            return null;
          }
          const isSelected = selectedIndex === index;
          return (
            <CustomButtonWithIcon
              key={index}
              onPress={() => handleToggle(index)}
              text={tag}
              // Применяем разный стиль в зависимости от того, выбран тег или нет
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

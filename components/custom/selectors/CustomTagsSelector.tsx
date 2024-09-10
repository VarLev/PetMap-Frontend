import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Tags from 'react-native-tags';

interface CustomTagsSelectorProps {
  tags: string[];
  initialSelectedTags?: string[];
  onSelectedTagsChange?: (selectedTags: string[]) => void;
  maxSelectableTags?: number; // Ограничение на количество выбранных тегов
}

const CustomTagsSelector: React.FC<CustomTagsSelectorProps> = ({
  tags,
  initialSelectedTags = [],
  onSelectedTagsChange,
  maxSelectableTags
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);
  const [showAll, setShowAll] = useState(false); // Состояние для отображения всех тегов
  const refTags = React.useRef<Tags>(null);

  const handleTagPress = (index: number, tagLabel: string, event: any, deleted: boolean) => {
    let updatedSelectedTags;

    if (selectedTags.includes(tagLabel)) {
      updatedSelectedTags = selectedTags.filter(selected => selected !== tagLabel);
    } else {
      if (maxSelectableTags && selectedTags.length >= maxSelectableTags) {
        return; // Если достигнуто максимальное количество выбранных тегов, отменяем выбор
      }
      updatedSelectedTags = [...selectedTags, tagLabel];
    }

    setSelectedTags(updatedSelectedTags);

    // Вызываем onSelectedTagsChange при изменении тегов
    if (onSelectedTagsChange) {
      onSelectedTagsChange(updatedSelectedTags);
    }

    
    
  };

  // Обновляем selectedTags, если initialSelectedTags изменились
  useEffect(() => {
    setSelectedTags(initialSelectedTags);
  }, [initialSelectedTags]);


  const handleTagShortPress = (showAll: boolean) => {
    setShowAll(showAll);
    refTags.current?.setState({ tags: showAll ? tags : tags.slice(0, visibleTagsCount) });
  }

  // Устанавливаем количество тегов, которые будут видны по умолчанию
  const visibleTagsCount = 10;

  return (
    <View className='items-center pt-2'>
      <View >
        <Tags
          initialTags={showAll ? tags : tags.slice(0, visibleTagsCount)} // Показываем все теги или только первые 10
          readonly={true}
          onTagPress={handleTagPress}
          ref={refTags}
          renderTag={({ tag, index, onPress }) => (
            <TouchableOpacity
              key={`${tag}-${index}`}
              className={`px-2 py-2 m-1 justify-between rounded-full ${selectedTags.includes(tag) ? ' bg-purple-100' : 'bg-white border border-indigo-700'}`}
              onPress={onPress}
            >
              <Text className={`${selectedTags.includes(tag) ? 'text-black' : 'text-indigo-700'} text-xs font-nunitoSansBold`}>{tag}</Text>
            </TouchableOpacity>    
          )}
        />
      </View>
      {/* Спойлер для показа всех тегов */}
      {tags.length > visibleTagsCount && (
        <TouchableOpacity onPress={() => handleTagShortPress(!showAll)} className="mt-2">
          <Text className="text-indigo-700 text-sm font-nunitoSansBold">
            {showAll ? 'Свернуть' : `Показать ещё (${tags.length - visibleTagsCount})`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomTagsSelector;

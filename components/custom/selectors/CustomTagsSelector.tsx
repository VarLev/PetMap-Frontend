import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Tags from 'react-native-tags';

interface CustomTagsSelectorProps {
  tags: string[];
  initialSelectedTags?: string[];
  onSelectedTagsChange?: (selectedTags: string[]) => void;
  maxSelectableTags?: number; // Новое свойство для ограничения количества выбранных тегов
}

const CustomTagsSelector: React.FC<CustomTagsSelectorProps> = ({
  tags,
  initialSelectedTags = [],
  onSelectedTagsChange,
  maxSelectableTags
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);

  const handleTagPress = (index: number, tagLabel: string, event: any, deleted: boolean) => {
    if (!selectedTags.length) return;

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
    setSelectedTags(initialSelectedTags || []);
  }, [initialSelectedTags]);

  return (
    <View className='items-center pt-2'>
      <Tags
        initialTags={tags}
        readonly={true}
        onTagPress={handleTagPress}
        renderTag={({ tag, index, onPress }) => (
          selectedTags.length > 0 ? (
            <TouchableOpacity
              key={`${tag}-${index}`}
              className={`px-4 py-2 m-1 justify-between rounded-full ${selectedTags.includes(tag) ? 'bg-indigo-800' : 'bg-gray-300'}`}
              onPress={onPress}
            >
              <Text className={`${selectedTags.includes(tag) ? 'text-white' : 'text-black'} text-xs font-nunitoSansRegular`}>{tag}</Text>
            </TouchableOpacity>
          ) : (
            <View
              key={`${tag}-${index}`}
              className="px-4 py-2 m-1 justify-between rounded-full bg-purple-100 font-nunitoSansRegular"
            >
              <Text className="text-black text-sm font-nunitoSansRegular">{tag}</Text>
            </View>
          )
        )}
      />
    </View>
  );
};

export default CustomTagsSelector;

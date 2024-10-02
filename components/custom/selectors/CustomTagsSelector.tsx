import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Tags from 'react-native-tags';

interface CustomTagsSelectorProps {
  tags: string[];
  initialSelectedTags?: (string | number)[];
  onSelectedTagsChange?: (selectedTags: (string | number)[]) => void;
  maxSelectableTags?: number; // Ограничение на количество выбранных тегов
  readonlyMode?: boolean; // Новый пропс для режима отображения
  visibleTagsCount?: number;
}

const CustomTagsSelector: React.FC<CustomTagsSelectorProps> = ({
  tags,
  initialSelectedTags = [],
  onSelectedTagsChange,
  maxSelectableTags,
  readonlyMode = false, // По умолчанию компонент в режиме редактирования
  visibleTagsCount
}) => {
  const [selectedTags, setSelectedTags] = useState<(string | number)[]>(initialSelectedTags);
  const [showAll, setShowAll] = useState(false); // Состояние для отображения всех тегов
  const refTags = React.useRef<Tags>(null);

  // Определяем, является ли элемент индексом или строкой
  const isTagSelected = (tagLabel: string, index: number): boolean => {
    if(readonlyMode) return !selectedTags.includes(tagLabel);
    return selectedTags.includes(tagLabel) || selectedTags.includes(index);
  };

  const handleTagPress = (index: number, tagLabel: string) => {
    if (readonlyMode) return; // Если компонент в режиме отображения, отменяем выбор

    let updatedSelectedTags: (string | number)[];

    if (selectedTags.includes(tagLabel) || selectedTags.includes(index)) {
      updatedSelectedTags = selectedTags.filter(
        (selected) => selected !== tagLabel && selected !== index
      );
    } else {
      if (maxSelectableTags && selectedTags.length >= maxSelectableTags) {
        return; // Если достигнуто максимальное количество выбранных тегов, отменяем выбор
      }
      // Добавляем индекс или тег
      updatedSelectedTags = [...selectedTags, index];
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
  };

  // В режиме отображения выводим только выбранные теги
  const displayedTags = readonlyMode
    ? selectedTags.map((tag) => (typeof tag === 'number' ? tags[tag] : tag))
    : showAll || !visibleTagsCount
    ? tags
    : tags.slice(0, visibleTagsCount);

  return (
    <View className="items-center pt-2">
      <View>
        <Tags
          initialTags={displayedTags} // Показываем все или выбранные теги в зависимости от режима
          readonly={true} // Если режим отображения, теги нельзя нажимать
          onTagPress={(index, tag) => handleTagPress(index, tag)} // Обрабатываем нажатие по тегу и индексу
          ref={refTags}
          renderTag={({ tag, index, onPress }) => (
            <TouchableOpacity
              key={`${tag}-${index}`}
              className={`px-2 py-2 m-1 justify-between rounded-full ${
                isTagSelected(tag, index) ? ' bg-purple-100' : 'bg-white border border-indigo-700'
              }`}
              onPress={onPress}
            >
              <Text
                className={`${
                  isTagSelected(tag, index) ? 'text-black' : 'text-indigo-700'
                } text-xs font-nunitoSansBold`}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {/* Спойлер для показа всех тегов, если не в режиме readonly и если visibleTagsCount установлен */}
      {!readonlyMode && visibleTagsCount && tags.length > visibleTagsCount && (
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

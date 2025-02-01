// TagSelector.tsx
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import CustomSnackBar from '../alert/CustomSnackBar';
import CustomButtonWithIcon from '../buttons/CustomButtonWithIcon';
import i18n from '@/i18n';
import { MapPointType } from '@/dtos/enum/MapPointType';

// Определяем тип конфигурации для тега
type TagConfig = {
  iconName: string;
  iconSet: 'MaterialIcons' | 'FontAwesome' | 'Ionicons' | 'MaterialCommunityIcons' | 'SimpleLine';
  label: string;
};

// Маппинг по умолчанию для тегов
const defaultTagConfig: Record<number, TagConfig> = {
  [MapPointType.Walk]: {
    iconName: 'people-outline',
    iconSet: 'Ionicons',
    label: i18n.t('FilterSearchTags.walk'),
  },
  [MapPointType.Danger]: {
    iconName: 'alert-circle-outline',
    iconSet: 'Ionicons',
    label: i18n.t('FilterSearchTags.danger'),
  },
  [MapPointType.Park]: {
    iconName: 'leaf-outline',
    iconSet: 'Ionicons',
    label: i18n.t('FilterSearchTags.park'),
  },
  [MapPointType.Playground]: {
    iconName: 'basketball-outline',
    iconSet: 'Ionicons',
    label: i18n.t('FilterSearchTags.playground'),
  },
  [MapPointType.DogArea]: {
    iconName: 'select-place',
    iconSet: 'MaterialCommunityIcons',
    label: i18n.t('FilterSearchTags.zone'),
  },
  [MapPointType.Cafe]: {
    iconName: 'cafe-outline',
    iconSet: 'Ionicons',
    label: i18n.t('FilterSearchTags.cafe'),
  },
  [MapPointType.Restaurant]: {
    iconName: 'restaurant-outline',
    iconSet: 'Ionicons',
    label: i18n.t('FilterSearchTags.restaurant'),
  },
  [MapPointType.Veterinary]: {
    iconName: 'heart-outline',
    iconSet: 'Ionicons',
    label: i18n.t('FilterSearchTags.veterinary'),
  },
  [MapPointType.PetStore]: {
    iconName: 'storefront-outline',
    iconSet: 'Ionicons',
    label: i18n.t('FilterSearchTags.store'),
  },
  [MapPointType.Note]: {
    iconName: 'location-pin',
    iconSet: 'SimpleLine',
    label: i18n.t('FilterSearchTags.note'),
  },
};

// Базовые пропсы (всегда требуется передать, какие теги отображать)
interface BaseTagSelectorProps {
  displayTags: MapPointType[];
}

// Пропсы для зависимого режима (старое поведение)
interface DependentTagSelectorProps extends BaseTagSelectorProps {
  independent?: false;
  isTagSelected: boolean;
  snackbarVisible: boolean;
  setSnackbarVisible: (visible: boolean) => void;
  loadingTag: MapPointType | null;
  handleSelectTag: (tagName: string, type: MapPointType) => void;
}

// Пропсы для независимого режима (toggle)
interface IndependentTagSelectorProps extends BaseTagSelectorProps {
  independent: true;
  onToggleTag?: (selectedTags: MapPointType[]) => void;
}

// Объединённый тип пропсов
type TagSelectorProps = DependentTagSelectorProps | IndependentTagSelectorProps;

const SoloTagSelector: React.FC<TagSelectorProps> = (props) => {
  const { displayTags } = props;
  const isIndependent = props.independent === true;

  // Состояние для выбранных тегов в независимом режиме
  const [selectedTags, setSelectedTags] = useState<MapPointType[]>([]);

  // Если компонент НЕ независимый и тег уже выбран – отображаем SnackBar
  if (!isIndependent && props.isTagSelected) {
    return (
      <CustomSnackBar
        visible={props.snackbarVisible}
        setVisible={props.setSnackbarVisible}
      />
    );
  }

  // Функция переключения тега в независимом режиме
  const toggleTag = (tagType: MapPointType, tagLabel: string) => {
    let newSelected: MapPointType[];
    if (selectedTags.includes(tagType)) {
      // Если тег уже выбран, то снимаем выбор (можно вернуть пустой массив)
      newSelected = [];
    } else {
      // Если тег не выбран, то делаем его единственным выбранным
      newSelected = [tagType];
    }
    setSelectedTags(newSelected);
  
    // Если компонент независимый, вызываем onToggleTag
    if (isIndependent) {
      (props as IndependentTagSelectorProps).onToggleTag?.(newSelected);
    }
  };
  
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row space-x-2 px-1">
        {displayTags.map((tagType) => {
          const tagConfig = defaultTagConfig[tagType];
          if (!tagConfig) return null; // Если для тега нет конфигурации, пропускаем

          // Если независимый режим – работаем в режиме toggle
          if (isIndependent) {
            const isSelected = selectedTags.includes(tagType);
            return (
              <CustomButtonWithIcon
                key={tagType}
                iconName={tagConfig.iconName}
                iconSet={tagConfig.iconSet}
                onPress={() => toggleTag(tagType, tagConfig.label)}
                text={tagConfig.label}
                // В независимом режиме можно менять стиль в зависимости от выбранности
                buttonStyle={isSelected ? 'bg-violet-200' : 'bg-white'}
                // Если компонент CustomButtonWithIcon поддерживает проп "selected", можно передать его
                selected={isSelected}
              />
            );
          } else {
            // Если режим зависимый – используем переданные колбэки и loading-состояние
            return (
              <CustomButtonWithIcon
                key={tagType}
                iconName={tagConfig.iconName}
                iconSet={tagConfig.iconSet}
                onPress={() => props.handleSelectTag(tagConfig.label, tagType)}
                text={tagConfig.label}
                buttonStyle="bg-white"
                isLoading={props.loadingTag === tagType}
              />
            );
          }
        })}
      </View>
    </ScrollView>
  );
};

export default SoloTagSelector;

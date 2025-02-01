// TagSelector.tsx
import React from 'react';
import { ScrollView, View } from 'react-native';
import CustomSnackBar from '../alert/CustomSnackBar';
import CustomButtonWithIcon from '../buttons/CustomButtonWithIcon';
import i18n from '@/i18n';
import { MapPointType } from '@/dtos/enum/MapPointType';

interface TagSelectorProps {
  isTagSelected: boolean;
  snackbarVisible: boolean;
  setSnackbarVisible: (visible: boolean) => void;
  loadingTag: MapPointType | null;
  handleSelectTag: (tagName: string, type: MapPointType) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  isTagSelected,
  snackbarVisible,
  setSnackbarVisible,
  loadingTag,
  handleSelectTag,
}) => {
  if (isTagSelected) {
    return (
      <CustomSnackBar
        visible={snackbarVisible}
        setVisible={setSnackbarVisible}
      />
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row space-x-2 px-1">
        <CustomButtonWithIcon
          iconName="people-outline"
          iconSet="Ionicons"
          onPress={() =>
            handleSelectTag(i18n.t('FilterSearchTags.walk'), MapPointType.Walk)
          }
          text={i18n.t('FilterSearchTags.walk')}
          buttonStyle="bg-white"
          isLoading={loadingTag === MapPointType.Walk}
        />
        <CustomButtonWithIcon
          iconName="alert-circle-outline"
          iconSet="Ionicons"
          onPress={() =>
            handleSelectTag(i18n.t('FilterSearchTags.danger'), MapPointType.Danger)
          }
          text={i18n.t('FilterSearchTags.danger')}
          buttonStyle="bg-white"
          isLoading={loadingTag === MapPointType.Danger}
        />
        <CustomButtonWithIcon
          iconName="leaf-outline"
          iconSet="Ionicons"
          onPress={() =>
            handleSelectTag(i18n.t('FilterSearchTags.park'), MapPointType.Park)
          }
          text={i18n.t('FilterSearchTags.park')}
          buttonStyle="bg-white"
          isLoading={loadingTag === MapPointType.Park}
        />
        <CustomButtonWithIcon
          iconName="basketball-outline"
          iconSet="Ionicons"
          onPress={() =>
            handleSelectTag(
              i18n.t('FilterSearchTags.playground'),
              MapPointType.Playground
            )
          }
          text={i18n.t('FilterSearchTags.playground')}
          buttonStyle="bg-white"
          isLoading={loadingTag === MapPointType.Playground}
        />
        <CustomButtonWithIcon
          iconName="select-place"
          iconSet="MaterialCommunityIcons"
          onPress={() =>
            handleSelectTag(i18n.t('FilterSearchTags.zone'), MapPointType.DogArea)
          }
          text={i18n.t('FilterSearchTags.zone')}
          buttonStyle="bg-white"
          isLoading={loadingTag === MapPointType.DogArea}
        />
        <CustomButtonWithIcon
          iconName="cafe-outline"
          iconSet="Ionicons"
          onPress={() =>
            handleSelectTag(i18n.t('FilterSearchTags.cafe'), MapPointType.Cafe)
          }
          text={i18n.t('FilterSearchTags.cafe')}
          buttonStyle="bg-white"
          isLoading={loadingTag === MapPointType.Cafe}
        />
        <CustomButtonWithIcon
          iconName="restaurant-outline"
          iconSet="Ionicons"
          onPress={() =>
            handleSelectTag(
              i18n.t('FilterSearchTags.restaurant'),
              MapPointType.Restaurant
            )
          }
          text={i18n.t('FilterSearchTags.restaurant')}
          buttonStyle="bg-white"
          isLoading={loadingTag === MapPointType.Restaurant}
        />
        <CustomButtonWithIcon
          iconName="heart-outline"
          iconSet="Ionicons"
          onPress={() =>
            handleSelectTag(
              i18n.t('FilterSearchTags.veterinary'),
              MapPointType.Veterinary
            )
          }
          text={i18n.t('FilterSearchTags.veterinary')}
          buttonStyle="bg-white"
          isLoading={loadingTag === MapPointType.Veterinary}
        />
        <CustomButtonWithIcon
          iconName="storefront-outline"
          iconSet="Ionicons"
          onPress={() =>
            handleSelectTag(i18n.t('FilterSearchTags.store'), MapPointType.PetStore)
          }
          text={i18n.t('FilterSearchTags.store')}
          buttonStyle="bg-white"
          isLoading={loadingTag === MapPointType.PetStore}
        />
        <CustomButtonWithIcon
          iconName="location-pin"
          iconSet="SimpleLine"
          onPress={() =>
            handleSelectTag(i18n.t('FilterSearchTags.note'), MapPointType.Note)
          }
          text={i18n.t('FilterSearchTags.note')}
          buttonStyle="bg-white"
          isLoading={loadingTag === MapPointType.Note}
        />
      </View>
    </ScrollView>
  );
};

export default TagSelector;

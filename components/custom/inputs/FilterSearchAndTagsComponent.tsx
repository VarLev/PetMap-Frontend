import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { Searchbar } from 'react-native-paper';
import CustomButtonWithIcon from '../buttons/CustomButtonWithIcon';
import CustomBudgeButton from '../buttons/CustomBudgeButton';
import { MapPointType } from '@/dtos/enum/MapPointType';
import IconSelectorComponent from '../icons/IconSelectorComponent';
import { TouchableOpacity } from 'react-native-gesture-handler';
import uiStore from '@/stores/UIStore';
import i18n from '@/i18n';


interface SearchAndTagsProps {
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  onSearchTextChange: (text: string) => void;
  onTagSelected: (tag: number) => void;
  onOpenFilter: () => void;
  onOpenCardView: () => void;
  badgeCount: number;
}

const SearchAndTags: React.FC<SearchAndTagsProps> = ({
  selectedTag,
  setSelectedTag,
  onSearchTextChange,
  onTagSelected,
  onOpenFilter,
  onOpenCardView,
  badgeCount,
}) => {
  const [isTagSelected, setIsTagSelected] = useState(false);
  const [isCardView, setIsCardView] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const handleSelectTag = (name: string, type: number = 0) => {
    setSelectedTag(name);
    setIsTagSelected(true);
    onTagSelected(type);
    uiStore.setIsPointSearchFilterTagSelected(true);
  };

  const handleClearTag = () => {
    setSelectedTag('');
    setIsTagSelected(false);
    uiStore.setIsPointSearchFilterTagSelected(false);
  };

  const hadleOpenCardView = () => {
    setIsCardView(!isCardView);
    onOpenCardView();
  };

  useEffect(() => {
    setIsIOS(Platform.OS === 'ios');
  }, []);

  return (
    <View style={{ position: 'relative', top: 0, left: 0, right: 0, zIndex: 1 }}>
      <View
        className={`flex-row w-full ${isIOS ? 'pt-6' : 'pt-2'} px-2 justify-center items-center`}
      >
        <Searchbar
          onChangeText={onSearchTextChange}
          value={selectedTag}
          onClearIconPress={handleClearTag}
          elevation={1}
          style={{ backgroundColor: 'white' }}
          inputStyle={{
            color: 'black',
            fontFamily: 'NunitoSans_400Regular',
            padding: -10,
            alignSelf: 'center',
          }}
          className="flex-1 h-12"
        />
        <CustomBudgeButton
          iconSet="Ionicons"
          iconName="filter"
          badgeCount={badgeCount}
          onPress={onOpenFilter}
        />
        <TouchableOpacity onPress={hadleOpenCardView} activeOpacity={0.7}>
          <View
            className="bg-white justify-center items-center w-11 h-11 rounded-full"
            style={[styles.shadow, { elevation: 3 }]}
          >
            {isCardView ? (
              <IconSelectorComponent iconSet="Ionicons" iconName="map-outline" />
            ) : (
              <IconSelectorComponent iconSet="Ionicons" iconName="list-outline" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {!isTagSelected && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-2 px-1">
            <CustomButtonWithIcon
              iconName="people-outline"
              iconSet="Ionicons"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.walk'), MapPointType.Walk)}
              text={i18n.t('FilterSearchTags.walk')}
              buttonStyle="bg-white"
            />
            <CustomButtonWithIcon
              iconName="alert-circle-outline"
              iconSet="Ionicons"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.danger'), MapPointType.Danger)}
              text={i18n.t('FilterSearchTags.danger')}
              buttonStyle="bg-white"
            />
            <CustomButtonWithIcon
              iconName="leaf-outline"
              iconSet="Ionicons"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.park'), MapPointType.Park)}
              text={i18n.t('FilterSearchTags.park')}
              buttonStyle="bg-white"
            />
            <CustomButtonWithIcon
              iconName="basketball-outline"
              iconSet="Ionicons"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.playground'), MapPointType.Playground)}
              text={i18n.t('FilterSearchTags.playground')}
              buttonStyle="bg-white"
            />
            <CustomButtonWithIcon
              iconName="select-place"
              iconSet="MaterialCommunityIcons"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.zone'), MapPointType.DogArea)}
              text={i18n.t('FilterSearchTags.zone')}
              buttonStyle="bg-white"
            />
            <CustomButtonWithIcon
              iconName="cafe-outline"
              iconSet="Ionicons"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.cafe'), MapPointType.Cafe)}
              text={i18n.t('FilterSearchTags.cafe')}
              buttonStyle="bg-white"
            />
            <CustomButtonWithIcon
              iconName="restaurant-outline"
              iconSet="Ionicons"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.restaurant'), MapPointType.Restaurant)}
              text={i18n.t('FilterSearchTags.restaurant')}
              buttonStyle="bg-white"
            />
            <CustomButtonWithIcon
              iconName="heart-outline"
              iconSet="Ionicons"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.veterinary'), MapPointType.Veterinary)}
              text={i18n.t('FilterSearchTags.veterinary')}
              buttonStyle="bg-white"
            />
            <CustomButtonWithIcon
              iconName="storefront-outline"
              iconSet="Ionicons"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.store'), MapPointType.PetStore)}
              text={i18n.t('FilterSearchTags.store')}
              buttonStyle="bg-white"
            />
            <CustomButtonWithIcon
              iconName="location-pin"
              iconSet="SimpleLine"
              onPress={() => handleSelectTag(i18n.t('FilterSearchTags.note'), MapPointType.Note)}
              text={i18n.t('FilterSearchTags.note')}
              buttonStyle="bg-white"
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    elevation: 3,
  },
});

export default SearchAndTags;

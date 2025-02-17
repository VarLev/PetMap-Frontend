import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Checkbox, Divider, IconButton } from 'react-native-paper';
import CustomDropdownList from '../custom/selectors/CustomDropdownList';
import { observer } from 'mobx-react-lite';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';
import DistanceSlider from '../custom/sliders/DistanceSlider';
import { WalkAdvrtFilterParams } from '@/dtos/classes/filter/WalkAdvrtFilterParams';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import CustomButtonPrimary from '../custom/buttons/CustomButtonPrimary';
import mapStore from '@/stores/MapStore';
import i18n from '@/i18n';
import userStore from '@/stores/UserStore';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

interface FilterComponentProps {
  onFilterChange: (count: number) => void;
  onFilterApply: (filtrefCount: number) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = observer(
  ({ onFilterChange, onFilterApply }) => {
    const [filter, setFilter] = useState<WalkAdvrtFilterParams>(new WalkAdvrtFilterParams());
    const [temperament, setTemperament] = useState(0);
    const [friendly, setFriendly] = useState(0);
    const [activity, setActivity] = useState(0);

    useEffect(() => {
      const modifiedFieldsCount = countModifiedFields(filter);
      onFilterChange(modifiedFieldsCount);
    }, [filter, temperament, friendly, activity]);

    const handleFieldChange = (field: keyof WalkAdvrtFilterParams, value: any) => {
      setFilter((f) => ({ ...f, [field]: value }));
    };

    const countModifiedFields = (filter: WalkAdvrtFilterParams) => {
      let count = 0;
      if (filter.distance > 1) count++;
      if (filter.showFullMap) count++;
      if (filter.gender) count++;
      if (filter.language && filter.language.length > 0) count++;
      if (filter.interests && filter.interests.length > 0) count++;
      if (filter.petBreed) count++;
      if (filter.petGender) count++;
      if (friendly > 0) count++;
      if (temperament > 0) count++;
      if (activity > 0) count++;
      return count;
    };

    const handleSaveFilter = async () => {
      filter.latitude = mapStore.currentUserCoordinates[0];
      filter.longitude = mapStore.currentUserCoordinates[1];
      const filtrefCount = await mapStore.getFilteredWalks(filter);
      onFilterApply(filtrefCount);
    };

    const handleResetFilter = () => {
      setFilter(new WalkAdvrtFilterParams());
      setFriendly(0);
      setTemperament(0);
      setActivity(0);
    };

    const handleTimeChange = (time: number[]) => {
      setFilter((ftr) => ({ ...ftr, startTime: time[0], endTime: time[1] }));
    };

    const formItems = [
      {
        id: '1',
        component: (
          <View className="pt-6 px-4">
            <Text className="text-base font-bold text-indigo-700 mb-2">
              {i18n.t('filters.general')}
            </Text>
            <View className="-ml-2 flex-row items-center">
              {!userStore.getUserHasSubscription() && (
                <IconButton
                  size={20}
                  icon={() => <FontAwesome name="diamond" size={20} color="#8F00FF" />}
                  onPress={() => router.push('/(paywall)/pay')}
                />
              )}

              <Checkbox.Android
                color="blue"
                uncheckedColor="gray"
                status={filter.showFullMap ? 'checked' : 'unchecked'}
                onPress={() => handleFieldChange('showFullMap', !filter.showFullMap)}
                disabled={!userStore.getUserHasSubscription()}
              />
              <Text className="text-base font-nunitoSansRegular">
                {i18n.t('filters.showAllOptions')}
              </Text>
            </View>
            <DistanceSlider
              distance={filter.distance}
              onDistanceChange={(d) => handleFieldChange('distance', d[0])}
            />

            <Divider className="mt-6" />
          </View>
        ),
      },
      {
        id: '2',
        component: (
          <View className="px-4 pt-4">
            <Text className="text-base font-bold text-indigo-700 mb-2">
              {i18n.t('filters.petOwner')}
            </Text>
            <CustomDropdownList
              tags={i18n.t('tags.gender') as string[]}
              placeholder={i18n.t('filters.gender')}
              initialSelectedTag={filter.gender || ''}
              onChange={(selectedGender) =>
                handleFieldChange('gender', selectedGender)
              }
            />
            <View className="pt-4">
              <Text className="text-sm font-bold text-gray-400 mb-1">
                {i18n.t('filters.interests')}
              </Text>
              <CustomTagsSelector
                tags={i18n.t('tags.interests') as string[]}
                initialSelectedTags={filter.interests || []}
                onSelectedTagsChange={(interests) =>
                  handleFieldChange('interests', interests)
                }
                maxSelectableTags={5}
                visibleTagsCount={10}
              />
            </View>
            <Divider className="mt-6" />
          </View>
        ),
      },
      {
        id: '3',
        component: (
          <View className="px-4 pt-4">
            <Text className="text-base font-bold text-indigo-700 mb-2">
              {i18n.t('filters.pet')}
            </Text>
            <CustomDropdownList
              tags={i18n.t('tags.breedsDog') as string[]}
              label=""
              placeholder={i18n.t('filters.breed')}
              initialSelectedTag={filter.petBreed || ''}
              onChange={(text) => handleFieldChange('petBreed', text)}
              searchable={true}
              listMode="MODAL"
            />
            <CustomDropdownList
              tags={i18n.t('tags.petGender') as string[]}
              label=""
              placeholder={i18n.t('filters.gender')}
              initialSelectedTag={filter.petGender || ''}
              onChange={(selectedGender) =>
                handleFieldChange('petGender', selectedGender)
              }
            />
            <View className="pt-4">
              <Text className="text-sm font-bold text-gray-400 mb-1">
                {i18n.t('filters.interests')}
              </Text>
              <CustomTagsSelector
                tags={i18n.t('tags.petGames') as string[]}
                initialSelectedTags={filter.petInterests || []}
                onSelectedTagsChange={(interests) =>
                  handleFieldChange('petInterests', interests)
                }
                maxSelectableTags={5}
                visibleTagsCount={10}
              />
            </View>
            <Divider className="mt-6" />
            {/* Дополнительный контент можно добавить здесь */}
          </View>
        ),
      },
    ];

    return (
      <View className="flex-1">
        <FlatList
          data={formItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <View>{item.component}</View>}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
        <View className="absolute bottom-0 left-0 right-0 p-0 px-4 bg-white">
          <CustomButtonPrimary
            title={i18n.t('filters.apply')}
            handlePress={handleSaveFilter}
            containerStyles="mt-5"
          />
          <CustomButtonOutlined
            title={i18n.t('filters.reset')}
            handlePress={handleResetFilter}
          />
        </View>
      </View>
    );
  }
);

export default FilterComponent;

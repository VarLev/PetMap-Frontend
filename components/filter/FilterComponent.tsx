import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Checkbox, Divider } from 'react-native-paper';
import CustomDropdownList from '../custom/selectors/CustomDropdownList';
import { observer } from 'mobx-react-lite';
import StarRating from 'react-native-star-rating-widget';
import { BREEDS_TAGS, DOGGAMES_TAGS, GENDERS_TAGS, INTEREST_TAGS } from '@/constants/Strings';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';
import { FlatList } from 'react-native';
import TimeSlider from '../custom/sliders/TimeSlider';
import DistanceSlider from '../custom/sliders/DistanceSlider';
import { WalkAdvrtFilterParams } from '@/dtos/classes/filter/WalkAdvrtFilterParams';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import CustomButtonPrimary from '../custom/buttons/CustomButtonPrimary';
import mapStore from '@/stores/MapStore';

interface FilterComponentProps {
  onFilterChange: (count: number) => void;  // Пропс для передачи количества измененных полей
  onFilterApply: () => void;  // Пропс для передачи фильтра
}

const FilterComponent:React.FC<FilterComponentProps> = observer(({ onFilterChange, onFilterApply }) => {
  const [filter, setFilter] = useState<WalkAdvrtFilterParams>(new WalkAdvrtFilterParams());
  const [temperament, setTemperament] = useState(0);
  const [friendly, setFriendly] = useState(0);
  const [activity, setActivity] = useState(0);
  const [isAvaliableNowChecked, setIsAvaliableNowChecked] = React.useState(false);

  useEffect(() => {
    // Подсчет измененных полей после каждого изменения состояния
    const modifiedFieldsCount = countModifiedFields(filter);
    onFilterChange(modifiedFieldsCount);
  }, [filter, temperament, friendly, activity]);  // Добавляем зависимости для отслеживания

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

  const handleTemperament = (rating: number) => {
    setTemperament(rating);
    setFilter((ftr) => ({ ...ftr, temperament: rating }));
  }

  const handleFriendly = (rating: number) => {
    setFriendly(rating);
    setFilter((ftr) => ({ ...ftr, friendliness: rating }));
  }

  const handleActivity = (rating: number) => {
    setActivity(rating);
    setFilter((ftr) => ({ ...ftr, activityLevel: rating }));
  }

  const handleSaveFilter = async () => {
    filter.latitude = mapStore.currentUserCoordinates[0];
    filter.longitude = mapStore.currentUserCoordinates[1];
    await mapStore.getFilteredWalks(filter);
    onFilterApply();
  }

  const handleResetFilter = () => {
    setFilter(new WalkAdvrtFilterParams());
    setFriendly(0);
    setTemperament(0);
    setActivity(0);
  }

  const handleTimeChange = (time: number[]) => {
    setFilter((ftr) => ({ ...ftr, startTime: time[0], endTime: time[1] }));
  }

  // Данные для FlatList
  const formItems = [
    {
      id: '1',
      component: (
        <View className='pt-10 px-4'>
          <Text className="-mb-1 text-base font-nunitoSansBold text-indigo-700">Общие</Text>
          <DistanceSlider distance={filter.distance} onDistanceChange={(d) => handleFieldChange('distance', d[0])} />
          <View className="pt-4  flex-row items-center">
          <Checkbox.Android 
              color="blue"    
              uncheckedColor="gray"      
              status={filter.showFullMap ? 'checked' : 'unchecked'}
              onPress={() => handleFieldChange('showFullMap', !filter.showFullMap)}
            />
            <Text className='text-base font-nunitoSansRegular'>Все варианты</Text>
          </View>
          <TimeSlider startTime={filter.startTime || 0} endTime={filter.endTime || 1440 } onTimeChange={handleTimeChange}  />
          <View className="pt-4  flex-row items-center">
            <Checkbox.Android
              color='blue'
               uncheckedColor="gray"
              status={filter.showFullMap ? 'checked' : 'unchecked'}
              onPress={() => handleFieldChange('showFullMap', !filter.showFullMap)}
            />
            <Text className='text-base font-nunitoSansRegular'>Доступные сейчас</Text>
          </View>
         
          <Divider className="mt-6" />
        </View>
      ),
    },
    {
      id: '2',
      component: (
        <View className='px-4'>
          <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">
            Владелец питомца
          </Text>
          <CustomDropdownList
            tags={GENDERS_TAGS}
            label=""
            placeholder="Пол"
            initialSelectedTag={filter.gender || ''}
            onChange={(selectedGender) => handleFieldChange('gender', selectedGender)}
          />
          {/* <MultiTagDropdown tags={LANGUAGE_TAGS} initialSelectedTags={filter.language || []} placeholder="Языки" onChange={(selectedLanguage) => handleFieldChange('language', selectedLanguage)} /> */}
          <View className="pt-4">
            <Text className="text-sm font-nunitoSansBold text-gray-400">Интересы</Text>
            <CustomTagsSelector
              tags={INTEREST_TAGS}
              initialSelectedTags={filter.interests || []}
              onSelectedTagsChange={(interests) => handleFieldChange('interests', interests)}
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
        <View className='px-4 z-10'>
          <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">Питомец</Text>
          <CustomDropdownList
            tags={BREEDS_TAGS}
            label=""
            placeholder="Порода"
            initialSelectedTag={filter.petBreed || ''}
            onChange={(text) => handleFieldChange('petBreed', text)}
            searchable={true}
          />
          <CustomDropdownList
            tags={GENDERS_TAGS}
            label=""
            placeholder="Пол"
            initialSelectedTag={filter.petGender || ''}
            onChange={(selectedGender) => handleFieldChange('petGender', selectedGender)}
          />
          <View className="pt-4">
            <Text className="text-sm font-nunitoSansBold text-gray-400">Интересы</Text>
            <CustomTagsSelector
              tags={DOGGAMES_TAGS}
              initialSelectedTags={filter.petInterests || []}
              onSelectedTagsChange={(interests) => handleFieldChange('petInterests', interests)}
              maxSelectableTags={5}
              visibleTagsCount={10}
            />
          </View>
          
          <View>
            <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">
              Показатели
            </Text>
            <View className="pt-2 flex-row justify-between">
              <Text className="font-nunitoSansRegular text-base">Темперамент</Text>
              <StarRating rating={temperament} starSize={25} color="#BFA8FF" onChange={handleTemperament} />
            </View>
            <View className="pt-2 flex-row justify-between">
              <Text className="font-nunitoSansRegular text-base">Дружелюбность</Text>
              <StarRating rating={friendly} starSize={25} color="#BFA8FF" onChange={handleFriendly} />
            </View>
            <View className="pt-2 flex-row justify-between">
              <Text className="font-nunitoSansRegular text-base">Активность</Text>
              <StarRating rating={activity} starSize={25} color="#BFA8FF" onChange={handleActivity} />
            </View>
            <Divider className="mt-3" />
          </View>
          <View className=' z-0'>
            <CustomButtonPrimary title='Применить' handlePress={handleSaveFilter} containerStyles='mt-5'/>
            
            <CustomButtonOutlined title='Сбросить' handlePress={handleResetFilter}/>
          <View className="h-10" />
          </View>
        </View>
      ),
    }
   
  ];

  // Используем FlatList для виртуализированных списков
  return (
    <FlatList
      data={formItems}
      className='p-2'
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <View>{item.component}</View>}
    />
  );
});

export default FilterComponent;

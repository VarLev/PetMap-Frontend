import React from 'react';
import { View, ScrollView } from 'react-native';
import { Searchbar } from 'react-native-paper';
import CustomButtonWithIcon from '../buttons/CustomButtonWithIcon';
import CustomBudgeButton from '../buttons/CustomBudgeButton';
import { MapPointType } from '@/dtos/enum/MapPointType';
 // Предполагаем, что кастомная кнопка находится в этом файле

interface SearchAndTagsProps {
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  onSearchTextChange: (text: string) => void;
  onTagSelected: (tag: number) => void;
  onOpenFilter: () => void;
  badgeCount: number;
}

const SearchAndTags: React.FC<SearchAndTagsProps> = ({
  selectedTag,
  setSelectedTag,
  onSearchTextChange,
  onTagSelected,
  onOpenFilter,
  badgeCount 
}) => {

  const[isTagSelected, setIsTagSelected] = React.useState(false);

  const handleSelectTag = (name: string, type: number = 0) => {
    setSelectedTag(name);
    setIsTagSelected(true);
    onTagSelected(type);
  }

  const handleClearTag = () => {
    setSelectedTag('');
    setIsTagSelected(false);
  }


  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0}}>
      <View className='flex-row w-full pt-3 px-3 justify-center items-center'>
        <Searchbar
          placeholder="Search"
          onChangeText={onSearchTextChange}
          value={selectedTag}
          onClearIconPress={handleClearTag}
          elevation={1}
          style={{ backgroundColor: 'white', height: 45 }}
          inputStyle={{ color: 'black', fontFamily: 'NunitoSans_400Regular' }}
          className='flex-1'
        />
          <CustomBudgeButton iconSet={'Ionicons'} iconName={'filter'} badgeCount={badgeCount} onPress={onOpenFilter}/>
      </View>
      
      {!isTagSelected && ( 
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View className='flex-row space-x-2 px-2'>
            <CustomButtonWithIcon
              iconName='people-outline'
              iconSet='Ionicons'
              onPress={() => handleSelectTag('Прогулка', MapPointType.Walk)}
              text={'Прогулка'}
              buttonStyle='bg-white'
            />
            <CustomButtonWithIcon
              iconName='tree-outline'
              iconSet='MaterialCommunityIcons'
              onPress={() => handleSelectTag('Парк', MapPointType.Park)}
              text={'Парк'}
              buttonStyle='bg-white'
            />
            <CustomButtonWithIcon
              iconName='basketball-outline'
              iconSet='Ionicons'
              onPress={() => handleSelectTag('Площадка', 3)}
              text={'Площадки'}
              buttonStyle='bg-white'
            />
            <CustomButtonWithIcon
              iconName='people-outline'
              onPress={() => handleSelectTag('Опасность', MapPointType.Danger)}
              text={'Опасность'}
              buttonStyle='bg-white'
            />
            <CustomButtonWithIcon
              iconName='people-outline'
              onPress={() => handleSelectTag('Заметка', MapPointType.Note)}
              text={'Заметка'}
              buttonStyle='bg-white'
            />
          </View>
        </ScrollView>
      )}
     
    </View>
  );
};

export default SearchAndTags;

import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { MapPointType } from '@/dtos/enum/MapPointType';
import MyMapItemList from '@/components/navigation/points/MyMapItemList';
import { View } from 'react-native';
import SoloTagSelector from '@/components/custom/inputs/SoloTagSelector';

const MyMarkers = observer(() => {

  const [selectedTag, setSelectedTag] = useState<MapPointType>(MapPointType.Danger);

  return (
    <View className='pt-2'>
      <SoloTagSelector
        independent={true}
        onToggleTag={(selectedTags) => {
          setSelectedTag(selectedTags[0]);
        }}
        displayTags={[MapPointType.Danger, MapPointType.Park, MapPointType.Playground, MapPointType.DogArea, MapPointType.Cafe, MapPointType.Restaurant, MapPointType.Veterinary, MapPointType.PetStore, MapPointType.Note ]} // Add the required displayTags property
      />
      <View className='-mt-3'>
        <MyMapItemList renderType={selectedTag} />
      </View>
    </View>
    
  );
});

export default MyMarkers;
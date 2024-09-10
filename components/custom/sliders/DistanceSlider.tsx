import React from 'react';
import { View, Text } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

type DistanceSliderProps = {
  distance: number;
  onDistanceChange: (value: number[]) => void;
};

const DistanceSlider: React.FC<DistanceSliderProps> = ({ distance, onDistanceChange }) => {
  const formatDistance = (value: number) => {
    return `${value.toFixed(1)} км`;
  };

  return (
    <View className="pt-2">
      <Text className="text-sm font-nunitoSansRegular text-gray-400">Дистанция:</Text>
      <View className="w-full px-2">
        <MultiSlider
          values={[distance]} // Текущее значение дистанции, передаваемое от родителя
          onValuesChange={onDistanceChange} // Передаем изменения обратно родителю
          min={1}
          max={5}
          step={0.5}
          sliderLength={290}
          markerStyle={{
            backgroundColor: '#3F00FF',
            height: 20,
            width: 20,
          }}
          selectedStyle={{
            backgroundColor: '#3F00FF',
          }}
          unselectedStyle={{
            backgroundColor: '#D3BFFF',
          }}
        />
      </View>

      <View className="flex-row justify-between">
        <Text className="text-base text-gray-600 font-nunitoSansRegular">{formatDistance(1)}</Text>
        <Text className="text-base text-gray-600 font-nunitoSansRegular">{formatDistance(5)}</Text>
      </View>

      <View className="flex-row justify-center">
        <Text className="text-base text-gray-800 font-nunitoSansRegular">
          Текущая дистанция: {formatDistance(distance)}
        </Text>
      </View>
    </View>
  );
};

export default DistanceSlider;

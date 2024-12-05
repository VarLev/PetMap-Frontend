import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import i18n from '@/i18n';

type DistanceSliderProps = {
  distance: number;
  onDistanceChange: (value: number[]) => void;
};

const DistanceSlider: React.FC<DistanceSliderProps> = ({ distance, onDistanceChange }) => {
  const screenWidth = Dimensions.get('window').width; // Динамическая ширина экрана

  const formatDistance = (value: number) => {
    return `${value.toFixed(1)} ${i18n.t('distanceSlider.km')}`;
  };

  return (
    <View className="pt-2">
      <Text className="text-sm font-nunitoSansRegular text-gray-400">
        {i18n.t('distanceSlider.label')}:
      </Text>
      <View className="w-full px-2">
        <MultiSlider
          values={[distance]} // Текущее значение дистанции
          onValuesChange={(values) => onDistanceChange(values)} // Передаем изменения родителю
          min={1}
          max={5}
          step={0.5}
          sliderLength={screenWidth-110} // Динамическая длина слайдера
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
        <Text className="text-base text-gray-600 font-nunitoSansRegular">
          {formatDistance(1)}
        </Text>
        <Text className="text-base text-gray-600 font-nunitoSansRegular">
          {formatDistance(5)}
        </Text>
      </View>

      <View className="flex-row justify-center">
        <Text className="text-base text-gray-800 font-nunitoSansRegular">
          {i18n.t('distanceSlider.current')}: {formatDistance(distance)}
        </Text>
      </View>
    </View>
  );
};

export default DistanceSlider;
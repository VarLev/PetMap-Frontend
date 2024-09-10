import React, { useState } from 'react';
import { View, Text } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

type TimeSliderProps = {
  startTime: number;
  endTime: number;
  onTimeChange: (value: number[]) => void;
};

const TimeSlider: React.FC<TimeSliderProps> = ({startTime, endTime, onTimeChange}) => {
  const [sliderValues, setSliderValues] = useState([0, 1440]); // Значения от 0 до 1440 (минуты в сутки)

  const handleValuesChange = (values: number[]) => {
    setSliderValues(values);
    onTimeChange(values);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  return (
    <View className="w-full">
      <Text className="pt-2 text-sm font-nunitoSansRegular text-gray-400">Время:</Text>
      <View className="w-full px-2">
      <MultiSlider
        values={[startTime, endTime]}
        onValuesChange={handleValuesChange}
        min={350}
        max={1380}
        step={10}
        sliderLength={290}
        markerStyle={{
          backgroundColor: '#3F00FF', height:20, width:20 // Цвет маркеров
        }}
        selectedStyle={{
          backgroundColor: '#3F00FF', // Цвет выбранного диапазона
        }}
        unselectedStyle={{
          backgroundColor: '#D3BFFF', // Цвет невыбранного диапазона
        }}
      />
      </View>
      <View className="flex-row justify-between">
        <Text className="text-base font-nunitoSansRegular text-gray-600">{formatTime(sliderValues[0])}</Text>
        <Text className="text-base font-nunitoSansRegular text-gray-600">{formatTime(sliderValues[1])}</Text>
      </View>
    </View>
  );
};

export default TimeSlider;

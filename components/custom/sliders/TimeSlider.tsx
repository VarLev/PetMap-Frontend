import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import i18n from '@/i18n';

type TimeSliderProps = {
  startTime: number;
  endTime: number;
  onTimeChange: (value: number[]) => void;
};

const TimeSlider: React.FC<TimeSliderProps> = ({ startTime, endTime, onTimeChange }) => {
  const [sliderValues, setSliderValues] = useState([startTime, endTime]); // Начальные значения

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    setSliderValues([startTime, endTime]); // Синхронизация значений при изменении пропсов
  }, [startTime, endTime]);

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
      <Text className="pt-2 text-sm font-nunitoSansRegular text-gray-400">
        {i18n.t('timeSlider.label')}:
      </Text>
      <View className="w-full px-2">
        <MultiSlider
          values={sliderValues}
          onValuesChange={handleValuesChange}
          min={350} // Начало диапазона (5:50)
          max={1380} // Конец диапазона (23:00)
          step={10} // Шаг изменения в минутах
          sliderLength={screenWidth - 110} // Динамическая длина
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
        <Text className="text-base font-nunitoSansRegular text-gray-600">
          {formatTime(sliderValues[0])}
        </Text>
        <Text className="text-base font-nunitoSansRegular text-gray-600">
          {formatTime(sliderValues[1])}
        </Text>
      </View>
    </View>
  );
};

export default TimeSlider;
import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BG_COLORS } from '@/constants/Colors';
import i18n from '@/i18n';

interface DateOrTimeRangePickerProps {
  time?: Date;
  duration?: number;
  onTimeChange?: (time: Date) => void;
  onDurationChange?: (duration: number) => void;
  date?: Date;
  onDateChange?: (date: Date) => void;
  mode: 'time' | 'date';
}

const DateOrTimeRangePicker: React.FC<DateOrTimeRangePickerProps> = ({
  time,
  duration,
  onTimeChange,
  onDurationChange,
  date,
  onDateChange,
  mode,
}) => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerDate, setPickerDate] = useState(
    mode === 'time' && time ? time : date ? date : new Date()
  );

  const showPicker = () => {
    setPickerDate(mode === 'time' && time ? time : date ? date : new Date());
    setPickerVisible(true);
  };

  const handleConfirm = (event: any, selectedDate?: Date) => {
    if (event?.type === 'dismissed' || !selectedDate) {
      setPickerVisible(false);
      return;
    }
    if (mode === 'time' && onTimeChange) {
      onTimeChange(selectedDate);
    } else if (mode === 'date' && onDateChange) {
      onDateChange(selectedDate);
    }
    setPickerVisible(false);
  };

  return (
    <View className="flex-col w-full space-y-4">
      {mode === 'time' && (
        <View className="flex-row w-full items-center space-x-4">
          <TextInput
            mode="outlined"
            label={i18n.t('dateOrTimePicker.timeLabel')}
            value={
              time
                ? `${time.getHours()}:${time.getMinutes() < 10 ? '0' : ''}${time.getMinutes()} - ${duration} ${i18n.t(
                    'dateOrTimePicker.minutes'
                  )}`
                : ''
            }
            editable={false}
            right={
              <TextInput.Icon
                icon="calendar-clock"
                onPress={showPicker}
                color={'white'}
                style={{ backgroundColor: BG_COLORS.indigo[800] }}
              />
            }
            className="flex-[2] bg-white"
            theme={{ roundness: 7 }}
            contentStyle={{ color: '#363636', fontFamily: 'NunitoSans_400Regular' }}
          />
          <TextInput
            mode="outlined"
            label={i18n.t('dateOrTimePicker.durationLabel')}
            value={duration?.toString() || ''}
            keyboardType="numeric"
            onChangeText={(text) => onDurationChange && onDurationChange(Number(text))}
            className="flex-[1] bg-white"
            theme={{ roundness: 7 }}
            contentStyle={{ color: '#363636', fontFamily: 'NunitoSans_400Regular' }}
          />
        </View>
      )}
      {mode === 'date' && (
        <TextInput
          mode="outlined"
          label={i18n.t('dateOrTimePicker.dateLabel')}
          value={
            date
              ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
              : ''
          }
          editable={false}
          right={
            <TextInput.Icon
              icon="calendar"
              onPress={showPicker}
              color={'white'}
              style={{ backgroundColor: BG_COLORS.indigo[800] }}
            />
          }
          className="w-full bg-white"
          theme={{ roundness: 7 }}
          contentStyle={{ color: '#363636', fontFamily: 'NunitoSans_400Regular' }}
        />
      )}
      {isPickerVisible && (
        <DateTimePicker
          value={pickerDate}
          mode={mode}
          display="default"
          onChange={handleConfirm}
        />
      )}
    </View>
  );
};

export default DateOrTimeRangePicker;
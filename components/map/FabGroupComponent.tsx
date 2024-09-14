import React, { useState } from 'react';
import { Portal, FAB } from 'react-native-paper';
import IconSelectorComponent from '../custom/icons/IconSelectorComponent'; // Ваш компонент для отображения иконок
import { MapPointType } from '@/dtos/enum/MapPointType';
import { BG_COLORS } from '@/constants/Colors';

interface FabGroupProps {
  selectedNumber: number;
  setSelectedNumber: (number: number) => void;
}

const FabGroupComponent: React.FC<FabGroupProps> = ({ selectedNumber, setSelectedNumber }) => {
  const [fabOpen, setFabOpen] = useState(false);
  const [fabIcon, setFabIcon] = useState(
    <IconSelectorComponent
      iconName='plus'
      iconSet='MaterialCommunityIcons'
      size={24}
      color='white'
    />
  ); // Иконка FAB
  

  const handleIconChange = (
    iconName: string,
    iconSet: 'MaterialIcons' | 'FontAwesome' | 'Ionicons' | 'MaterialCommunityIcons'
  ) => {
    setFabIcon(
      <IconSelectorComponent
        iconName={iconName}
        iconSet={iconSet}
        size={24}
        color='white'
      />
    ); // Изменяем иконку FAB
  };

  const handleActionPress = (action: MapPointType) => {
    setSelectedNumber(action);
    console.log(`Pressed ${action}`);
  };

  return (
    <Portal>
      <FAB.Group
        style={{ paddingBottom: 90 }}
        open={fabOpen}
        visible={true}
        icon={fabOpen ? 'close' : () => fabIcon} // Используем кастомную иконку или иконку "close" при открытии
        color='white'
        backdropColor='rgba(47, 30, 150, 0.9)'
        fabStyle={{
          backgroundColor: '#2F00B6',
          borderColor: 'white',
          borderWidth: 5,
        }}
        theme={{
          colors: { backdrop: 'black', text: 'black' },
          roundness: 10,
        }}
        actions={[
          {
            icon: () => (
              <IconSelectorComponent
                iconName='people-outline'
                iconSet='Ionicons'
                size={24}
                color='white'
              />
            ),
            label: 'Прогулка',
            color: 'white',
            labelTextColor: 'white',
            labelStyle: { fontFamily: 'NunitoSans_700Bold' },
            onPress: () => {
              handleIconChange('people-outline', 'Ionicons'); // Изменяем иконку FAB
              handleActionPress(MapPointType.Walk); // Обновляем число
            },
            style: { backgroundColor: '#9076ea' },
          },
          {
            icon: () => (
              <IconSelectorComponent
                iconName='alert-octagram-outline'
                iconSet='MaterialCommunityIcons'
                size={24}
                color='white'
              />
            ),
            label: 'Опасность',
            labelTextColor: 'white',
            labelStyle: { fontFamily: 'NunitoSans_700Bold' },
            onPress: () => {
              handleIconChange(
                'alert-octagram-outline',
                'MaterialCommunityIcons'
              ); // Изменяем иконку FAB
              handleActionPress(MapPointType.Danger); // Обновляем число
            },
            style: { backgroundColor: `${BG_COLORS.rose[500]}` },
          },
          {
            icon: () => (
              <IconSelectorComponent
                iconName='note-alert-outline'
                iconSet='MaterialCommunityIcons'
                size={24}
                color='white'
              />
            ),
            label: 'Предложить метку',
            labelTextColor: 'white',
            labelStyle: { fontFamily: 'NunitoSans_700Bold' },
            onPress: () => {
              handleIconChange(
                'note-alert-outline',
                'MaterialCommunityIcons'
              ); // Изменяем иконку FAB
              handleActionPress(MapPointType.Playground); // Обновляем число
            },
            style: { backgroundColor: '#9076ea' },
          },
          {
            icon: () => (
              <IconSelectorComponent
                iconName='note-plus-outline'
                iconSet='MaterialCommunityIcons'
                size={24}
                color='white'
              />
            ),
            label: 'Моя метка',
            labelTextColor: 'white',
            labelStyle: { fontFamily: 'NunitoSans_700Bold' },
            onPress: () => {
              handleIconChange(
                'note-plus-outline',
                'MaterialCommunityIcons'
              ); // Изменяем иконку FAB
              handleActionPress(MapPointType.Note); // Обновляем число
            },
            style: { backgroundColor: '#9076ea' },
          },
        ]}
        onStateChange={({ open }) => setFabOpen(open)}
      />
    </Portal>
  );
};


export default FabGroupComponent;

import React, { useState } from 'react';
import { Portal, FAB } from 'react-native-paper';
import IconSelectorComponent from '../custom/icons/IconSelectorComponent'; // Ваш компонент для отображения иконок
import { MapPointType } from '@/dtos/enum/MapPointType';
import { BG_COLORS } from '@/constants/Colors';
import i18n from '@/i18n';

interface FabGroupProps {
  selectedNumber: number;
  setSelectedNumber: (number: number) => void;
  isVisible: boolean;
}

const FabGroupComponent: React.FC<FabGroupProps> = ({ selectedNumber, setSelectedNumber, isVisible }) => {
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
    iconSet: 'MaterialIcons' | 'FontAwesome' | 'Ionicons' | 'MaterialCommunityIcons' | 'SimpleLine'
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
        visible={isVisible}
        icon={fabOpen ? 'close' : () => fabIcon} // Используем кастомную иконку или иконку "close" при открытии
        color='white'
        backdropColor='rgba(0, 0, 0, 0.7)'
        fabStyle={{
          backgroundColor: '#2F00B6',
          borderColor: 'white',
          borderWidth: 4,
        }}
        theme={{
          colors: { backdrop: 'black', text: 'black' },
          roundness: 10,
        }}
        actions={[
          {
            icon: () => (
              <IconSelectorComponent
                iconName="people-outline"
                iconSet="Ionicons"
                size={24}
                color="white"
              />
            ),
            label: i18n.t("FabGroup.walk"),
            color: "white",
            labelTextColor: "white",
            labelStyle: { fontFamily: "NunitoSans_700Bold" },
            onPress: () => {
              handleIconChange("people-outline", "Ionicons"); // Изменяем иконку FAB
              handleActionPress(MapPointType.Walk); // Обновляем число
            },
            style: { backgroundColor: "#9076ea" },
          },
          {
            icon: () => (
              <IconSelectorComponent
                iconName="alert-circle-outline"
                iconSet="MaterialCommunityIcons"
                size={24}
                color="white"
              />
            ),
            label: i18n.t("FabGroup.danger"),
            labelTextColor: "white",
            labelStyle: { fontFamily: "NunitoSans_700Bold" },
            onPress: () => {
              handleIconChange("alert-octagram-outline", "MaterialCommunityIcons");
              handleActionPress(MapPointType.Danger);
            },
            style: { backgroundColor: `${BG_COLORS.indigo[700]}` },
          },
          {
            icon: () => (
              <IconSelectorComponent
                iconName="note-alert-outline"
                iconSet="MaterialCommunityIcons"
                size={24}
                color="white"
              />
            ),
            label: i18n.t("FabGroup.proposeMarker"),
            labelTextColor: "white",
            labelStyle: { fontFamily: "NunitoSans_700Bold" },
            onPress: () => {
              handleIconChange("note-alert-outline", "MaterialCommunityIcons");
              handleActionPress(MapPointType.UsersCustomPoint);
            },
            style: { backgroundColor: `${BG_COLORS.indigo[700]}` },
          },
          {
            icon: () => (
              <IconSelectorComponent
                iconName="location-pin"
                iconSet="SimpleLine"
                size={24}
                color="white"
              />
            ),
            label: i18n.t("FabGroup.myNote"),
            labelTextColor: "white",
            labelStyle: { fontFamily: "NunitoSans_700Bold" },
            onPress: () => {
              handleIconChange("location-pin", "SimpleLine");
              handleActionPress(MapPointType.Note);
            },
            style: { backgroundColor: `${BG_COLORS.indigo[700]}` },
          },
        ]}
        onStateChange={({ open }) => setFabOpen(open)}
      />
    </Portal>
  );
};


export default FabGroupComponent;

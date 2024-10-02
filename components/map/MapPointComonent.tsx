import React from 'react';
import { View, Text, ScrollView, Linking, Alert } from 'react-native';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import { Button } from 'react-native-paper';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';

// Обобщенный интерфейс для типа mapPoint, где T - тип, наследующий родительский интерфейс
interface MapPointProps<T> {
  onInvite: (uid: IUser) => void;
  onClose: () => void;
  mapPoint: T; // Обобщенный тип для точки
}

// Указываем, что компонент принимает любой тип, унаследованный от базовой точки
const MapPointComonent = <T extends { id: string; latitude: number; longitude: number; createdAt: string }>({
  mapPoint,
  onInvite,
  onClose,
}: MapPointProps<T>) => {


  const handleOpenMap = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapPoint?.latitude + ',' + mapPoint?.longitude || 'Unknown Location'
    )}`;

    // Проверка, может ли устройство открыть URL
    Linking.openURL(mapUrl).catch((err) => {
      Alert.alert('Ошибка', 'Не удается открыть карту.');
      console.error('Ошибка при попытке открыть URL:', err);
    });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 ">
      <View className="h-full bg-white px-4">
        <View className="flex-row">
          <View className="flex-col ml-4 justify-between">
            {/* Используем name и description только если они есть */}
            {('name' in mapPoint) && (
              <Text className="text-2xl font-nunitoSansBold">
                {(mapPoint as any).name || 'Point Name'}
              </Text>
            )}
            {('description' in mapPoint) && (
              <Text className="text-sm font-nunitoSansRegular">
                {(mapPoint as any).description || 'No Description'}
              </Text>
            )}
          </View>
        </View>
        <Button mode="contained" onPress={handleOpenMap} className="mt-5 bg-indigo-800">
          <Text className="text-white text-center">Открыть в Google Maps</Text>
        </Button>
        {/* Проверяем наличие удобств (amenities) перед отображением */}
        {'amenities' in mapPoint && (
          <View>
            <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">Удобства</Text>
            <CustomTagsSelector
              tags={(mapPoint as any).amenities || []}
              initialSelectedTags={[]}
              maxSelectableTags={5}
              visibleTagsCount={10}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default React.memo(MapPointComonent);

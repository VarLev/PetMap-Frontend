import React from 'react';
import { View, Text, ScrollView, Linking, Alert } from 'react-native';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import CustomTextComponent from '../custom/text/CustomTextComponent';
import { IMapPoint } from '@/dtos/Interfaces/map/IMapPoint';
import { Button } from 'react-native-paper';
import CustomTagsSelector from '../custom/selectors/CustomTagsSelector';

interface MapPointProps {
  onInvite: (uid:IUser) => void;
  onClose: () => void;
  mapPoint: IMapPoint
}

const MapPointComonent: React.FC<MapPointProps> = React.memo(({mapPoint, onInvite, onClose}) => {

  const handleInvite = () => {
    
  };

  const handleDelete = () => {
    onClose();
  }

  const handleUserProfileOpen = () => {
    
  }

  const handlePetProfileOpen = (petId:string) => {
    
  }

  const handleOpenMap = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapPoint?.address || 'Unknown Location')}`;
    
    // Проверка, может ли устройство открыть URL
    Linking.canOpenURL(mapUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(mapUrl);
        } else {
          Alert.alert('Ошибка', 'Не удается открыть карту.');
        }
      })
      .catch((err) => console.error('Ошибка при попытке открыть URL:', err));
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 ">
      <View className="h-full bg-white px-4">
        <View className="flex-row">
          <View className="flex-col ml-4 justify-between">
          <Text className="text-2xl font-nunitoSansBold">{mapPoint?.name|| 'Owner'}</Text>
          <Text className="text-sm font-nunitoSansRegular">{mapPoint?.description|| 'Owner'}</Text> 
            
          </View>

        </View>
        <Button mode="contained" onPress={handleOpenMap} className='mt-5 bg-indigo-800'>
          <Text className="text-white text-center">Открыть в Google Maps</Text>
        </Button>
        <View >
          <Text className='pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700'>Удобства</Text>
          <CustomTagsSelector 
            tags={mapPoint.amenities || []} 
            initialSelectedTags={[]}
            maxSelectableTags={5}
          />
        </View>
      </View>
    </ScrollView>
  );
});

MapPointComonent.displayName = "MapPointComonent";

export default MapPointComonent;

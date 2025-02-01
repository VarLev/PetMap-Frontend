import React, { useEffect } from 'react';
import { View, Text, Linking } from 'react-native';
import { Card } from 'react-native-paper';
import CustomTextComponent from '../text/CustomTextComponent';
import CustomButtonPrimary from '../buttons/CustomButtonPrimary';
import ImageModalViewer from '@/components/common/ImageModalViewer';
import { calculateDistance, convertDistance } from '@/utils/utils';
import { useAlert } from '@/contexts/AlertContext';
import { IPointEntityDTO } from '@/dtos/Interfaces/map/IPointEntityDTO';
import mapStore from '@/stores/MapStore';
import CustomButtonOutlined from '../buttons/CustomButtonOutlined';
import { PARK_IMAGE } from '@/constants/Strings';
import { MapPointType } from '@/dtos/enum/MapPointType';
import i18n from '@/i18n';
import { MapPointStatus } from '@/dtos/enum/MapPointStatus';
import { set } from 'firebase/database';

interface MapPointDangerCardProps {
  mapPoint: IPointEntityDTO;
  onDetailPress: (id: string, mapPointType: MapPointType) => void;
  isMy?: boolean;
}

const MapPointCard: React.FC<MapPointDangerCardProps> = ({ mapPoint, onDetailPress, isMy }) => {
  const [distance, setDistance] = React.useState(0);
  const [image, setImage] = React.useState<string>();
  const { showAlert } = useAlert();
  const [pointStatus, setPointStatus] = React.useState<string>();
  const [statusColor , setStatusColor] = React.useState<string>();

  useEffect(() => {
    getImage().then((url) => setImage(url));
    const dist = calculateDistance(
      mapPoint.latitude!,
      mapPoint.longitude!,
      mapStore.currentUserCoordinates[0],
      mapStore.currentUserCoordinates[1]
    );
    setDistance(dist);
    setStatusChange();
  }, [mapPoint.latitude, mapPoint.longitude]);

  const getImage = async (): Promise<string> => {
    if (mapPoint.thumbnailUrl)
      return await mapStore.fetchPointImageUrl(mapPoint.thumbnailUrl);
    else
      return PARK_IMAGE;
  };

  const handleOpenMap = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapPoint?.latitude + ',' + mapPoint?.longitude || 'Unknown Location'
    )}`;
    Linking.openURL(mapUrl).catch((err) => {
      showAlert(i18n.t('MapPointCard.errorOpenMap'), 'error');
      console.error(i18n.t('MapPointCard.openMapErrorLog'), err);
    });
  };

  const handleDetailPress = () => {
    onDetailPress(mapPoint.id, MapPointType.Park);
  };

  const setStatusChange = () => {
    if (mapPoint.status === MapPointStatus.InMap) {
      setPointStatus(i18n.t('MapPointCard.statusInMap'));
      setStatusColor('text-green-500');
    } else if (mapPoint.status === MapPointStatus.Pending) {
      setPointStatus(i18n.t('MapPointCard.statusPending'));
      setStatusColor('text-yellow-500');
    } else if (mapPoint.status === MapPointStatus.Rejected) {
      setPointStatus(i18n.t('MapPointCard.statusRejected'));
      setStatusColor('text-red-500');
    }
  }

  

  return (
    <Card className="mx-4 mt-5 -mb-2 bg-white rounded-2xl" elevation={2}>
      {/* Информация о точке */}
      <View className="flex-row items-start justify-stretch">
        <View>
          <ImageModalViewer
            images={[{ uri: image || 'https://placehold.it/100x100' }]}
            imageHeight={100}
            imageWidth={100}
            borderRadius={0}
            className_="rounded-xl"
          />
        </View>
        <View className="w-2/3">
          {isMy && 
          <Text className={`pt-2 text-xs font-nunitoSansBol ${statusColor}`}>
            {pointStatus}
          </Text>}
          <Text
            className="text-base font-nunitoSansBold"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ flexShrink: 1 }}
          >
            {mapPoint.name}
          </Text>
          <CustomTextComponent
            text={convertDistance(distance)}
            leftIcon="paper-plane-outline"
            iconSet="ionicons"
            className_="p-0"
          />
          <CustomTextComponent
            text={mapPoint.description}
            enableTranslation
            maxLines={5}
            className_='-ml-3 p-1'
          />
          
        </View>
      </View>
      <View className="px-2 pb-2 -mt-1 flex-row w-full justify-between">
        <CustomButtonPrimary
          title={i18n.t('MapPointCard.openMap')}
          containerStyles="w-1/2"
          handlePress={handleOpenMap}
        />
        <CustomButtonOutlined
          title={i18n.t('MapPointCard.details')}
          containerStyles="w-1/2"
          handlePress={handleDetailPress}
        />
      </View>
    </Card>
  );
};

export default MapPointCard;
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, View, Text } from 'react-native';
import { DANGERTYPE_TAGS } from '@/constants/Strings';
import { IPointDangerDTO } from '@/dtos/Interfaces/map/IPointDangerDTO';
import { getTagsByIndex } from '@/utils/utils';
import CustomButtonPrimary from '@/components/custom/buttons/CustomButtonPrimary';
import { Divider } from 'react-native-paper';
import ImageModalViewer from '@/components/common/ImageModalViewer';
import ReviewSection from '@/components/review/ReviewSection';
import mapStore from '@/stores/MapStore';
import SkeletonCard from '@/components/custom/cards/SkeletonCard';
import { IPointEntityDTO } from '@/dtos/Interfaces/map/IPointEntityDTO';
import i18n from '@/i18n'; // Импорт i18n

interface CompositeFormProps {
  mapPoint: IPointDangerDTO;
}

const ViewDangerPoint: React.FC<CompositeFormProps> = ({ mapPoint }) => {
  const [pointData, setPointData] = useState<IPointEntityDTO>(mapPoint);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (!mapPoint) return;

      setLoading(true);
      try {
        const point = await mapStore.getMapPointById(
          mapPoint.id,
          mapPoint.mapPointType
        );
        await getImageUrl(point.thumbnailUrl);
        setPointData(point);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mapPoint.id, mapPoint.mapPointType]);

  const getImageUrl = async (url: string | undefined) => {
    if (!url) return;
    try {
      const image = await mapStore.requestDownloadURL(url);
      if (image) setImageUrl(image);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenMap = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapPoint?.latitude + ',' + mapPoint?.longitude || 'Unknown Location'
    )}`;

    Linking.openURL(mapUrl).catch((err) => {
      Alert.alert(i18n.t('ViewDangerPoint.errors.openMapErrorTitle'), i18n.t('ViewDangerPoint.errors.openMapErrorMessage'));
      console.error(err);
    });
  };

  const handleFetchReviews = useCallback(
    async (page: number) => {
      try {
        const reviews = await mapStore.getReviewsByPointId(mapPoint.id);
        return reviews;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    [mapPoint.id]
  );

  return (
    <View className="px-4">
      {loading ? (
        <View>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <View>
          <Text className="text-xl font-nunitoSansBold">
            {i18n.t('ViewDangerPoint.title')}
          </Text>
          <View className="flex-col">
            {imageUrl && (
              <ImageModalViewer
                images={[
                  {
                    uri:
                      imageUrl ||
                      'https://firebasestorage.googleapis.com/v0/b/petmeetar.appspot.com/o/assets%2Fimages%2Fpoints%2FDanger.webp?alt=media&token=f0bc9054-bbfd-42cd-b8f7-ab46d35dc88d',
                  },
                ]}
                imageHeight={150}
                imageWidth={320}
              />
            )}
            <Divider className="mt-2 bg-slate-400" />
            <Text className="pt-2 text-lg font-nunitoSansBold text-indigo-700">
              {i18n.t('ViewDangerPoint.dangerType')}
            </Text>
            <Text className="text-base font-nunitoSansRegular">
              {getTagsByIndex(DANGERTYPE_TAGS, mapPoint.dangerType)}
            </Text>
            <Divider className="mt-2 bg-slate-400" />
            <Text className="mt-2 text-lg font-nunitoSansBold text-indigo-700">
              {i18n.t('ViewDangerPoint.description')}
            </Text>
            <Text className="pb-2 text-base font-nunitoSansRegular">
              {pointData.description}
            </Text>
            <CustomButtonPrimary
              title={i18n.t('ViewDangerPoint.openInGoogleMaps')}
              handlePress={handleOpenMap}
            />
          </View>
        </View>
      )}

      <ReviewSection
        key={mapPoint.id}
        mapPointId={mapPoint.id}
        fetchReviews={handleFetchReviews}
        totalPages={1}
      />

      <View className="h-24" />
    </View>
  );
};

export default ViewDangerPoint;
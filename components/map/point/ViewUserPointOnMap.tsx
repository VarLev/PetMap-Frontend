import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, View, Text } from 'react-native';
import CustomButtonPrimary from '../../custom/buttons/CustomButtonPrimary';
import CustomTagsSelector from '@/components/custom/selectors/CustomTagsSelector';
import ImageModalViewer from '@/components/common/ImageModalViewer';
import mapStore from '@/stores/MapStore';
import { IPointEntityDTO } from '@/dtos/Interfaces/map/IPointEntityDTO';
import { getTagsByIndex } from '@/utils/utils';
import SkeletonCard from '@/components/custom/cards/SkeletonCard';
import ReviewSection from '@/components/review/ReviewSection';
import { MapPointType } from '@/dtos/enum/MapPointType';
import i18n from '@/i18n';

interface CompositeFormProps {
  mapPoint: IPointEntityDTO;
}

const ViewUserPointOnMap: React.FC<CompositeFormProps> = ({ mapPoint }) => {
  const [pointData, setPointData] = useState<IPointEntityDTO>(mapPoint);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log(i18n.t('ViewUserPoint.loading'));
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
        console.error(i18n.t('ViewUserPoint.errors.fetchError'), error);
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
      console.error(i18n.t('ViewUserPoint.errors.imageError'), error);
    }
  };

  const handleOpenMap = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapPoint?.latitude + ',' + mapPoint?.longitude || 'Unknown Location'
    )}`;

    Linking.openURL(mapUrl).catch((err) => {
      Alert.alert(
        i18n.t('ViewUserPoint.errors.openMapErrorTitle'),
        i18n.t('ViewUserPoint.errors.openMapErrorMessage')
      );
      console.error(i18n.t('ViewUserPoint.errors.openMapErrorConsole'), err);
    });
  };

  const handleFetchReviews = useCallback(async () => {
    try {
      const reviews = await mapStore.getReviewsByPointId(mapPoint.id);
      return reviews;
    } catch (error) {
      console.error(i18n.t('ViewUserPoint.errors.fetchReviewsError'), error);
      return [];
    }
  }, [mapPoint.id]);

  return (
    <View className="px-4">
      {loading ? (
        <View>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <>
          {pointData.mapPointType === MapPointType.Note ? (
            <>
              <Text className="pt-2 text-base font-nunitoSansBold text-indigo-700">
                {i18n.t('ViewUserPoint.description')}
              </Text>
              <Text className="text-base font-nunitoSansRegular">
                {pointData.description}
              </Text>
            </>
          ) : (
            <>
              <Text className="px-0 text-xl font-nunitoSansBold">
                {getTagsByIndex(
                  i18n.t('tags.USERSPOINTTYPE_TAGS') as string[],
                  mapPoint.mapPointType
                )}
              </Text>
              <View className="-mt-2 h-36 overflow-hidden flex-row">
                <ImageModalViewer
                  images={[
                    {
                      uri:
                        imageUrl ||
                        'https://firebasestorage.googleapis.com/v0/b/petmeetar.appspot.com/o/assets%2Fimages%2Fpoints%2FPark.webp?alt=media&token=d553a7d8-d919-4514-88f0-faf0089cc067',
                    },
                  ]}
                  imageHeight={120}
                  imageWidth={120}
                />
                <View className="pt-2 pl-2 flex-col w-56">
                  <Text className="text-base font-nunitoSansBold text-indigo-700">
                    {i18n.t('ViewUserPoint.name')}
                  </Text>
                  <Text className="text-base font-nunitoSansBold">
                    {pointData.name}
                  </Text>

                  {/* Адрес — выводим только при наличии данных */}
                  {!!pointData.address && (
                    <>
                      <Text className="text-base font-nunitoSansBold text-indigo-700">
                        {i18n.t('ViewUserPoint.address')}
                      </Text>
                      <Text className="text-base font-nunitoSansRegular truncate h-6">
                        {pointData.address}
                      </Text>
                    </>
                  )}
                </View>
              </View>
              <View className="flex-col">
                <CustomButtonPrimary
                  title={i18n.t('ViewUserPoint.openInGoogleMaps')}
                  handlePress={handleOpenMap}
                />
                <Text className="pt-2 text-base font-nunitoSansBold text-indigo-700">
                  {i18n.t('ViewUserPoint.description')}
                </Text>
                <Text className="text-base font-nunitoSansRegular">
                  {pointData.description}
                </Text>
                {/* Удобства — выводим только при наличии и непустом массиве */}
                {pointData.amenities && pointData.amenities.length > 0 && (
                  <View>
                    <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">
                      {i18n.t('ViewUserPoint.amenities')}
                    </Text>
                    <CustomTagsSelector
                      tags={i18n.t('tags.AMENITIES_TAGS') as string[]}
                      initialSelectedTags={pointData.amenities}
                      readonlyMode
                      visibleTagsCount={10}
                    />
                  </View>
                )}
              </View>
            </>
          )}
        </>
      )}

      {pointData.mapPointType !== MapPointType.Note && (
        <ReviewSection
          key={mapPoint.id}
          mapPointId={mapPoint.id}
          fetchReviews={handleFetchReviews}
        />
      )}

      <View className="h-24" />
    </View>
  );
};

export default React.memo(
  ViewUserPointOnMap,
  (prevProps, nextProps) =>
    prevProps.mapPoint.id === nextProps.mapPoint.id &&
    prevProps.mapPoint.mapPointType === nextProps.mapPoint.mapPointType
);
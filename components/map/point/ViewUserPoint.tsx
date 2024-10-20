import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, View, Text } from 'react-native';
import { AMENITIES_TAGS, USERSPOINTTYPE_TAGS } from '@/constants/Strings';
import CustomButtonPrimary from '../../custom/buttons/CustomButtonPrimary';
import CustomTagsSelector from '@/components/custom/selectors/CustomTagsSelector';
import ImageModalViewer from '@/components/common/ImageModalViewer';
import mapStore from '@/stores/MapStore';
import { IPointEntityDTO } from '@/dtos/Interfaces/map/IPointEntityDTO';
import { getTagsByIndex } from '@/utils/utils';
import SkeletonCard from '@/components/custom/cards/SkeletonCard';
import ReviewSection from '@/components/review/ReviewSection';
import { ReviewDTO } from '@/dtos/classes/review/Review';

interface CompositeFormProps {
  mapPoint: IPointEntityDTO;
}

const ViewUserPoint: React.FC<CompositeFormProps> = ({ mapPoint }) => {
  const [pointData, setPointData] = useState<IPointEntityDTO>(mapPoint);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log('Загружается полная информация о точке');
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
        console.error('Ошибка при получении данных точки:', error);
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
      return;
    }
  };

  const handleOpenMap = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapPoint?.latitude + ',' + mapPoint?.longitude || 'Unknown Location'
    )}`;

    Linking.openURL(mapUrl).catch((err) => {
      Alert.alert('Ошибка', 'Не удается открыть карту.');
      console.error('Ошибка при попытке открыть URL:', err);
    });
  };

  // Memoize functions to prevent re-creation
  const handleSubmitReview = useCallback(
    async (review: ReviewDTO) => {
      review.pointId = mapPoint.id;
      console.log(review);
      await mapStore.addReview(review);
    },
    [mapPoint.id]
  );

  const handleFetchReviews = useCallback(
    async (page: number) => {
      try {
        const reviews = await mapStore.getReviewsByPointId(mapPoint.id);
        return reviews;
      } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
        return [];
      }
    },
    [mapPoint.id]
  );

  if (loading) {
    return (
      <View className="px-4">
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  return (
    <View className="px-4">
      <Text className="px-2 text-2xl font-nunitoSansBold">
        {getTagsByIndex(USERSPOINTTYPE_TAGS, mapPoint.mapPointType)}
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
        <View className="pt-2 flex-col w-56">
          <Text className="text-lg font-nunitoSansBold text-indigo-700">
            Название
          </Text>
          <Text className="text-sm font-nunitoSansRegular">
            {pointData.name}
          </Text>
          <Text className="pt-2 text-lg font-nunitoSansBold text-indigo-700">
            Адрес
          </Text>
          <Text className="text-sm font-nunitoSansRegular">
            {pointData.address}
          </Text>
        </View>
      </View>
      <View className="flex-col">
        <CustomButtonPrimary
          title="Открыть в Google Maps"
          handlePress={handleOpenMap}
        />
        <Text className="pt-2 text-lg font-nunitoSansBold text-indigo-700">
          Описание
        </Text>
        <Text className="text-base font-nunitoSansRegular">
          {pointData.description}
        </Text>
        <View>
          <Text className="pt-4 -mb-1 text-base font-nunitoSansBold text-indigo-700">
            Удобства
          </Text>
          <CustomTagsSelector
            tags={AMENITIES_TAGS}
            initialSelectedTags={pointData.amenities!}
            readonlyMode
            visibleTagsCount={10}
          />
        </View>
      </View>
      {!loading && (
        <ReviewSection
          key={mapPoint.id} // Ensure component remounts only when mapPoint.id changes
          onSubmitReview={handleSubmitReview}
          fetchReviews={handleFetchReviews}
          totalPages={1}
        />
      )}
      <View className="h-24" />
    </View>
  );
};

export default React.memo(
  ViewUserPoint,
  (prevProps, nextProps) =>
    prevProps.mapPoint.id === nextProps.mapPoint.id &&
    prevProps.mapPoint.mapPointType === nextProps.mapPoint.mapPointType
);

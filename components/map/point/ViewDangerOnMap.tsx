import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, View, Text, ScrollView } from 'react-native';
import { IPointDangerDTO } from '@/dtos/Interfaces/map/IPointDangerDTO';
import { getTagsByIndex } from '@/utils/utils';
import { Divider, IconButton } from 'react-native-paper';
import ImageModalViewer from '@/components/common/ImageModalViewer';
import mapStore from '@/stores/MapStore';
import SkeletonCard from '@/components/custom/cards/SkeletonCard';
import { IPointEntityDTO } from '@/dtos/Interfaces/map/IPointEntityDTO';
import i18n from '@/i18n'; // Импорт i18n
import { BG_COLORS } from '@/constants/Colors';
import TextReviewSection from '@/components/review/TextReviewSection';

interface CompositeFormProps {
  mapPoint: IPointDangerDTO;
}

const ViewDangerOnMap: React.FC<CompositeFormProps> = ({ mapPoint }) => {
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
      Alert.alert(
        i18n.t('ViewDangerPoint.errors.openMapErrorTitle'),
        i18n.t('ViewDangerPoint.errors.openMapErrorMessage')
      );
      console.error(err);
    });
  };

  const handleFetchReviews = useCallback(async () => {
    try {
      const reviews = await mapStore.getReviewsByPointId(mapPoint.id);
      return reviews;
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [mapPoint.id]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="px-4">
        {loading ? (
          <View>
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : (
          <View>
            <View className='-ml-4'
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
               <IconButton
                icon="google-maps" // Убедитесь, что иконка "google-maps" доступна в вашем наборе, иначе выберите подходящую.
                size={30}
                onPress={handleOpenMap}
                iconColor={BG_COLORS.indigo[600]}
              />
              <Text className="-ml-2 text-xl font-nunitoSansBold ">
                {i18n.t('ViewDangerPoint.title')}
              </Text>
             
            </View>
            <View className="flex-col -mt-4">
              {imageUrl && (
                <ImageModalViewer
                  images={[
                    {
                      uri:
                        imageUrl ??
                        'https://firebasestorage.googleapis.com/v0/b/petmeetar.appspot.com/o/assets%2Fimages%2Fpoints%2Fdanger.webp?alt=media&token=fe183408-c7ff-420e-9a0c-15037ad07b83',
                    },
                  ]}
                  imageHeight={180}
                  imageWidth={360}
                />
              )}
              <Text className="pt-2 text-lg font-nunitoSansBold text-indigo-700">
                {i18n.t('ViewDangerPoint.dangerType')}
              </Text>
              <Text className="text-base font-nunitoSansRegular">
                {getTagsByIndex(
                  i18n.t('tags.DANGERTYPE_TAGS') as string[],
                  mapPoint.dangerType
                )}
              </Text>
              
              <Text className="mt-2 text-lg font-nunitoSansBold text-indigo-700">
                {i18n.t('ViewDangerPoint.description')}
              </Text>
              <Text className="pb-2 text-base font-nunitoSansRegular">
                {pointData.description}
              </Text>
            </View>
            <Divider className="mt-2 bg-slate-400" />
            <View className="h-60">
              <TextReviewSection
                key={mapPoint.id}
                mapPointId={mapPoint.id}
                fetchReviews={handleFetchReviews}
              />
            </View>
          </View>
        )}

        <View className="h-24" />
      </View>
    </ScrollView>
  );
};

export default ViewDangerOnMap;

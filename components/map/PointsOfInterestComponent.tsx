import React, { useEffect, useState, useCallback } from 'react';
import { MarkerView } from '@rnmapbox/maps';
import { Image, ImageSourcePropType, Pressable } from 'react-native';
import haversine from 'haversine-distance';
import { observer } from 'mobx-react-lite';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation
} from 'react-native-reanimated';
import CustomAlert from '../custom/alert/CustomAlert';
import userStore from '@/stores/UserStore';
import { Job } from '@/dtos/classes/job/Job';
import { IPOI } from '@/dtos/Interfaces/map/POI/IPOI';
import mapStore from '@/stores/MapStore';

interface Props {
  userLocation: [number, number];
  onRouteReady: (routeFeatureCollection: any) => void; // New prop
}

const PulsatingMarker: React.FC<{
  point: IPOI;
  onPress: (pointId: string) => void;
  onLongPress: (point: IPOI) => void;
}> = ({ point, onPress, onLongPress }) => {
  // Создаем анимируемое значение для масштаба
  const scale = useSharedValue(1);
  const longPressScale = useSharedValue(1);
  const isLongPressed = useSharedValue(false);

  useEffect(() => {
    // Анимация пульсации
    if (!isLongPressed.value) {
      scale.value = withRepeat(
        withTiming(1.7, {
          duration: 500,
          easing: Easing.linear,
        }),
        -1, // Бесконечное повторение
        true // Реверс анимации
      );
    }
  }, [scale, isLongPressed]);

  // Применяем анимированный стиль
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * longPressScale.value }],
    width: 50 * longPressScale.value, // Изменяем ширину и высоту, чтобы избежать обрезания
    height: 50 * longPressScale.value,
  }));

  const handleLongPressIn = () => {
    // Увеличиваем размер при долгом нажатии
    isLongPressed.value = true;
    longPressScale.value = withTiming(2.7, {
      duration: 500,
      easing: Easing.inOut(Easing.quad),
     
    })
    cancelAnimation(scale); // Останавливаем анимацию пульсирования
    // Вызываем переданный обработчик долгого нажатия
    onLongPress(point);
  };

  const handleLongPressOut = () => {
    // Возвращаем размер, возобновляем анимацию пульсирования
    isLongPressed.value = false;
    longPressScale.value = withTiming(1, {
      duration: 500,
      easing: Easing.inOut(Easing.quad),

    })
    // scale.value = withRepeat(
    //   withTiming(1.7, {
    //     duration: 500,
    //     easing: Easing.linear,
    //   }),
    //   -1, // Бесконечное повторение
    //   true // Реверс анимации
    // );
  };

  return (
    <MarkerView
      key={point.id}
      id={point.id}
      coordinate={[point.longitude, point.latitude]}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <Pressable
        onPress={() => onPress(point.id)}
        onLongPress={handleLongPressIn}
        onPressOut={handleLongPressOut}
        delayLongPress={200}
      >
        <Animated.View
          className="rounded-full justify-center items-center"
          style={[animatedStyle, { overflow: 'visible' }]} // Добавлено overflow: 'visible' для предотвращения обрезания
        >
          <Image
            source={require('@/assets/images/bonuse.png')}
            style={{ width: 25, height: 25 }}
            resizeMode="contain" // Убедитесь, что изображение масштабируется полностью
          />
        </Animated.View>
      </Pressable>
    </MarkerView>
  );
};

const PointsOfInterestComponent: React.FC<Props> = observer(({ userLocation, onRouteReady }) => {
  const [pointsOfInterest, setPointsOfInterest] = useState<IPOI[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [visiblePoints, setVisiblePoints] = useState<IPOI[]>([]);
  const [alertText, setAlertText] = useState<string>('');
  const imageBonuse = require('@/assets/images/alert-dog-bonuses.webp'); // Define alertImage
  const imageSad = require('@/assets/images/alert-dog-sad.png');
  const [alertImage, setAlertImage] = useState<ImageSourcePropType | undefined>(imageSad);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchPoints = async () => {
      if (!isDataLoaded) {
        await mapStore.fetchUserPOIs(userLocation);
        const generatedPoints = mapStore.getPoi();
        setPointsOfInterest(generatedPoints);
        setIsDataLoaded(true);
      }
    };
    console.log('fetchPoints');

    fetchPoints();
  }, [isDataLoaded]);

  useEffect(() => {
    // Обновляем список видимых точек на основе текущего местоположения
    const updatedVisiblePoints = pointsOfInterest.filter((point) => {
      const distance = haversine(
        { latitude: userLocation[1], longitude: userLocation[0] },
        { latitude: point.latitude, longitude: point.longitude }
      );
      return distance; // 5 км
    });
    setVisiblePoints(updatedVisiblePoints);
  }, [userLocation, pointsOfInterest]);

  const handleMarkerPress = useCallback(
    (pointId: string) => {
      const point = pointsOfInterest.find((point) => point.id === pointId);
      if (!point) return;

      const distance = haversine(
        { latitude: userLocation[1], longitude: userLocation[0] },
        { latitude: point.latitude, longitude: point.longitude }
      );

      if (distance <= 50) {
        setPointsOfInterest((prevPoints) =>
          prevPoints.filter((point) => point.id !== pointId)
        );
        const job = new Job({
          id: 41,
          name: 'Test',
          benefits: 400,
        });

        userStore.updateUserJobs(userStore.currentUser!.id, [job]);
        userStore.collectPOI(point.id);
        setAlertImage(imageBonuse);
        setModalVisible(true);
        setAlertText('Вам начислено 400 бонусов!');
      } else {
        setAlertImage(imageSad);
        setModalVisible(true);
        setAlertText('Вы слишком далеко от бонуса!');
      }
    },
    [pointsOfInterest, userLocation]
  );

  const handleMarkerLongPress = useCallback(
    async (point: IPOI) => {
      const origin = [userLocation[0], userLocation[1]];
      const destination = [point.longitude, point.latitude];

      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN}`;

      try {
        const response = await fetch(url);
        const json = await response.json();

        if (json.routes && json.routes.length > 0) {
          const route = json.routes[0].geometry;

          const routeFeatureCollection = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: route,
              },
            ],
          };

          onRouteReady(routeFeatureCollection); // Pass route data back to MapBoxMap
        }
      } catch (error) {
        console.error('Error fetching route', error);
      }
    },
    [userLocation, onRouteReady]
  );

  return (
    <>
      {visiblePoints.map((point) => (
        <PulsatingMarker
          key={point.id}
          point={point}
          onPress={handleMarkerPress}
          onLongPress={handleMarkerLongPress}
        />
      ))}
      <CustomAlert
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        message={alertText}
        type={'info'}
        image={alertImage}
      />
    </>
  );
});

export default React.memo(PointsOfInterestComponent);

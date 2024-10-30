import React, { useEffect, useState, useCallback } from 'react';
import { MarkerView } from '@rnmapbox/maps';
import { Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import haversine from 'haversine-distance';
import { observer } from 'mobx-react-lite';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import CustomAlert from '../custom/alert/CustomAlert';

interface PointOfInterest {
  id: string;
  coordinate: [number, number];
}

interface Props {
  userLocation: [number, number];
}

const PulsatingMarker: React.FC<{
  point: PointOfInterest;
  onPress: (pointId: string) => void;
}> = ({ point, onPress }) => {
  // Создаем анимируемое значение для масштаба
  const scale = useSharedValue(1);

  useEffect(() => {
    // Анимация пульсации
    scale.value = withRepeat(
      withTiming(1.7, {
        duration: 500,
        easing: Easing.linear, 
      }),
      -1, // Бесконечное повторение
      true // Реверс анимации
    );
  }, [scale]);

  // Применяем анимированный стиль
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    width: 50,  
    height: 50,
  }));

  return (
    
    <MarkerView
      key={point.id}
      id={point.id}
      coordinate={point.coordinate}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <TouchableOpacity onPress={() => onPress(point.id)}>
      <Animated.View
        className="rounded-full justify-center items-center"
        
        style={animatedStyle}
        
      >
        <Image
          source={require('@/assets/images/bonuse.png')}
          style={{ width: 20, height: 20 }}
        />
      </Animated.View>
      </TouchableOpacity>
    </MarkerView>

  );
};

const PointsOfInterestComponent: React.FC<Props> = observer(({ userLocation }) => {
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [visiblePoints, setVisiblePoints] = useState<PointOfInterest[]>([]);
  const [alertText, setAlertText] = useState<string>('');
  const imageBonuse = require('@/assets/images/alert-dog-bonuses.webp'); // Define alertImage
  const imageSad = require('@/assets/images/alert-dog-sad.png'); 

  const [alertImage, setAlertImage] = useState<ImageSourcePropType | undefined>(imageSad);

  // Мемоизируем функцию генерации точек, чтобы она не пересоздавалась при каждом рендере
  const generatePoints = useCallback(
    (userLocation: [number, number]): PointOfInterest[] => {
      const points: PointOfInterest[] = [];
      for (let i = 0; i < 3; i++) {
        const offsetLat = (Math.random() - 0.5) * 0.02;
        const offsetLng = (Math.random() - 0.5) * 0.02;
        points.push({
          id: `point-${i}`,
          coordinate: [userLocation[0] + offsetLng, userLocation[1] + offsetLat],
        });
      }
      return points;
    },
    []
  );

  useEffect(() => {
    // Генерируем точки только при изменении userLocation
    const generatedPoints = generatePoints(userLocation);
    setPointsOfInterest(generatedPoints);
  }, [userLocation, generatePoints]);

  useEffect(() => {
    // Обновляем список видимых точек на основе текущего местоположения
    const updatedVisiblePoints = pointsOfInterest.filter((point) => {
      const distance = haversine(
        { latitude: userLocation[1], longitude: userLocation[0] },
        { latitude: point.coordinate[1], longitude: point.coordinate[0] }
      );
      return distance <= 5000; // 5 км
    });
    setVisiblePoints(updatedVisiblePoints);
  }, [userLocation, pointsOfInterest]);

  const handleMarkerPress = useCallback(
    (pointId: string) => {
      const point = pointsOfInterest.find((point) => point.id === pointId);
      if (!point) return;

      const distance = haversine(
        { latitude: userLocation[1], longitude: userLocation[0] },
        { latitude: point.coordinate[1], longitude: point.coordinate[0] }
      );

      if (distance <= 20) {
        setPointsOfInterest((prevPoints) =>
          prevPoints.filter((point) => point.id !== pointId)
        );
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

  return (
    <>
      {visiblePoints.map((point) => (
        <PulsatingMarker key={point.id} point={point} onPress={handleMarkerPress} />
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

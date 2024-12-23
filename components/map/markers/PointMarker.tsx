import React, { RefObject } from 'react';
import { View, Pressable } from 'react-native';
import Mapbox, { PointAnnotation } from '@rnmapbox/maps';
import { IPointEntityDTO } from '@/dtos/Interfaces/map/IPointEntityDTO';
import { MapPointType } from '@/dtos/enum/MapPointType';
import MapPointIconWithAnimation from '../point/MapPointIscon'; // или нужный путь к вашему компоненту иконки
import IconSelectorComponent from '@/components/custom/icons/IconSelectorComponent';

interface PointMarkerProps {
  /** Флаг для отображения или скрытия маркеров, когда включён карточный вид. */
  isCardView: boolean;

  /** Список поинтов на карте (Danger, UsersCustomPoint, Note и т.п.). */
  mapPoints: IPointEntityDTO[];

  /** ID выбранного поинта (для выделения иконки, если требуется). */
  selectedPointId: string;

  /** Колбэк, который срабатывает при нажатии на поинт, чтобы показать BottomSheet. */
  onMapPointPress: (point: IPointEntityDTO) => void;

  /** Координаты маркера, который находится в процессе редактирования (или создаётся новый). */
  markerPointCoordinate: [number, number] | null;

  /** Отвечает, открыт ли BottomSheet (если да, показываем маркер редактирования). */
  isSheetVisible: boolean;

  /** Текущий тип поинта, который пользователь пытается добавить (Danger, Note и т.д.). */
  currentPointType: MapPointType;

  /** Реф, чтобы при необходимости рефрешить аннотацию маркера редактирования. */
  pointAnnotationCurrentUser: RefObject<PointAnnotation>;
}

/**
 * Компонент для рендеринга:
 * 1) Всех статичных поинтов (Danger, UserPoint и т.п.) из mapPoints
 * 2) Маркера редактирования (если пользователь создаёт новый Danger/Note и т.д.)
 */
const PointMarker: React.FC<PointMarkerProps> = ({
  isCardView,
  mapPoints,
  selectedPointId,
  onMapPointPress,
  markerPointCoordinate,
  isSheetVisible,
  currentPointType,
  pointAnnotationCurrentUser,
}) => {
  // Если включён карточный вид, то не показываем обычные маркеры.
  if (isCardView) return null;

  return (
    <>
      {/* Маркеры существующих поинтов (Danger, Note, CustomPoint...) */}
      {mapPoints.map((point, index) => (
        <Mapbox.MarkerView
          key={`advrt-${point.id}`}
          id={`advrt-${index}`}
          anchor={{ x: 0.5, y: 1 }}
          coordinate={[point.longitude!, point.latitude!]}
          onTouchStart={() => {}}
          allowOverlap={false}
        >
          <Pressable onPress={() => onMapPointPress(point)}>
            <MapPointIconWithAnimation
              mapPointType={point.mapPointType}
              isSelected={selectedPointId === point.id}
            />
          </Pressable>
        </Mapbox.MarkerView>
      ))}

      {/* Маркер редактирования (когда пользователь добавляет новый поинт). */}
      {markerPointCoordinate && isSheetVisible && (
        <PointAnnotation
          ref={pointAnnotationCurrentUser}
          id="currentUserMarker"
          coordinate={markerPointCoordinate}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          {currentPointType === MapPointType.Danger ? (
            // Отрисовка, если пользователь добавляет опасность (Danger)
            <View className="bg-indigo-700 rounded-full h-6 w-6">
              <IconSelectorComponent
                iconName="alert-circle-outline"
                iconSet="MaterialCommunityIcons"
                size={24}
                color="white"
              />
            </View>
          ) : (
            // Отрисовка, если пользователь добавляет пользовательский поинт (UsersCustomPoint, Note и т.д.)
            <View className="bg-indigo-700 rounded-full h-6 w-6">
              <IconSelectorComponent
                iconName="help-circle-outline"
                iconSet="Ionicons"
                size={24}
                color="white"
              />
            </View>
          )}
        </PointAnnotation>
      )}
    </>
  );
};

export default PointMarker;
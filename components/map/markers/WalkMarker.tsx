import React, { RefObject } from 'react';
import { View, Pressable, Image } from 'react-native';
import Mapbox, { PointAnnotation } from '@rnmapbox/maps';
import Svg, { Path } from 'react-native-svg';
import { IWalkAdvrtDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtDto';
import { IUser } from '@/dtos/Interfaces/user/IUser'; // или другой интерфейс, описывающий пользователя

interface MapMarkersProps {
  /** Флаг, активирован ли режим карточек (при котором маркеры не отображаются). */
  isCardView: boolean;

  /** Массив объявлений о прогулках. */
  walkAdvrts: IWalkAdvrtDto[];

  /** Id выбранной прогулки (чтобы задать стиль маркера). */
  selectedWalkMarker: string;

  /** Колбэк при нажатии на пин прогулки. */
  onPinPress: (advrt: IWalkAdvrtDto) => void;

  /** Сеттер, чтобы менять выбранный маркер (по его id). */
  setSelectedWalkMarker: React.Dispatch<React.SetStateAction<string>>;

  /** Координаты создаваемого события (прогулки/поинта), чтобы отобразить временный маркер. */
  markerCoordinate: [number, number] | null;

  /** Флаг, отображается ли BottomSheet (если true — показываем временный маркер). */
  isSheetVisible: boolean;

  /** Текущий пользователь, чтобы взять его аватар (или любую другую информацию). */
  currentUser: IUser | null;

  /** Реф на PointAnnotation (Marker) для принудительной перерисовки. */
  pointAnnotationCurrentUser: RefObject<PointAnnotation>;
}

/**
 * Единый компонент для рендера:
 * 1) Маркеров прогулок (walkAdvrts)
 * 2) Маркера редактирования/создания текущей прогулки (markerCoordinate)
 */
const WalkMarker: React.FC<MapMarkersProps> = ({
  isCardView,
  walkAdvrts,
  selectedWalkMarker,
  onPinPress,
  setSelectedWalkMarker,
  markerCoordinate,
  isSheetVisible,
  currentUser,
  pointAnnotationCurrentUser,
}) => {
  // Если включён карточный вид, просто не рендерим маркеры.
  if (isCardView) return null;

  return (
    <>
      {/* Маркеры прогулок */}
      {walkAdvrts.map((advrt, index) => (
        <Mapbox.MarkerView
          key={`advrt-${advrt.id}`}
          id={`advrt-${index}`}
          coordinate={[advrt.longitude!, advrt.latitude!]}
          anchor={{ x: 0.5, y: 1 }}
          onTouchStart={() => {
            onPinPress(advrt);
            setSelectedWalkMarker(advrt.id!);
          }}
          allowOverlap={false}
        >
          <Pressable
            onPress={() => {
              onPinPress(advrt);
              setSelectedWalkMarker(advrt.id!);
            }}
            onLongPress={() => console.log('Long press detected')}
          >
            <View>
              <Svg width="43" height="55" viewBox="0 0 43 55" fill="none">
                <Path
                  d="M21.4481 54.8119C21.4481 54.8119 42.8963 35.7469 42.8963 21.4481C42.8963 9.60265 33.2936 0 21.4481 0C9.60265 0 0 9.60265 0 21.4481C0 35.7469 21.4481 54.8119 21.4481 54.8119Z"
                  fill={selectedWalkMarker === advrt.id ? '#4338CA' : '#BFA8FF'}
                />
              </Svg>
              <Image
                className="ml-[3.5px] mt-[3px] rounded-full h-9 w-9 absolute"
                source={{
                  uri: advrt?.userPhoto || 'https://via.placeholder.com/100',
                }}
              />
            </View>
          </Pressable>
        </Mapbox.MarkerView>
      ))}

      {/* Временный маркер (например, создаваемой прогулки или поинта) */}
      {markerCoordinate && isSheetVisible && (
        <Mapbox.PointAnnotation
          ref={pointAnnotationCurrentUser}
          id="currentUserMarker"
          coordinate={markerCoordinate}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View>
            <Image
              className="rounded-full h-10 w-10"
              source={{
                uri: currentUser?.thumbnailUrl || 'https://via.placeholder.com/100',
              }}
              onLoad={() => pointAnnotationCurrentUser.current?.refresh()}
              fadeDuration={0}
            />
          </View>
        </Mapbox.PointAnnotation>
      )}
    </>
  );
};

export default WalkMarker;

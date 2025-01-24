import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, BackHandler, ImageSourcePropType, Animated, ActivityIndicator, TouchableOpacity, Keyboard } from 'react-native';
import Mapbox, { MapView, UserLocation, Camera, PointAnnotation, ShapeSource, SymbolLayer, LineLayer, SymbolLayerStyle } from '@rnmapbox/maps';
import mapStore from '@/stores/MapStore';
import { IconButton, Provider } from 'react-native-paper';
import BottomSheetComponent from '@/components/common/BottomSheetComponent'; // Импортируйте новый компонент
import BottomSheet from '@gorhom/bottom-sheet';
import AdvtComponent from './AdvtComponent';
import userStore from '@/stores/UserStore';
import chatStore from '@/stores/ChatStore';
import AdvtEditComponent from './AdvtEditComponent';
import { IWalkAdvrtDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtDto';
import { router, useFocusEffect } from 'expo-router';
import { useDrawer } from '@/contexts/DrawerProvider';
import SearchAndTags from '../custom/inputs/FilterSearchAndTagsComponent';
import FilterComponent from '../filter/FilterComponent';
import { IPointEntityDTO } from '@/dtos/Interfaces/map/IPointEntityDTO';
import { MapPointType } from '@/dtos/enum/MapPointType';
import EditDangerPoint from './point/EditDangerPoint';
import { IPointDangerDTO } from '@/dtos/Interfaces/map/IPointDangerDTO';
import { DangerLevel } from '@/dtos/enum/DangerLevel';
import { DangerType } from '@/dtos/enum/DangerType';
import { MapPointStatus } from '@/dtos/enum/MapPointStatus';
import { randomUUID } from 'expo-crypto';
import ViewDangerPoint from './point/ViewDangerPoint';
import EditUserPoint from './point/EditUserPoint';
import { IPointUserDTO } from '@/dtos/Interfaces/map/IPointUserDTO';
import { FeatureCollection, Point } from 'geojson';
import ViewUserPoint from './point/ViewUserPoint';
import CustomAlert from '../custom/alert/CustomAlert';
import SlidingOverlay from '../navigation/SlidingOverlay';
import MapItemList from '../navigation/points/MapItemList';
import { UserPointType } from '@/dtos/enum/UserPointType';
import PointsOfInterestComponent from './PointsOfInterestComponent';
import FabGroupComponent from './FabGroupComponent';

import i18n from '@/i18n';
import uiStore from '@/stores/UIStore';
import PermissionsRequestComponent from '../auth/PermissionsRequestComponent';
import WalkMarker from './markers/WalkMarker';
import PointMarker from './markers/PointMarker';
import { createGeoJSONFeatures } from '@/utils/mapUtils';
import { generateChatData, generateChatIdForTwoUsers } from '@/utils/chatUtils';
import { Easing } from 'react-native-reanimated';
import { BG_COLORS } from '@/constants/Colors';



const MapBoxMap = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  // пользователь загрузился первый раз
  const [didLoad, setDidLoad] = useState(false);
  const sheetRef = useRef<BottomSheet>(null);
  const cameraRef = useRef<Camera>(null);
  const mapRef = useRef<Mapbox.MapView>(null);
  const userLocationRef = useRef<UserLocation>(null);
  const [renderContent, setRenderContent] = useState<ReactNode>(() => null);
  const [markerCoordinate, setMarkerCoordinate] = useState<[number, number] | null>(null);
  const [markerPointCoordinate, setMarkerPointCoordinate] = useState<[number, number] | null>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const pointAnnotationCurrentUser = useRef<PointAnnotation>(null);
  const { openDrawer, closeDrawer } = useDrawer();
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>([-58.381592, -34.603722]);
  const currentUser = userStore.currentUser;
  const [modifiedFieldsCount, setModifiedFieldsCount] = useState(0);
  const [currentPointType, setCurrentPointType] = useState(MapPointType.Walk);
  const [geoJSONData, setGeoJSONData] = useState<FeatureCollection<Point> | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [alertType, setAlertType] = useState<'error' | 'info'>('info');
  const [alertText, setAlertText] = useState<string>('');
  const [isCardView, setisCardView] = useState<boolean>(false);
  const [selectedPointId, setSelectedPointId] = useState<string>('');
  const [selectedWalkMarker, setSelectedWalkMarker] = useState('');
  const [alertImage, setAlertImage] = useState<ImageSourcePropType>();
  const [hasPermission, setHasPermission] = useState<boolean>();
  // Данные для маршрута
  const [routeData, setRouteData] = useState<any>(null);

  // Нужно, чтобы понимать, показывать форму редактирования прогулки или нет
  const [renderAdvrtForm, setRenderAdvrtForm] = useState(false);

  // Снэкбар при отсутствии точек
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);

  // Анимированное значение для плавного появления карты
  const fadeAnim = useRef(new Animated.Value(0)).current;


  Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN!);

  // Когда isLoading меняется на false, запускаем анимацию плавного появления
  useEffect(() => {
    if (!isLoading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,        // Длительность анимации (миллисекунды)
        easing: Easing.ease,  // Можно использовать разные типы Easing
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, fadeAnim]);

  useEffect(() => {
    if (!userCoordinates) return; // Если координаты ещё null, выходим
    // Если уже загрузили данные (didLoad = true), выходим,
    // Если уже загрузили данные (didLoad = true), выходим,
    if (didLoad) return;
    const loadData = async () => {
      setIsLoading(true);
      setHasPermission(uiStore.getLocationPermissionGranted());
      const fetchCity = async () => {
        if (userCoordinates) {
          try {
            if (userStore.getCurrentUserCity() === '') {
              const address = await mapStore.getUserCity(userCoordinates);
              if (address) {
                userStore.setCurrentUserCountry(address![0]);
                userStore.setCurrentUserCity(address![1]);
                await mapStore.setWalkAdvrts();
              }

            }
            mapStore.setCity(userStore.getCurrentUserCity());
            console.log('Город успешно получен для координат:', mapStore.getCity());
          } catch (error) {
            console.error('Ошибка при получении города:', error);
          }
        } else {
          // Если координат ещё нет, выставляем город по умолчанию
          userStore.setCurrentUserCity('Buenos Aires');
          mapStore.setCity('Buenos Aires');
          await mapStore.setWalkAdvrts();
        }
      };

      const fetchData = async () => {
        const data = createGeoJSONFeatures(mapStore.walkAdvrts, mapStore.mapPoints);
        setGeoJSONData(data);
      };

      // Порядок: сначала пытаемся определить город (если координаты есть), потом собираем GeoJSON
      await fetchCity();
      await fetchData();

      setIsLoading(false);
    };

    // Загрузка данных только после того, как поменялось состояние userCoordinates
    if (userCoordinates) {
      loadData().then(() => {
        // После успешного выполнения ставим флаг
        setDidLoad(true);
      }).catch((error) => console.error(error));
    } else {
      // Если userCoordinates пока нет, мы можем либо ждать, либо показывать некий "заглушечный" город.
      setIsLoading(false);
    }
  }, [userCoordinates, didLoad]);

  // --- Периодический опрос при фокусе экрана ---
  useFocusEffect(
    useCallback(() => {
      if (mapStore.getMyPointToNavigateOnMap()) {
        if (mapStore.getMyPointToNavigateOnMap()?.pointType === MapPointType.Walk) {
          const advrt = mapStore.walkAdvrts.find((advrt: IWalkAdvrtDto) => advrt.id === mapStore.getMyPointToNavigateOnMap()?.pointId);
          if (advrt) {
            onPinPress(advrt,14);
          }
        }
        mapStore.setMyPointToNavigateOnMap(null);

      }

    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Если пользователь авторизован и нажимает "Назад", блокируем переход на экран авторизации
        handleSheetClose();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );


  // Обработка системной кнопки "Назад" на Android
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Если пользователь авторизован и нажимает "Назад", блокируем переход на экран авторизации
        handleSheetClose();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );

  const handleRouteReady = (routeFeatureCollection: any) => {
    if (routeData) {
      setRouteData(null);
      return;
    }
    setRouteData(routeFeatureCollection);
  };

  const handleFilterChange = (count: number) => {
    setModifiedFieldsCount(count);
  };


  const handlePress = (event: any ) => {
    Keyboard.dismiss();
    if (uiStore.getIsSearchAddressExpanded())
      return;
    console.log('Press detected');
    if (
      currentPointType === MapPointType.Walk ||
      currentPointType === MapPointType.Danger ||
      currentPointType === MapPointType.UsersCustomPoint ||
      currentPointType === MapPointType.Note
    ) {
      setScrollEnabled(false);
      console.log(currentPointType);
      const coordinates = event.geometry.coordinates;

      cameraRef.current?.setCamera({
        centerCoordinate: coordinates,
        animationDuration: 200,
        padding: {
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 350,
        },
      });

      if (currentPointType === MapPointType.Walk) {
        if ((currentUser!.petProfiles ?? []).length > 0) {
          setMarkerCoordinate(coordinates);
          mapStore.setMarker(coordinates);
          setRenderAdvrtForm(true);
          setRenderContent(() => <AdvtEditComponent coordinates={coordinates} onAdvrtAddedInvite={handleAdvrtAdded} />);
        } else {
          setAlertText(i18n.t('Map.fillProfileAndAddPet'));
          showAlert('info');
          return;
        }
      } else if (currentPointType === MapPointType.Danger) {
        const mapPoint: IPointDangerDTO = {
          dangerLevel: DangerLevel.Low,
          dangerType: DangerType.Other,
          availableHours: 0,
          id: randomUUID(),
          mapPointType: MapPointType.Danger,
          status: MapPointStatus.InMap,
          latitude: coordinates[1],
          longitude: coordinates[0],
          createdAt: new Date().toISOString(),
          photos: [],
          userId: currentUser?.id,
        };

        setMarkerPointCoordinate(coordinates);
        mapStore.setMarker(coordinates);
        setRenderContent(() => <EditDangerPoint mapPoint={mapPoint} onClose={handleSheetClose} />);
      } else if (currentPointType === MapPointType.UsersCustomPoint) {
        const mapPoint: IPointUserDTO = {
          id: randomUUID(),
          mapPointType: MapPointType.UsersCustomPoint,
          status: MapPointStatus.Pending,
          latitude: coordinates[1],
          longitude: coordinates[0],
          createdAt: new Date().toISOString(),
          photos: [],
          userId: currentUser?.id,
          userPointType: 0,
        };
        setMarkerPointCoordinate(coordinates);
        mapStore.setMarker(coordinates);
        setRenderContent(() => <EditUserPoint mapPoint={mapPoint} onClose={handleSheetClose} />);
      } else if (currentPointType === MapPointType.Note) {
        const mapPoint: IPointUserDTO = {
          id: randomUUID(),
          mapPointType: MapPointType.Note,
          status: MapPointStatus.Pending,
          latitude: coordinates[1],
          longitude: coordinates[0],
          createdAt: new Date().toISOString(),
          photos: [],
          userId: currentUser?.id,
          userPointType: UserPointType.Note,
        };
        setMarkerPointCoordinate(coordinates);
        mapStore.setMarker(coordinates);
        setRenderContent(() => <EditUserPoint mapPoint={mapPoint} onClose={handleSheetClose} />);
      }

      if (!isSheetExpanded) {
        setTimeout(() => {
          sheetRef.current?.snapToIndex(0);
          mapStore.setBottomSheetVisible(true);

          setIsSheetVisible(true);
        }, 200);
      }
    }
  };

  const onPinPress = async (advrt: IWalkAdvrtDto, zoomLevelx?:number) => {
    cameraRef.current?.setCamera({
      centerCoordinate: [advrt.longitude!, advrt.latitude!],
      animationDuration: 300,
      ...(zoomLevelx !== undefined && { zoomLevel: zoomLevelx }), // Only set zoomLevel if zoomLevelx is defined
      padding: {
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 400,
      },
    });
    setRenderContent(() => <AdvtComponent advrt={advrt} onInvite={handleChatInvite} onClose={handleSheetClose} />);
    if (!isSheetExpanded) {
      sheetRef.current?.snapToIndex(0); // Позиция 60% в snapPoints
      mapStore.setBottomSheetVisible(true);
      setIsSheetVisible(true);
      mapStore.currentWalkId = advrt.id;
    }
  };

  const onMapPointPress = async (mapPoint: IPointEntityDTO) => {
    setSelectedPointId(mapPoint.id);
    console.log('Map point press:', mapPoint.id);

    cameraRef.current?.setCamera({
      centerCoordinate: [mapPoint.longitude!, mapPoint.latitude!],
      animationDuration: 300,
      padding: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 400,
      },
    });

    if (mapPoint.mapPointType === MapPointType.Danger) {
      const pointDanger = mapPoint as IPointDangerDTO;
      console.log('Danger point:', pointDanger);
      setRenderContent(<ViewDangerPoint mapPoint={pointDanger} />);
    } else {
      const pointUser = mapPoint as IPointEntityDTO;

      setRenderContent(() => <ViewUserPoint mapPoint={pointUser} />);
    }

    if (!isSheetExpanded) {
      setTimeout(() => {
        sheetRef.current?.snapToIndex(0); // Позиция 60% в snapPoints
        mapStore.setBottomSheetVisible(true);
        setIsSheetVisible(true);
      }, 200);
    }
  };

  const handleChatInvite = async (otherUser: IChatUser) => {
    try {
      sheetRef.current?.close();
      const chatId = generateChatIdForTwoUsers(currentUser!.id!, otherUser.id);
      let chat = await chatStore.getChatById(chatId);
      if (!chat) {
        chat = generateChatData(chatId, currentUser!.id!, otherUser.id, otherUser, 'request for a walk');
      }
      await chatStore.sendMessageUniversal(chat, '', {
        isInvite: true,
        inviteMetadata: {
          advrtId: mapStore.currentWalkId
        },
      });
      //await chatStore.sendInviteMessage(chatId!, otherUser);

      if (chatId) {
        router.push(`/(chat)/${chatId}`);
        //router.push(`/chat/${chatId}`);
      }
    } catch (error) {
      console.error('Ошибка при создании чата:', error);
    }
  };

  const handleAdvrtAdded = (isGetedBonuses: boolean) => {
    sheetRef.current?.close();
    if (isGetedBonuses) {
      setAlertImage(require('@/assets/images/alert-dog-bonuses.webp'));
      setAlertText(i18n.t('Map.walkCreatedWithBonus'));
      showAlert('info');
    }
  };

  const handleSheetClose = async () => {
    setSelectedPointId('');
    await sheetRef.current?.close();
    mapStore.setBottomSheetVisible(false);
    setMarkerCoordinate(null);
    setMarkerPointCoordinate(null);
    setIsSheetVisible(false);
    setIsSheetExpanded(false);
    setRenderAdvrtForm(false); // Сбрасываем форму редактирования прогулки
  };

  const handleSearchTextChange = () => { };

  const tagSelected = async (type: number) => {
    setCurrentPointType(type);
    if (!isCardView) {
      if (type === MapPointType.Walk) await mapStore.setWalkAdvrts();
      else {
        await mapStore.getMapPointsByType({
          type: type,
          userId: currentUser?.id!,
          city: (await userStore.getCurrentUserCity()) || '',
        });
        setSnackbarVisible(mapStore.mapPoints.length === 0 ? true : false);
      }
    }
  };

  const handleOpenFilter = () => {
    openDrawer(<FilterComponent onFilterChange={handleFilterChange} onFilterApply={closeDrawer} />);
  };

  const handleUserLocationUpdate = (location: Mapbox.Location) => {
    const { coords } = location;
    if (coords) {
      // Сохранение координат пользователя
      mapStore.currentUserCoordinates = [coords.latitude, coords.longitude];

      setUserCoordinates([coords.longitude, coords.latitude]);
      console.log('User coordinates:', coords.latitude, coords.longitude);
    }
  };

  const hangleSetSelectedNumberPoint = (number: number) => {
    tagSelected(number);
  };

  const showAlert = (type: 'error' | 'info') => {
    setAlertType(type);
    setModalVisible(true);
  };

  const handleRecenter = () => {
    if (cameraRef.current && userCoordinates) {
      cameraRef.current.setCamera({
        centerCoordinate: userCoordinates,
        zoomLevel: 14, // выберите подходящий уровень зума
        animationDuration: 1000,
      });
    }
  };


  return (
    <Provider>
      {/* Компонент, проверяющий и запрашивающий разрешения */}
      <PermissionsRequestComponent />

      {/* Пока идёт загрузка, карту не отображаем. Можно вставить лоадер, если нужно. */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>

      ) : (
        // После окончания загрузки используем анимированный контейнер, чтобы карта появилась плавно
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          {/* Если у нас есть режим карточного вида, отображаем SlidingOverlay */}
          {isCardView && (
            <SlidingOverlay visible={isCardView}>
              <MapItemList renderType={currentPointType} />
            </SlidingOverlay>
          )}


          {/* Собственно карта */}
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            onPress={handlePress}
            styleURL={Mapbox.StyleURL.Light}
            logoEnabled={false}
            attributionEnabled={false}
            scaleBarEnabled={false}
            scrollEnabled={!isCardView}
            pitchEnabled={!isCardView}
            zoomEnabled={!isCardView}
            rotateEnabled={!isCardView}
          >


            {hasPermission && (
              <UserLocation
                minDisplacement={50}
                ref={userLocationRef}
                onUpdate={handleUserLocationUpdate}
              />
            )}

            {routeData && (
              <ShapeSource id="routeSource" shape={routeData}>
                <LineLayer id="routeLine" style={{ lineColor: 'blue', lineWidth: 5 }} />
              </ShapeSource>
            )}

            {/* Начальная позиция камеры (если есть координаты пользователя) */}
            {userCoordinates && (
              <Camera
                ref={cameraRef}
                centerCoordinate={userCoordinates}
                zoomLevel={10}
                animationDuration={1}
              />
            )}


            {/* Простейший pin через PointAnnotation */}
            <PointAnnotation
              id="my-marker"
              coordinate={[10, 10]}
            >
              {/* Сам вид маркера. Можно поставить свою иконку */}
              <View>
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: BG_COLORS.indigo[700],
                  borderWidth: 2,
                  borderColor: 'white'
                }} />
              </View>
            </PointAnnotation>


            {/* Кластеризация меток (если используем ShapeSource / SymbolLayer) */}
            {!isCardView && geoJSONData && (
              <ShapeSource id="points" shape={geoJSONData} cluster clusterRadius={38}>
                <SymbolLayer id="clusteredPoints" filter={['has', 'point_count']} style={styles.clusterStyle} />

              </ShapeSource>
            )}

            {/* Маркеры объявлений о прогулках */}
            <WalkMarker
              isCardView={isCardView}
              walkAdvrts={mapStore.walkAdvrts}
              selectedWalkMarker={selectedWalkMarker}
              onPinPress={onPinPress}
              setSelectedWalkMarker={setSelectedWalkMarker}
              markerCoordinate={markerCoordinate}
              isSheetVisible={isSheetVisible}
              currentUser={currentUser}
              pointAnnotationCurrentUser={pointAnnotationCurrentUser}
            />

            {/* Маркеры пользовательских точек (Danger, Custom, Note и т.п.) */}
            <PointMarker
              isCardView={isCardView}
              mapPoints={mapStore.mapPoints}
              selectedPointId={selectedPointId}
              onMapPointPress={onMapPointPress}
              markerPointCoordinate={markerPointCoordinate}
              isSheetVisible={isSheetVisible}
              currentPointType={currentPointType}
              pointAnnotationCurrentUser={pointAnnotationCurrentUser}
            />

            {/* 
              Рендерим PointsOfInterestComponent ТОЛЬКО если:
               1) есть разрешение (hasPermission)
               2) есть реальные координаты пользователя (userCoordinates !== null)
               3) не идёт загрузка (isLoading === false)
            */}
            {!isCardView && hasPermission && userCoordinates && !isLoading && (
              <PointsOfInterestComponent
                userLocation={userCoordinates}
                onRouteReady={handleRouteReady}
              />
            )}

            {/* Кнопка FAB (добавление меток и т.п.), если шторка BottomSheet не открыта */}
            {!isSheetVisible && (
              <FabGroupComponent
                selectedNumber={currentPointType}
                setSelectedNumber={hangleSetSelectedNumberPoint}
                isVisible={!isCardView}
              />
            )}
          </MapView>
          {/* === Кнопка "Моя локация" поверх карты === */}
          {hasPermission && userCoordinates && (
            <TouchableOpacity activeOpacity={0.8} className='absolute bottom-[180px] right-[25px]' onPress={handleRecenter}>
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 25,
                height: 45,
                width: 45,
                // Тень на Android
                elevation: 3,
                // Тень на iOS
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,

              }}>
                <IconButton
                  icon="crosshairs-gps"
                  size={25}
                  className='bg-white -left-1 -top-1'
                  iconColor={BG_COLORS.indigo[700]}
                />
              </View>
            </TouchableOpacity>
          )}

          {/* Блок с поиском, фильтрами и переключателем карточного вида */}
          <View
            style={{
              position: 'absolute',
              top: 20,
              left: 0,
              right: 0,
              zIndex: 10,
            }}
          >

            <SearchAndTags
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              onSearchTextChange={handleSearchTextChange}
              onTagSelected={tagSelected}
              onOpenFilter={handleOpenFilter}
              onOpenCardView={() => setisCardView(!isCardView)}
              badgeCount={modifiedFieldsCount}
              setSnackbarVisible={setSnackbarVisible}
              snackbarVisible={snackbarVisible}
              onAddressSelected={(coordinates) => {
                cameraRef.current?.flyTo(coordinates, 500);
                setTimeout(() => {
                  uiStore.setIsSearchAddressExpanded(false);
                  handlePress({ geometry: { coordinates: coordinates } });
                }
                  , 600);

              }}
            />


          </View>

          {/* BottomSheet для отображения деталей выбранной точки/объявления */}
          {isSheetVisible && (
            <BottomSheetComponent
              ref={sheetRef}
              snapPoints={renderAdvrtForm ? ['60%', '100%'] : ['60%', '100%']}
              renderContent={renderContent as any}
              onClose={handleSheetClose}
              enablePanDownToClose={true}
              initialIndex={0}
              usePortal={true}
            />
          )}

          {/* Кастомный Alert */}
          <CustomAlert
            isVisible={isModalVisible}
            onClose={() => setModalVisible(false)}
            message={alertText}
            type={alertType}
            title={alertType === 'error' ? 'Error' : ''}
            image={alertImage}
          />
        </Animated.View>
      )}
    </Provider>
  );
});


const styles = {
  clusterStyle: {
    iconImage: 'clusterIcon',
    iconSize: 1,
    textField: '{point_count}',
    textSize: 12,
    textColor: '#fff',
    textHaloColor: 'gray',
    textHaloWidth: 1,
    textFont: ['Arial Unicode MS Bold'],
  },
  pointStyle: {
    iconImage: [
      'case',
      ['==', ['get', 'type'], 'advrt'],
      'advrtIcon',
      ['==', ['get', 'type'], 'point'],
      'pointIcon',
      'defaultIcon', // Иконка по умолчанию
    ],
    iconSize: 1,
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 180,
    right: 28,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 12,
    // Тень на Android
    elevation: 3,
    // Тень на iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  myLocationText: {
    color: '#000',
    fontWeight: '600',
  },
};

export default MapBoxMap;

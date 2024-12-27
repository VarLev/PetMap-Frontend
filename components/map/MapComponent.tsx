import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, BackHandler, ImageSourcePropType } from 'react-native';
import Mapbox, { MapView, UserLocation, Camera, PointAnnotation, ShapeSource, SymbolLayer, LineLayer } from '@rnmapbox/maps';
import mapStore from '@/stores/MapStore';
import { Provider } from 'react-native-paper';
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
import { IUserChat } from '@/dtos/Interfaces/user/IUserChat';

import i18n from '@/i18n';
import uiStore from '@/stores/UIStore';
import PermissionsRequestComponent from '../auth/PermissionsRequestComponent';
import WalkMarker from './markers/WalkMarker';
import PointMarker from './markers/PointMarker';
import { createGeoJSONFeatures } from '@/utils/mapUtils';


const MapBoxMap = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
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
  // ... существующие состояния и переменные
  const [routeData, setRouteData] = useState<any>(null);

  const [renderAdvrtForm, setRenderAdvrtForm] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);

  Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN!);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setHasPermission(uiStore.getLocationPermissionGranted());
      const fetchCity = async () => {
        if (userCoordinates) {
          try {
            if (userStore.getCurrentUserCity() === '') {
              const city = await mapStore.getUserCity(userCoordinates);
              userStore.setCurrentUserCity(city);
              await mapStore.setWalkAdvrts();
            }
            mapStore.setCity(userStore.getCurrentUserCity());
            console.log('Город успешно получен для координат:', mapStore.getCity());
          } catch (error) {
            console.error('Ошибка при получении города:', error);
          }
        } else {
          userStore.setCurrentUserCity('Buenos Aires');
          mapStore.setCity('Buenos Aires');
          await mapStore.setWalkAdvrts();
        }
      };

      const fetchData = async () => {
        const data = createGeoJSONFeatures(mapStore.walkAdvrts, mapStore.mapPoints);
        setGeoJSONData(data);
      };
      
      await fetchCity();
      await fetchData();
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  // --- Периодический опрос при фокусе экрана ---
  useFocusEffect(
    useCallback(() => {
      if(currentPointType === MapPointType.Walk) {
        const intervalId = setInterval(async () => {
          try {
            await mapStore.setWalkAdvrts(); 
            const data = createGeoJSONFeatures(mapStore.walkAdvrts, mapStore.mapPoints);
            setGeoJSONData(data);
            console.log('Walk advrts updated');
            console.log(currentPointType);
          } catch (err) {
            console.error(err);
          }
        }, 180_000); 
  
        // Возвращаем колбэк очистки
        return () => {
          
          clearInterval(intervalId);
        };
      }
     
    }, [currentPointType])
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

  const handleAddressChange = (text: string) => {
    mapStore.setAddress(text);
    mapStore.fetchSuggestions(text);
  };

  const handlePress = (event: any) => {
    console.log('Long press detected');
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

  const onPinPress = async (advrt: IWalkAdvrtDto) => {
    cameraRef.current?.setCamera({
      centerCoordinate: [advrt.longitude!, advrt.latitude!],
      animationDuration: 300,
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

  const handleChatInvite = async (otherUser: IUserChat) => {
    try {
      sheetRef.current?.close();
      console.log('Chat invite:', otherUser);
      const chatId = await chatStore.createNewChat(otherUser);
      await chatStore.sendInviteMessage(chatId!, otherUser);
      console.log('Chat created:', chatId);
      if (chatId) {
        const encodedAvatarUrl = otherUser.thumbnailUrl ? btoa(otherUser.thumbnailUrl) : '';
        router.push({
          pathname: '/chat/[chatId]',
          params: {
            chatId: chatId,
            otherUserId: otherUser.id,
            otherUserName: otherUser.name,
            avatarUrl: encodedAvatarUrl,
          },
        });
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

  const handleSearchTextChange = () => {};

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

  return (
    <Provider>
      <PermissionsRequestComponent />
      
        {isCardView && (
          <SlidingOverlay visible={isCardView}>
            <MapItemList renderType={currentPointType} />
          </SlidingOverlay>
        )}
        {!isLoading && (
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
            {hasPermission && <UserLocation minDisplacement={50} ref={userLocationRef} onUpdate={handleUserLocationUpdate} />}
            {routeData && (
              <ShapeSource id="routeSource" shape={routeData}>
                <LineLayer id="routeLine" style={{ lineColor: 'blue', lineWidth: 5 }} />
              </ShapeSource>
            )}

            {/* <UserLocation minDisplacement={10} ref={userLocationRef}  /> */}
            {userCoordinates && <Camera ref={cameraRef} centerCoordinate={userCoordinates} zoomLevel={10} animationDuration={1} />}

            {/* Добавдяем цифры, когда маркеры накладываются друг на друга */}
            {!isCardView && geoJSONData && (
              <ShapeSource id="points" shape={geoJSONData} cluster clusterRadius={38}>
                <SymbolLayer id="clusteredPoints" filter={['has', 'point_count']} style={styles.clusterStyle} />
              </ShapeSource>
            )}

            {/* *** Маркер прогулок *** */}
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


            {/* Маркеры поинтов */}
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

            {/* Добавляем компонент точек интереса */}
            {userCoordinates && uiStore.getLocationPermissionGranted() && (
              <PointsOfInterestComponent userLocation={userCoordinates} onRouteReady={handleRouteReady} />
            )}
            {!isSheetVisible && (
              <FabGroupComponent selectedNumber={currentPointType} setSelectedNumber={hangleSetSelectedNumberPoint} isVisible={!isCardView} />
            )}
          </MapView>
        )}

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
          />
        </View>

        {isSheetVisible && (
          <BottomSheetComponent
            ref={sheetRef}
            snapPoints={renderAdvrtForm ? ['60%', '100%'] : ['60%', '100%']}
            renderContent={renderContent as any}
            onClose={handleSheetClose} // Обработчик для события закрытия BottomSheet
            enablePanDownToClose={true}
            initialIndex={0} // Начальная позиция - 60%
            usePortal={true} // Используем Portal для отображения BottomSheet
          />
        )}
        <CustomAlert
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          message={alertText}
          type={alertType}
          title={alertType === 'error' ? 'Error' : ''}
          image={alertImage}
        />

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
};

export default MapBoxMap;

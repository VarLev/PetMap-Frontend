import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, SafeAreaView, Alert, Image, Pressable, Text } from 'react-native';
import Mapbox, { MapView, UserLocation, Camera, PointAnnotation } from '@rnmapbox/maps';
import mapStore from '@/stores/MapStore';
import {  Icon, Provider  } from 'react-native-paper';
// eslint-disable-next-line import/no-unresolved
import { MAPBOX_ACCESS_TOKEN } from '@env';
import BottomSheetComponent from '@/components/common/BottomSheetComponent'; // Импортируйте новый компонент

import BottomSheet from '@gorhom/bottom-sheet';
import AdvtComponent from './AdvtComponent';
import userStore from '@/stores/UserStore';
import chatStore from '@/stores/ChatStore';
import AdvtEditComponent from './AdvtEditComponent';
import { IWalkAdvrtDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtDto';
import { router } from 'expo-router';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import Svg, { Path } from 'react-native-svg';
import { useDrawer } from '@/contexts/DrawerProvider';
import MapPointComonent from './MapPointComonent';
import SearchAndTags from '../custom/inputs/FilterSearchAndTagsComponent';
import FilterComponent from '../filter/FilterComponent';
import { IPointEntityDTO } from '@/dtos/Interfaces/map/IPointEntityDTO';
import { MapPointType } from '@/dtos/enum/MapPointType';
import FabGroupComponent from './FabGroupComponent';
import EditDangerPoint from './point/EditDangerPoint';
import { DANGERTYPE_TAGS } from '@/constants/Strings';
import { IPointDangerDTO } from '@/dtos/Interfaces/map/IPointDangerDTO';
import { DangerLevel } from '@/dtos/enum/DangerLevel';
import { DangerType } from '@/dtos/enum/DangerType';
import { MapPointStatus } from '@/dtos/enum/MapPointStatus';
import * as Crypto from "expo-crypto";
import IconSelectorComponent from '../custom/icons/IconSelectorComponent';
import { BG_COLORS } from '@/constants/Colors';
import ViewDangerPoint from './point/ViewDangerPoint';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

const MapBoxMap = observer(() => {

  const sheetRef = useRef<BottomSheet>(null);
  const cameraRef = useRef<Camera>(null);
  const mapRef = useRef<Mapbox.MapView>(null);
  const userLocationRef = useRef<UserLocation>(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [renderContent, setRenderContent] = useState<ReactNode>(() => null);
  const [markerCoordinate, setMarkerCoordinate] = useState<[number, number] | null>(null);
  const [markerPointCoordinate, setMarkerPointCoordinate] = useState<[number, number] | null>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const pointAnnotationCurrentUser = useRef<PointAnnotation>(null);
  const { openDrawer } = useDrawer();
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string >('');
  const [userCoordinates, setUserCoordinates] = useState([0,0]);
  const currentUser = userStore.currentUser;
  const [modifiedFieldsCount, setModifiedFieldsCount] = useState(0);
  const [currentPointType, setCurrentPointType] = useState(8);

  useEffect(() => {
    (async () => {
      const granted = await Mapbox.requestAndroidLocationPermissions();
      if (!granted) {
        Alert.alert('Permission to access location was denied');
      }
      await mapStore.setWalkAdvrts();
      
    })();
    setUserCoordinates([-34.6037,-58.3816]);
    
  }, []);

  const handleFilterChange = (count: number) => {
    setModifiedFieldsCount(count);
  };

  const handleAddressChange = (text: string) => {
    mapStore.setAddress(text);
    mapStore.fetchSuggestions(text);
  };

  const handleLongPress = (event: any) => {

    const coordinates = event.geometry.coordinates;
    
    cameraRef.current?.setCamera({
      centerCoordinate: coordinates,
      animationDuration: 200,
      padding: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 350
      }
    })

    if(currentPointType === MapPointType.Walk){
      setMarkerCoordinate(coordinates);
      mapStore.setMarker(coordinates);
      setRenderContent(() => (
        <AdvtEditComponent coordinates={coordinates} onAdvrtAddedInvite={handleAdvrtAdded}  />
      ));
    }
    else if(currentPointType === MapPointType.Danger){ 

      const mapPoint: IPointDangerDTO = {
        dangerLevel: DangerLevel.Low,
        dangerType: DangerType.Other,
        availableHours: 0,
        id: Crypto.randomUUID(),
        mapPointType: MapPointType.Danger,
        status: MapPointStatus.InMap,
        latitude: coordinates[1],
        longitude: coordinates[0],
        createdAt: new Date().toISOString(),
        photos: [],
        userId: currentUser?.id ,
      };

      setMarkerPointCoordinate(coordinates);
      mapStore.setMarker(coordinates);
      setRenderContent(() => (
        <EditDangerPoint mapPoint={mapPoint} onClose={handleSheetClose} />
      ));
    }
    if (!isSheetExpanded) {
      setTimeout(() => {
        sheetRef.current?.snapToIndex(0);
        mapStore.setBottomSheetVisible(true);
        
        setIsSheetVisible(true);
      }, 200)
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
        paddingBottom: 400
      }
    })
    setRenderContent(() => (
      <AdvtComponent advrt={advrt} onInvite={handleChatInvite} onClose={handleSheetClose} />
    ));
    if (!isSheetExpanded) {
      setTimeout(() => {
        sheetRef.current?.snapToIndex(0); // Позиция 60% в snapPoints
        mapStore.setBottomSheetVisible(true);
        setIsSheetVisible(true);
      }, 200);
    }
  };

  const onMapPointPress = async (mapPoint: IPointEntityDTO ) => {
    cameraRef.current?.setCamera({
      centerCoordinate: [ mapPoint.longitude!, mapPoint.latitude!],
      animationDuration: 300,
      padding: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 400
      }
    })
    console.log('mapPoint', mapStore.mapPoints );
    if(mapPoint.mapPointType === MapPointType.Park){
      setRenderContent(() => (
        <MapPointComonent mapPoint={mapPoint} onInvite={handleChatInvite} onClose={handleSheetClose} />
      ));
    }
    else if(mapPoint.mapPointType === MapPointType.Danger){
      const pointDanger = mapPoint as IPointDangerDTO;
      console.log('pointDanger', pointDanger);
      setRenderContent(() => (
        <ViewDangerPoint mapPoint={pointDanger} />
      ));
    }
   
    if (!isSheetExpanded) {
      setTimeout(() => {
        sheetRef.current?.snapToIndex(0); // Позиция 60% в snapPoints
        mapStore.setBottomSheetVisible(true);
        setIsSheetVisible(true);
      }, 200);
    }
  };

  const handleChatInvite = async (otherUser: IUser) => {
    try {
      sheetRef.current?.close();
      const chatId = await chatStore.createNewChat(otherUser);
      if (chatId) {
        router.push(`/chat/${chatId}`);
      }
    } catch (error) {
      console.error("Ошибка при создании чата:", error);
    }
  };

  const handleAdvrtAdded=()=>{
    sheetRef.current?.close();
  }

  const handleSheetClose = () => {
    sheetRef.current?.close();
    mapStore.setBottomSheetVisible(false);
    setMarkerCoordinate(null);
    setIsSheetVisible(false);
    setIsSheetExpanded(false);
  };

  const handleSheetChange = (index: number) => {
    if (index === 1) {
      setIsSheetExpanded(true);
    } else {
      setIsSheetExpanded(false);
    }
  };

  const handleSearchTextChange = () => {
   
  };

  const tagSelected = async (type: number) => {
    if(type === MapPointType.Walk) 
      await mapStore.setWalkAdvrts();
    else
      await mapStore.getMapPointsByType(type);

  }

  const handleOpenFilter = () => {
    openDrawer(<FilterComponent onFilterChange={handleFilterChange}/>);
  }

  const handleUserLocationUpdate = (location: Mapbox.Location) => {
    const { coords } = location;
    if (coords) {
      // Сохранение координат пользователя
      mapStore.currentUserCoordinates = [coords.latitude, coords.longitude];
      setUserCoordinates([coords.latitude, coords.longitude]);
      console.log('User coordinates:', coords.latitude, coords.longitude);
    }
  };

  
  return (
    <Provider>
      <SafeAreaView style={{ flex: 1 }}>
        <MapView ref={mapRef} style={{ flex: 1 }} onLongPress={handleLongPress} styleURL={Mapbox.StyleURL.Light}>
          {/* <UserLocation minDisplacement={10} ref={userLocationRef} onUpdate={handleUserLocationUpdate} /> */}
          <UserLocation minDisplacement={10} ref={userLocationRef}  />
          <Camera
            ref={cameraRef}
            centerCoordinate={userCoordinates.reverse()}
            zoomLevel={10}
            animationDuration={1}
          />
          
           {mapStore.walkAdvrts.map((advrt, index) => (
            <Mapbox.MarkerView 
              key={`advrt-${advrt.id}`} 
              id={`advrt-${index}`}
              coordinate={[advrt.longitude!, advrt.latitude!]}
              anchor={{ x: 0.5, y: 1}}
              onTouchStart={() => onPinPress(advrt)}
              allowOverlap={true}
            >
              <Pressable onPress={() => onPinPress(advrt)} onLongPress={() => console.log('Long press detected')}>
                <View>
                  <Svg width="43" height="55" viewBox="0 0 43 55" fill="none">
                  <Path d="M21.4481 54.8119C21.4481 54.8119 42.8963 35.7469 42.8963 21.4481C42.8963 9.60265 33.2936 0 21.4481 0C9.60265 0 0 9.60265 0 21.4481C0 35.7469 21.4481 54.8119 21.4481 54.8119Z" fill="#BFA8FF"/>
                  </Svg>
                  <Image className='ml-[3.5px] mt-[3px] rounded-full h-9 w-9 absolute'
                    source={{ uri: advrt?.userPhoto|| 'https://via.placeholder.com/100' }}
                  />
                </View>
              </Pressable>
            </Mapbox.MarkerView>  
          ))} 

          {mapStore.mapPoints.map((point, index) => (
            <Mapbox.MarkerView 
              key={`advrt-${point.id}`} 
              id={`advrt-${index}`}
              anchor={{ x: 0.5, y: 1}}
              coordinate={[point.longitude!, point.latitude!]}
              onTouchStart={() => {}}
              allowOverlap={false}
            >  
              <Pressable onPress={() => onMapPointPress(point as IPointDangerDTO)}>
                <View >
                  <Image className=' h-[31px] w-6'
                    source={{ uri:'https://firebasestorage.googleapis.com/v0/b/petmeetar.appspot.com/o/assets%2Fimages%2Fmap%2FpointIcons%2Ftree.png?alt=media&token=8db7b0c4-ec94-46dc-b25f-fa00cab60277' }}
                  />
                </View>
              </Pressable>
            </Mapbox.MarkerView>  
          ))}
          
          {markerCoordinate && isSheetVisible && (
            <PointAnnotation
              ref={pointAnnotationCurrentUser}
              id='currentUserMarker'
              coordinate={markerCoordinate}
              anchor={{ x: 0.5, y: 0.5}}
            >
              <View >
                <Image className='rounded-full h-10 w-10'
                  source={{ uri: currentUser?.thumbnailUrl|| 'https://via.placeholder.com/100' }}
                  onLoad={() => pointAnnotationCurrentUser.current?.refresh()}
                  fadeDuration={0}
                />
              </View>
            </PointAnnotation>
          )}
          {markerPointCoordinate && isSheetVisible && (
            <PointAnnotation
              ref={pointAnnotationCurrentUser}
              id='currentUserMarker'
              coordinate={markerPointCoordinate}
              anchor={{ x: 0.5, y: 0.5}}
            >
              <View className='bg-rose-500 rounded-full h-6 w-6'>
                <IconSelectorComponent
                  iconName='alert-octagram-outline'
                  iconSet='MaterialCommunityIcons'
                  size={24}
                  color='white' 
                /> 
              </View>
            </PointAnnotation>
          )}
        </MapView>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 10}}>
          <SearchAndTags
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            onSearchTextChange={handleSearchTextChange}
            onTagSelected={tagSelected}
            onOpenFilter={handleOpenFilter}
            badgeCount={modifiedFieldsCount}
          />    
        </View>
        {/* <View style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 10,paddingRight:60, flexDirection: 'row' }}>
          <TextInput
            className='bg-white h-12 rounded-xl mt-1 pl-3 w-full border border-gray-400'
            placeholder="Enter address"
            value={mapStore.address}
            onChangeText={handleAddressChange}
          />
            <IconButton size={30} icon="filter-variant" onPress={openDrawer} iconColor='#2F00B6'/>
        </View> 
        */}
       
        {isSheetVisible && (
          <BottomSheetComponent
            ref={sheetRef}
            snapPoints={['60%','100%']}
            renderContent={() => renderContent}
            onClose={handleSheetClose} // Обработчик для события закрытия BottomSheet
            enablePanDownToClose={true}
            initialIndex={0} // Начальная позиция - 60%
              // Добавляем обработчик изменения позиции
          />
        )}
        {!isSheetVisible && 
          <FabGroupComponent selectedNumber={currentPointType} setSelectedNumber={setCurrentPointType}  />
        }  
      </SafeAreaView>
    </Provider>
  );
});

export default MapBoxMap;

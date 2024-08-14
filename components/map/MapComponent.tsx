import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TextInput, SafeAreaView, Alert,Image } from 'react-native';
import Mapbox, { MapView, UserLocation, Camera, PointAnnotation  } from '@rnmapbox/maps';
import mapStore from '@/stores/MapStore';
import { FAB, Portal, Provider } from 'react-native-paper';
// eslint-disable-next-line import/no-unresolved
import { MAPBOX_ACCESS_TOKEN } from '@env';
import BottomSheetComponent from '@/components/common/BottomSheetComponent'; // Импортируйте новый компонент
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from '@gorhom/bottom-sheet';
import AdvtComponent from './AdvtComponent';
import userStore from '@/stores/UserStore';
import chatStore from '@/stores/ChatStore';
import AdvtEditComponent from './AdvtEditComponent';
import { IWalkAdvrtDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtDto';
import { router } from 'expo-router';
import { IUser } from '@/dtos/Interfaces/user/IUser';
//import FastImage from 'react-native-fast-image';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

const MapBoxMap = observer(() => {
  const sheetRef = useRef<BottomSheet>(null);
  const cameraRef = useRef<Camera>(null);
  const mapRef = useRef<Mapbox.MapView>(null);
  const [fabOpen, setFabOpen] = useState(false);
  // const [fabVisible, setFabVisible] = useState(true);
  // const [avatarImages, setAvatarImages] = useState<Record<string, { uri: string }>>({});
  const [renderContent, setRenderContent] = useState<ReactNode>(() => null);
  const [markerCoordinate, setMarkerCoordinate] = useState<[number, number] | null>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const pointAnnotation = useRef<PointAnnotation>(null);
  const pointAnnotationCurrentUser = useRef<PointAnnotation>(null);
  const currentUser = userStore.currentUser;



  useEffect(() => {
    (async () => {
      const granted = await Mapbox.requestAndroidLocationPermissions();
      if (!granted) {
        Alert.alert('Permission to access location was denied');
      }
      await mapStore.setWalkAdvrts();
    })();
  }, []);

  const handleAddressChange = (text: string) => {
    mapStore.setAddress(text);
    mapStore.fetchSuggestions(text);
  };

  const handleLongPress = (event: any) => {
    const coordinates = event.geometry.coordinates;
    cameraRef.current?.setCamera({
      centerCoordinate: coordinates,
      
      animationDuration: 300,
      padding: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 500
      }
    })
    setMarkerCoordinate(coordinates);
    mapStore.setMarker(coordinates);
    
    
    setRenderContent(() => (
      <AdvtEditComponent coordinates={coordinates} onAdvrtAddedInvite={handleAdvrtAdded}  />
    ));
   
    setTimeout(() => {
      mapStore.setBottomSheetVisible(true);
      sheetRef.current?.expand();
      setIsSheetVisible(true);
    }, 200);
  };

  const onPinPress = async (advrt: IWalkAdvrtDto) => {
    
    cameraRef.current?.setCamera({
      centerCoordinate: [advrt.latitude!, advrt.longitude!],
      animationDuration: 300,
      padding: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 500
      }
    })
    setRenderContent(() => (
      <AdvtComponent advrt={advrt} onInvite={handleChatInvite}/>
    ));
    setTimeout(() => {
      mapStore.setBottomSheetVisible(true);
      sheetRef.current?.expand();
      setIsSheetVisible(true);
    }, 200);
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
    mapStore.setBottomSheetVisible(false);
    setMarkerCoordinate(null);
    setIsSheetVisible(false);
  };
  
  return (
    <Provider>
      <SafeAreaView style={{ flex: 1 }}>
        <TextInput
          style={{ borderRadius: 15, padding: 12, borderColor: '#ccc', height: 56, width: '100%', backgroundColor: 'white' }}
          placeholder="Enter address"
          value={mapStore.address}
          onChangeText={handleAddressChange}
        />
        <MapView ref={mapRef} style={{ flex: 1 }} onLongPress={handleLongPress} styleURL={Mapbox.StyleURL.Light}>
          <Camera
            ref={cameraRef}
            centerCoordinate={[mapStore.region.longitude, mapStore.region.latitude]}
            zoomLevel={16}
            animationMode={'flyTo'}
            animationDuration={2000}
          />
          <UserLocation minDisplacement={10} />
            
           {mapStore.walkAdvrts.map((advrt, index) => (
            <PointAnnotation
              ref={pointAnnotation}
              key={`advrt-${advrt.id}`} 
              id={`advrt-${index}`}
              coordinate={[advrt.latitude!, advrt.longitude!]}
              onSelected={() => onPinPress(advrt)}
              anchor={{ x: 0.5, y: 0.5}}
              >
              <View>
                <Image className='rounded-full h-10 w-10'
                  source={{ uri: advrt?.userPhoto|| 'https://via.placeholder.com/100' }}
                  onLoad={() => pointAnnotation.current?.refresh()}
                  fadeDuration={0}
                />
              </View>
            </PointAnnotation>
           ))}
          {markerCoordinate && isSheetVisible && (
            <PointAnnotation
              ref={pointAnnotationCurrentUser}
              id='currentUserMarker'
              coordinate={markerCoordinate}
              anchor={{ x: 0.5, y: 0.5}}>
            <View >
              <Image className='rounded-full h-10 w-10'
                source={{ uri: currentUser?.thumbnailUrl|| 'https://via.placeholder.com/100' }}
                onLoad={() => pointAnnotationCurrentUser.current?.refresh()}
                fadeDuration={0}
              />
            </View>
          </PointAnnotation>
          )}
         
        </MapView>

        {isSheetVisible && (
        
          <BottomSheetComponent
            ref={sheetRef}
            snapPoints={['60%','100%']}
            renderContent={() => renderContent}
            onClose={handleSheetClose} // Обработчик для события закрытия BottomSheet
          />

        )}
        {!isSheetVisible && <Portal>
          <FAB.Group
            style={{ paddingBottom: 100 }} 
            open={fabOpen}
            visible={true}
            icon={fabOpen ? 'close' : 'plus'}
            actions={[
              { icon: 'walk', label: 'Прогулка', onPress: () => console.log('Pressed Прогулка') },
              { icon: () => <MaterialCommunityIcons name="map-marker" size={24} color="white" />, label: 'Личная заметка', onPress: () => console.log('Pressed Личная заметка') },
              { icon: 'note-multiple', label: 'Публичная заметка', onPress: () => console.log('Pressed Публичная заметка') },
              { icon: 'alert', label: 'Опасность', onPress: () => console.log('Pressed Опасность') },
            ]}
            onStateChange={({ open }) => setFabOpen(open)}
            onPress={() => {
              if (fabOpen) {
                // Do something if the FAB is open
              }
            }}
          />
        </Portal> } 
      </SafeAreaView>
    </Provider>
  );
});



export default MapBoxMap;

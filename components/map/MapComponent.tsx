import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TextInput, FlatList, TouchableOpacity, Text, SafeAreaView, StyleSheet, Button } from 'react-native';
import Mapbox, { MapView, UserLocation, Camera, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import mapStore from '@/stores/MapStore';
import { FAB, Portal, Provider } from 'react-native-paper';
// eslint-disable-next-line import/no-unresolved
import { MAPBOX_ACCESS_TOKEN } from '@env';
import BottomSheetComponent from '@/components/common/BottomSheetComponent'; // Импортируйте новый компонент
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import pinIcon from '../../assets/images/pin.png';
import BottomSheet from '@gorhom/bottom-sheet';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

const MapBoxMap = observer(() => {
  const sheetRef = useRef<BottomSheet>(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [fabVisible, setFabVisible] = useState(true);

  const handleAddressChange = (text: string) => {
    mapStore.setAddress(text);
    mapStore.fetchSuggestions(text);
  };

  const handleLongPress = (event: any) => {
    const coordinates = event.geometry.coordinates;
    mapStore.setMarker(coordinates);
    sheetRef.current?.expand();
  };

  const onPinPress = (e: { features: any[] }) => {
    if (mapStore.selectedFeature) {
      mapStore.setSelectedFeature(null);
      return;
    }
    const feature = e?.features[0];
    mapStore.setSelectedFeature(feature);
  };

  const renderContent = () => (
    <View style={styles.bottomSheet}>
      <Text>Форма для заполнения</Text>
      <TextInput placeholder="Введите данные" style={styles.input} />
      <Button title="Сохранить" onPress={() => sheetRef.current?.close()} />
    </View>
  );

  return (
    <Provider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ position: 'absolute', zIndex: 20, paddingTop: 3, paddingLeft: 4, paddingRight: 4, width: '100%', backgroundColor: 'transparent' }}>
          <TextInput
            style={{ borderRadius: 15, padding: 12, borderColor: '#ccc', height: 56, width: '100%', backgroundColor: 'white' }}
            placeholder="Enter address"
            value={mapStore.address}
            onChangeText={handleAddressChange}
          />
          {mapStore.suggestions.length > 0 && (
            <FlatList
              data={mapStore.suggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => mapStore.selectAddress(item)}>
                  <Text style={styles.suggestion}>{item.place_name}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
            />
          )}
        </View>

        <MapView style={{ flex: 1 }} onLongPress={handleLongPress}>
          <Camera
            centerCoordinate={[mapStore.region.longitude, mapStore.region.latitude]}
            zoomLevel={16}
            animationMode={'flyTo'}
            animationDuration={2000}
          />
          <UserLocation minDisplacement={10} />
          <Mapbox.Images images={{ 'pin-icon': pinIcon }} />
          {mapStore.marker && (
            <ShapeSource
              id="markerSource"
              shape={{
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: mapStore.marker,
                    },
                    properties: {
                      message: 'Hello!',
                    },
                  },
                ],
              }}
              onPress={onPinPress}
            >
              <SymbolLayer id="markerLayer" style={mapPinLayerStyle} />
            </ShapeSource>
          )}
        </MapView>

        <BottomSheetComponent
          ref={sheetRef}
          snapPoints={[1, '50%', '70%']}
          renderContent={renderContent}
        />

        <Portal>
          <FAB.Group
            style={{ paddingBottom: 100 }} 
            open={fabOpen}
            visible={fabVisible}
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
        </Portal>
      </SafeAreaView>
    </Provider>
  );
});

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
    zIndex: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  suggestionsList: {
    backgroundColor: 'white',
  },
  suggestion: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  marker: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  calloutContainerStyle: {
    backgroundColor: 'white',
    width: 60,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customCalloutText: {
    color: 'black',
    fontSize: 16,
  },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 16,
    height: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

const mapPinLayerStyle: any = {
  iconImage: 'pin-icon',  // Используем пользовательскую иконку
  iconAllowOverlap: true,  
  iconRotationAlignment: 'map',
  iconAnchor: 'bottom',
  iconSize: 0.05,
};

export default MapBoxMap;

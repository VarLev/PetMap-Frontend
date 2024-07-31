
import { makeAutoObservable } from 'mobx';
import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
import { MAPBOX_ACCESS_TOKEN } from '@env';

class MapStore {
  address = '';
  suggestions: any[] = [];
  region = {
    latitude: -34.603722,
    longitude: -58.381592,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  marker: [number, number] | null = null;
  selectedFeature: GeoJSON.Feature<GeoJSON.Point> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAddress(address: string) {
    this.address = address;
  }

  setSuggestions(suggestions: any[]) {
    this.suggestions = suggestions;
  }

  setRegion(region: { latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number }) {
    this.region = region;
  }

  setMarker(coordinates: [number, number]) {
    this.marker = coordinates;
  }

  setSelectedFeature(feature: GeoJSON.Feature<GeoJSON.Point> | null) {
    this.selectedFeature = feature;
  }

  async fetchSuggestions(text: string) {
    if (text.length > 2) {
      try {
        const country = "AR";
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?country=${country}&access_token=${MAPBOX_ACCESS_TOKEN}`
        );
        this.setSuggestions(response.data.features);
      } catch (error) {
        console.error(error);
      }
    } else {
      this.setSuggestions([]);
    }
  }

  selectAddress(place: any) {
    const { center, place_name } = place;
    this.setRegion({
      latitude: center[1],
      longitude: center[0],
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    this.setAddress(place_name);
    this.setSuggestions([]);
  }
}

const mapStore = new MapStore();
export default mapStore;

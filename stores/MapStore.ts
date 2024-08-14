
import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
import { MAPBOX_ACCESS_TOKEN } from '@env';
import { IWalkAdvrtDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtDto';
import apiClient from '@/hooks/axiosConfig';

class MapStore {
  address = '';
  advrtAddress = '';
  suggestions: any[] = [];
  region = {
    latitude: -34.603722,
    longitude: -58.381592,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  bottomSheetVisible = false;
  walkAdvrts: IWalkAdvrtDto[] = [];

  marker: [number, number] | null = null;
  selectedFeature: GeoJSON.Feature<GeoJSON.Point> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAddress(address: string) {
    this.address = address;
  }

  setAdvrtAddress(address: string) {
    this.advrtAddress = address;
  }

  setBottomSheetVisible(visible: boolean) {
    this.bottomSheetVisible = visible;
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

  async setWalkAdvrts() {
    if(this.walkAdvrts.length === 0) {
      const advrts = await this.getAllAdvrt();
      this.walkAdvrts = advrts;
      
    }
  }

  async addWalkAdvrt(walk : IWalkAdvrtDto) {
    try {
      const response = await apiClient.post('map/walk', walk);
      runInAction(() => {
        this.walkAdvrts.push(response.data as IWalkAdvrtDto);
      });
      

    } catch (error) {
      if (axios.isAxiosError(error)) 
        {
          // Подробная информация об ошибке Axios
          console.error('Axios error:', {
              message: error.message,
              name: error.name,
              //code: error.code,
              //config: error.config,
              response: error.response ? {
                  data: error.response.data.errors,
                  //status: error.response.status,
                  //headers: error.response.headers,
              } : null
          });
        } 
        else {
          // Общая информация об ошибке
          console.error('Error:', error);
        }
        throw error;
    }
  }

  async getAllAdvrt(): Promise<IWalkAdvrtDto[]> {
    try {
      const response = await apiClient.get('map/walk/all');
      return response.data as IWalkAdvrtDto[];
    } catch (error) {
      if (axios.isAxiosError(error)) 
        {
          // Подробная информация об ошибке Axios
          console.error('Axios error:', {
              message: error.message,
              name: error.name,
              code: error.code,
              config: error.config,
              response: error.response ? {
                  data: error.response.data,
                  status: error.response.status,
                  headers: error.response.headers,
              } : null
          });
        } 
        else {
          // Общая информация об ошибке
          console.error('Error:', error);
        }
        throw error;
    }
  }

  async fetchSuggestions(text: string) {
    if (text.length > 3) {
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

  async getStringAddressFromCoordinate( location:[ number, number] ) {
    try {
      const country = "AR";
      
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location[0]},${location[1]}.json?country=${country}&access_token=${MAPBOX_ACCESS_TOKEN}`
      );
      if (response.data.features && response.data.features.length > 0) {
        const address = response.data.features[0].place_name;
        this.setAdvrtAddress(address);
      } else {
        console.error("No address found for the provided coordinates.");
        this.setAdvrtAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address: ", error);
      this.setAddress("Error fetching address");
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

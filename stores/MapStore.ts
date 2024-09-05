
import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
import { MAPBOX_ACCESS_TOKEN } from '@env';
import { IWalkAdvrtDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtDto';
import { IMapPoint } from '@/dtos/Interfaces/map/IMapPoint';
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
  mapPoints: IMapPoint[] = [];

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
    try {
      const advrts = await this.getAllAdvrt();
      runInAction(() => {
        this.walkAdvrts = advrts;
      });
    } catch (error) {
      console.error("Error fetching walk advertisements:", error);
    }
  }

  async deleteWalkAdvrt(walkId : string) {
    try {
      const response = await apiClient.delete(`map/walk/${walkId}`);
      await this.setWalkAdvrts();
      // Проверяем статус ответа или используем данные ответа
      // if (response.status === 200) {
      //   runInAction(() => {
      //     this.walkAdvrts = this.walkAdvrts.filter(advrt => advrt.id !== walkId);
      //     console.log('Delete walk advrt', this.walkAdvrts.length);
      //   });
        
      // }
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

  async addWalkAdvrt(walk : IWalkAdvrtDto) {
    try {
      const response = await apiClient.post('map/walk', walk);
      runInAction(() => {
        this.walkAdvrts.push(response.data as IWalkAdvrtDto);
      });
      await this.setWalkAdvrts();
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

  async getStringAddressFromCoordinate(location: [number, number]) {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${location[0]}&latitude=${location[1]}&types=address&access_token=${MAPBOX_ACCESS_TOKEN}`
      );
  
      if (response.data.features && response.data.features.length > 0) {
        const feature = response.data.features[0];
        const context = feature.properties.context;
  
        // Извлекаем необходимые компоненты
        const streetName = context.street?.name || '';
        const addressNumber = context.address?.address_number || '';
        const neighborhood = context.neighborhood?.name || '';
        const city = context.place?.name || '';
        const region = context.region?.name || '';
  
        // Формируем сокращенный адрес
        let address = `${streetName} ${addressNumber}`;
        if (neighborhood) {
          address += `, ${neighborhood}`;
        }
        if (city) {
          address += `, ${city}`;
        }
        if (region && region !== city) {
          address += `, ${region}`;
        }
  
        this.setAdvrtAddress(address);
      } else {
        console.error("No address found for the provided coordinates.");
        this.setAdvrtAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address: ", error);
      this.setAdvrtAddress("Error fetching address");
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

  async getAllMapPoints(){
    try {
      const response = await apiClient.get('map/point/all/2');
      runInAction(() => {
        this.mapPoints = response.data as IMapPoint[];
      });
    } catch (error) {
      console.error('Error fetching map points:', error);
    }
  }
}

const mapStore = new MapStore();
export default mapStore;

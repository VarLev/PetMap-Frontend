
import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
//import { MAPBOX_ACCESS_TOKEN } from '@env';
import { IWalkAdvrtDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtDto';
import apiClient from '@/hooks/axiosConfig';
import { IWalkAdvrtFilterParams } from '@/dtos/Interfaces/filter/IWalkAdvrtFilterParams';
import { IPointDangerDTO } from '@/dtos/Interfaces/map/IPointDangerDTO';
import { IPointEntityDTO } from '@/dtos/Interfaces/map/IPointEntityDTO';
import { IPointParkDTO } from '@/dtos/Interfaces/map/IPointParkDTO';
import { MapPointType } from '@/dtos/enum/MapPointType';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebaseConfig';
import { IPointUserDTO } from '@/dtos/Interfaces/map/IPointUserDTO';
import { IUserAdvrt } from '@/dtos/Interfaces/user/IUserAdvrt';
import { IPagedAdvrtDto } from '@/dtos/Interfaces/advrt/IPagedAdvrtDto';
import { handleAxiosError } from '@/utils/axiosUtils';
import { PARK_IMAGE } from '@/constants/Strings';
import { IPagedPointDangerDTO } from '@/dtos/Interfaces/map/paged/IPagedPointDangerDTO';
import { IPagetPointUserDTO } from '@/dtos/Interfaces/map/paged/IPagetPointUserDTO';
import { ReviewDTO } from '@/dtos/classes/review/Review';

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
  mapPoints: IPointEntityDTO[] = [];
  currentUserCoordinates: [number, number] = [0,0];
  currentWalkId: string | undefined = undefined;
  currentWalkDate: Date | undefined = undefined; //mine
  
  isAvaliableToCreateWalk = true; // Переменная для проверки возможности создания прогулки
  
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
        this.mapPoints = [];
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
      const response = await apiClient.get('walkadvrt/walk/all');
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
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?country=${country}&access_token=${process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN}`
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
        `https://api.mapbox.com/search/geocode/v6/reverse?&longitude=${location[0]}&latitude=${location[1]}&types=address&access_token=${process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN}`
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
        this.isAvaliableToCreateWalk = true;
      } else {
        console.error("No address found for the provided coordinates.");
        this.setAdvrtAddress("Address not found");
        this.isAvaliableToCreateWalk = false;
      }
    } catch (error) {
      console.error("Error fetching address: ", error);
      this.setAdvrtAddress("Error fetching address");
      this.isAvaliableToCreateWalk = false;
    }
  }

  selectAddress(place: any) {
    const { center, place_name } = place;
    this.setRegion({
      latitude: center[0],
      longitude: center[1],
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    this.setAddress(place_name);
    this.setSuggestions([]);
  }

  
  async getMapPointsByType(filter: number){
    try {
      const response = await apiClient.get(`filter/point/all/${filter}`);
      if (response.data.length === 0) {
        console.log('No map points found');
        runInAction(() => {
          this.mapPoints = response.data as IPointEntityDTO[];
        });
      }else{
        if(filter === MapPointType.Danger){
          runInAction(() => {
            this.walkAdvrts = [];
            this.mapPoints = response.data as IPointDangerDTO[];
          });
        }
        else if(filter === MapPointType.Park){
          runInAction(() => {
            this.walkAdvrts = [];
            this.mapPoints = response.data as IPointParkDTO[];
          });
        }else{
          runInAction(() => {
            this.walkAdvrts = [];
            this.mapPoints = response.data as IPointEntityDTO[];
          });
        }
        
      }
      
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

  async getFilteredWalks(filter: IWalkAdvrtFilterParams){
    try {
      const response = await apiClient.post('filter/walks-filtered',filter );

      runInAction(() => {
        this.walkAdvrts = response.data as IWalkAdvrtDto[]; 
      });
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
                data: error.response.data.errors,
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

  async getPagenatedPointItems(type: MapPointType,page: number, pageSize: number): Promise<IPagedAdvrtDto | IPagedPointDangerDTO | IPagetPointUserDTO> {
    try {
      const response = await apiClient.get(`map/get-points-paginated?type=${type}&page=${page}&pageSize=${pageSize}`);
      return response.data;
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
                data: error.response.data.errors,
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

  async addPoint(point: IPointEntityDTO){
    try {
      if(point.mapPointType === MapPointType.Danger){
        const response = await apiClient.post('map/add-point-danger', point);
        runInAction(() => {
          this.mapPoints.push(response.data as IPointDangerDTO);
        });
      }
      else {
        const response = await apiClient.post('map/add-point-user', point);
        if(response.data){
          runInAction(() => {
            this.mapPoints.push(response.data as IPointUserDTO);
          });
        }
       
      }
      
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
                data: error.response.data.errors,
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

  async uploaPiontThumbnailImage(point: IPointEntityDTO, pointType: MapPointType): Promise<string|undefined> {
    if(pointType === MapPointType.Danger){
      if(!(point as IPointDangerDTO).thumbnailUrl) return;
      return this.uploadImage((point as IPointDangerDTO).thumbnailUrl!,`points/dangers/${point.id}/thumbnail`)
    }
    else if(pointType === MapPointType.Park){
      
    }
    else if(pointType === MapPointType.UsersCustomPoint){
      if(!(point as IPointUserDTO).thumbnailUrl) return;
      return this.uploadImage((point as IPointUserDTO).thumbnailUrl!,`points/users/${point.id}/thumbnail`)
    }
  }

  async uploadImage(image:string, pathToSave:string): Promise<string|undefined> {
    if (!image) return;
   
    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = ref(storage, `${pathToSave}`);

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  async requestDownloadURL(image:string): Promise<string|undefined> {
    if (!image) return;
   
    const storageRef = ref(storage, `${image}`);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }

  async requestJoinWalk(walkId: string, userId: string) {
    try {
      console.log('Request join walk', walkId, userId);
      const response = await apiClient.post(`walkadvrt/join/${walkId}`, {
        userId: userId // Передаем как объект
      } );
      return response.data;
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
                data: error.response.data.errors,
                status: error.response.status,
                headers: error.response.headers,
            } : null
        });
      } 
      else {
        // Общая информация об ошибке
        console.error('Error:', error);
      }
    }
  }

  async getAllWalkParticipants(walkId: string): Promise<IUserAdvrt[]> {
    try {
      console.log('Get all walk participants', walkId);
      const response = await apiClient.get(`walkadvrt/participants/${walkId}`);
      console.log('Participants:', response.data);
      return response.data as IUserAdvrt[];
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
                data: error.response.data.errors,
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

  async getMapPointById(pointId: string, pointType:MapPointType): Promise<IPointEntityDTO> {
    try {
      const response = await apiClient.get(`filter/point/${pointId}`);
      if(pointType === MapPointType.Danger){
        return response.data as IPointDangerDTO;
      }
      else if(pointType === MapPointType.Park){
        return response.data as IPointParkDTO;
      }
      else if(pointType === MapPointType.UsersCustomPoint){
        return response.data as IPointUserDTO;
      }
      else{
        return response.data as IPointEntityDTO;
      }
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async fetchPointImageUrl(path:string) {
    try {
      const storageRef = ref(storage, `${path}`);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch {
      const storageRef = ref(storage, `${PARK_IMAGE}`);
      return await getDownloadURL(storageRef);
    }
  };

  async addReview(review: ReviewDTO) {
    try {
    await apiClient.post('map/add-point-review', review);
      
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
                data: error.response.data.errors,
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

  async getReviewsByPointId(pointId: string): Promise<ReviewDTO[]> {
    try {
      const response = await apiClient.get(`map/reviews/${pointId}`);
      return response.data as ReviewDTO[];
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
                data: error.response.data.errors,
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
}

const mapStore = new MapStore();
export default mapStore;

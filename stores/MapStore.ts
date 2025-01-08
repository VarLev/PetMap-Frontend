
import { get, makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
//import { MAPBOX_ACCESS_TOKEN } from '@env';
import { IWalkAdvrtDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtDto';
import apiClient from '@/hooks/axiosConfig';
import { IWalkAdvrtFilterParams } from '@/dtos/Interfaces/filter/IWalkAdvrtFilterParams';
import { IPointDangerDTO, IPointDangerShortDTO } from '@/dtos/Interfaces/map/IPointDangerDTO';
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
import { IMapPointTagDTO } from '@/dtos/Interfaces/map/IMapPointTagDTO';
import { IPOI } from '@/dtos/Interfaces/map/POI/IPOI';

class MapStore {
  address = '';
  advrtAddress = '';
  suggestions: any[] = [];
  bottomSheetVisible = false;
  walkAdvrts: IWalkAdvrtDto[] = [];
  mapPoints: IPointEntityDTO[] = [];
  currentUserCoordinates: [number, number] = [0,0];
  currentWalkId: string | undefined = undefined;
  currentWalkDate: Date | undefined = undefined; //mine
  pois: IPOI[] = [];
  city: string = '';
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

  setMarker(coordinates: [number, number]) {
    this.marker = coordinates;
  }

  setSelectedFeature(feature: GeoJSON.Feature<GeoJSON.Point> | null) {
    this.selectedFeature = feature;
  }

  setPoi(poi: IPOI[]) {
    this.pois = poi;
  }

  setCity(city: string) {
    this.city = city;
  }

  getCity() {
    return this.city;
  }

  getPoi() {
    return this.pois;
  }

  async fetchUserPOIs([latitude, longitude]: [number, number]): Promise<IPOI[]> {  
    try {
      const response = await apiClient.get('poi', {
        params: {
          longitude: latitude,
          latitude: longitude
        },
      });
      runInAction(() => {
        this.setPoi(response.data);
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async setWalkAdvrts() {
    try {
      const advrts = await this.getAllAdvrt(this.getCity());
      runInAction(() => {
        this.walkAdvrts = advrts;
        this.mapPoints = [];
      });
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async deleteWalkAdvrt(walkId : string) {
    try {
      await apiClient.delete(`map/walk/${walkId}`);
      await this.setWalkAdvrts();
      // Проверяем статус ответа или используем данные ответа
      // if (response.status === 200) {
      //   runInAction(() => {
      //     this.walkAdvrts = this.walkAdvrts.filter(advrt => advrt.id !== walkId);
      //     console.log('Delete walk advrt', this.walkAdvrts.length);
      //   });
        
      // }
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async getWalkAdvrtById(walkId: string): Promise<IWalkAdvrtDto> {
    try {
      const response = await apiClient.get(`walkadvrt/walk/${walkId}`);
      console.log('Get walk advrt by id', response.data);
      return response.data as IWalkAdvrtDto;
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async addWalkAdvrt(walk : IWalkAdvrtDto):Promise<boolean | undefined> {
    try {
      const response = await apiClient.post('map/walk', walk);
      let isJobAdded: boolean | undefined;
      runInAction(() => {
        console.log('Add walk advrt', response.data);
        this.walkAdvrts.push(response.data.walkAdvertisement as IWalkAdvrtDto);
        isJobAdded = response.data.isJobAdded;
      });
      await this.setWalkAdvrts();
      return isJobAdded;
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async getAllAdvrt(city: string): Promise<IWalkAdvrtDto[]> {
    try {
      const response = await apiClient.get(`walkadvrt/walk/all/${city}`);
      return response.data as IWalkAdvrtDto[];
    } catch (error) {
      return handleAxiosError(error);
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
        return handleAxiosError(error);
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
      this.isAvaliableToCreateWalk = false;
      return handleAxiosError(error);
    }
  }
  
  async getUserCity(location: [number, number]): Promise<[string, string] | undefined> {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/search/geocode/v6/reverse?&longitude=${location[0]}&latitude=${location[1]}&types=address&access_token=${process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      );
  
      if (response.data.features && response.data.features.length > 0) {
        const feature = response.data.features[0];
        const context = feature.properties.context;
  
        const country = context.country?.name || '';
        const city = context.place?.name || '';

        console.log('City:', city);
        this.setCity(city);
        
        
        return [country, city];
      } else {
        console.error("No address found for the provided coordinates.");
      }
    } catch (error) {
      return handleAxiosError(error);
    }
  }
  
  


  selectAddress(place: any) {
    const { center, place_name } = place;
    
    this.setAddress(place_name);
    this.setSuggestions([]);
  }

  
  async getMapPointsByType(pointTag: IMapPointTagDTO){
    try {

      const queryParams = new URLSearchParams({
        city: pointTag.city,
        type: pointTag.type?.toString() || '',
        userId: pointTag.userId?.toString() || ''
      }).toString();
      console.log('Query params:', queryParams);
      

      const response = await apiClient.get(`filter/point/all?${queryParams}`);
      if (response.data.length === 0) {
        console.log('No map points found');
        runInAction(() => {
          this.mapPoints = response.data as IPointEntityDTO[];
        });
      }else{
        if(pointTag.type === MapPointType.Danger){
          runInAction(() => {
            this.walkAdvrts = [];
            this.mapPoints = response.data as IPointDangerShortDTO[];
          });
        }
        else if(pointTag.type === MapPointType.Park){
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
      return handleAxiosError(error);
    }
  }

  async getFilteredWalks(filter: IWalkAdvrtFilterParams){
    try {
      filter.city = this.getCity();
      console.log('Filter:', filter);
      const response = await apiClient.post('filter/walks-filtered',filter );

      runInAction(() => {
        this.walkAdvrts = response.data as IWalkAdvrtDto[]; 
      });
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async getPagenatedPointItems(type: MapPointType,page: number, pageSize: number): Promise<IPagedAdvrtDto | IPagedPointDangerDTO | IPagetPointUserDTO> {
    try {
      const response = await apiClient.get(`map/get-points-paginated?type=${type}&city=${this.getCity()}&page=${page}&pageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
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
      return handleAxiosError(error);
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
      const response = await apiClient.post(`walkadvrt/join/${walkId}`, {
        userId: userId // Передаем как объект
      } );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  }



  async getAllWalkParticipants(walkId: string): Promise<IUserAdvrt[]> {
    try {
      console.log('Get all walk participants', walkId);
      const response = await apiClient.get(`walkadvrt/participants/${walkId}`);
      console.log('Participants:', response.data);
      return response.data as IUserAdvrt[];
    } catch (error) {
      return handleAxiosError(error);
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
    await apiClient.post('review/add-or-update', review);
      
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async getReviewsByPointId(pointId: string): Promise<ReviewDTO[]> {
    try {
      const response = await apiClient.get(`review/get-all-by-point/${pointId}`);
      return response.data as ReviewDTO[];
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async deleteReview(reviewId: string) {
    try {
      if (reviewId) {
        await apiClient.delete(`/review/delete-point-review/${reviewId}`);
      }
    } catch (error) {
      return handleAxiosError(error);
    }
  }
}

const mapStore = new MapStore();
export default mapStore;

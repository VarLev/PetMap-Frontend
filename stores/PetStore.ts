import { makeAutoObservable } from "mobx";
import axios from 'axios';
import apiClient from '@/hooks/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPet} from '@/dtos/Interfaces/pet/IPet';

class PetStore {
    currentPetProfile: IPet | null = null;
    petProfiles: IPet[] = [];
    loading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setLoading(loading: boolean) {
        this.loading = loading;
    }

    async createPetProfile(pet: Partial<IPet>) 
    {
      try 
      {
        if (this.currentPetProfile) {
            this.currentPetProfile = { ...this.currentPetProfile, ...pet };

            await apiClient.post('/petprofiles/create', this.currentPetProfile);
            console.log('Pet profile data updated');
        }
      } catch (error) 
      {
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
}

const petStore = new PetStore();
export default petStore;

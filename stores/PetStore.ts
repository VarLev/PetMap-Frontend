import { makeAutoObservable } from "mobx";
import axios from 'axios';
import apiClient from '@/hooks/axiosConfig';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';

import { IPet} from '@/dtos/Interfaces/pet/IPet';
import { Pet } from "@/dtos/classes/pet/Pet";

class PetStore {
  currentPetProfile: IPet | null = null;
  loading: boolean = false;
  currentUserPets: IPet[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setPetProfile(pet: IPet) {
    this.currentPetProfile = pet;
  }

  getSurrentPetProfileToEdit() {
    return this.currentPetProfile;
  }

  getEmptyPetProfile(petId?: string, userId?: string, petName?: string): IPet {
    const newPet = new Pet();
    newPet.id = petId || Crypto.randomUUID();
    newPet.petName = petName || '';
    newPet.userId = userId || '';
    return newPet;
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

  async getPetProfileById(petId: string) 
  {
    try 
    {
      const responce = await apiClient.get(`/petprofiles/${petId}`);
      const pet = new Pet(responce.data);
      this.setPetProfile(pet);
      return pet;  
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

  async updatePetProfile(pet: Partial<IPet>) {
    try {
      if (this.currentPetProfile) {
        this.currentPetProfile = { ...this.currentPetProfile, ...pet };

        await apiClient.put('/petprofiles/update', this.currentPetProfile);
        console.log('Pet profile updated');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error);
      } else {
        console.error('Error:', error);
      }
      throw error;
    }
  }

  async setPetImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.5,
      
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
  };
}

const petStore = new PetStore();
export default petStore;

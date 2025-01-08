import { makeAutoObservable } from "mobx";
import axios from 'axios';
import apiClient from '@/hooks/axiosConfig';
import {launchImageLibraryAsync, MediaTypeOptions} from 'expo-image-picker';
import {randomUUID} from "expo-crypto";
import {manipulateAsync,SaveFormat } from 'expo-image-manipulator';

import { IPet} from '@/dtos/Interfaces/pet/IPet';
import { Pet } from "@/dtos/classes/pet/Pet";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebaseConfig";



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
    newPet.id = petId || randomUUID();
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

  async createNewPetProfile(pet: Partial<IPet>) : Promise<IPet | undefined>
  {
    try 
    {
      
      if (this.currentPetProfile) {
        this.currentPetProfile = { ...this.currentPetProfile, ...pet };
        this.currentPetProfile.id = randomUUID();
        const response = await apiClient.post('/petprofiles/create-new', this.currentPetProfile);
        const newPet = new Pet(response.data);
        return newPet!;
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

  async deletePetProfile(petId: string) {
    try {
      if (petId) {
        await apiClient.delete(`/petprofiles/delete/${petId}`);
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
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.8,
      
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
  };

  async uploadUserThumbnailImage(pet: IPet): Promise<string|undefined> {
    return this.uploadImage(pet.thumbnailUrl!,`pets/${pet.id}/thumbnail`)
  }

  async uploadImage(image:string, pathToSave:string): Promise<string|undefined> {
    if (!image) return;
    const compressedImage = await this.compressImage(image);
    const response = await fetch(compressedImage);
    const blob = await response.blob();
    const storageRef = ref(storage, `${pathToSave}`);

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  async compressImage (uri: string): Promise<string> {
    const manipResult = await manipulateAsync(
      uri,
      [{ resize: { width: 400 } }], // Изменение размера изображения
      { compress: 0.5, format: SaveFormat.JPEG }
    );
    return manipResult.uri;
  };
}

const petStore = new PetStore();
export default petStore;

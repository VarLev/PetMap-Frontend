import { makeAutoObservable } from 'mobx';
import apiClient from '@/hooks/axiosConfig';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { randomUUID } from 'expo-crypto';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import { IPet } from '@/dtos/Interfaces/pet/IPet';
import { Pet } from '@/dtos/classes/pet/Pet';
import { getDownloadURL, ref, uploadBytes, deleteObject, listAll } from 'firebase/storage';
import { storage, syncPetProfile } from '@/firebaseConfig';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import { IPhoto } from '@/dtos/Interfaces/IPhoto';
import { handleAxiosError } from '@/utils/axiosUtils';
import { IPetShortProfileGridDTO } from '@/dtos/Interfaces/pet/IPetShortProfileGridDTO';

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


  async createPetProfile(pet: Partial<IPet>) {
    try {
      if (this.currentPetProfile) {
        this.currentPetProfile = { ...this.currentPetProfile, ...pet };
          await apiClient.post('/petprofiles/create', this.currentPetProfile);
          await syncPetProfile(this.currentPetProfile);
      }
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async createNewPetProfile(pet: Partial<IPet>): Promise<IPet | undefined> {
    try {
      if (this.currentPetProfile) {
        this.currentPetProfile = { ...this.currentPetProfile, ...pet };
        this.currentPetProfile.id = randomUUID();
        const response = await apiClient.post('/petprofiles/create-new', this.currentPetProfile);
        const newPet = new Pet(response.data);
        await syncPetProfile(newPet);
        return newPet!;
      }
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async getPetProfileById(petId: string) {
    try {
      const responce = await apiClient.get(`/petprofiles/${petId}`);
      const pet = new Pet(responce.data);
      this.setPetProfile(pet);
      return pet;
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async updatePetProfile(pet: Partial<IPet>) {
    try {
      if (this.currentPetProfile) {
        this.currentPetProfile = { ...this.currentPetProfile, ...pet };

        await apiClient.put('/petprofiles/update', this.currentPetProfile);
        await syncPetProfile(this.currentPetProfile);
      }
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async uploadPetPhoto(photo: IPhoto) {
    try {
      const id = randomUUID();
      const url = await this.uploadImage(photo.url!, `pets/${photo.petProfileId}/photos/${id}`);
      photo.id = id;
      photo.url = url;
      await apiClient.post('/petprofiles/add-photo', photo);
    } catch (error) {
      return handleAxiosError(error);
    }
   
  }

  async getPetPhotos(petId: string): Promise<IPhoto[] | undefined> {
    try {
      const responce = await apiClient.get(`/petprofiles/photos/${petId}`);
      return responce.data as IPhoto[];
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async deletePetProfile(petId: string) {
    try {
      if (petId) {
        await apiClient.delete(`/petprofiles/delete/${petId}`);
      }
    } catch (error) {
       return handleAxiosError(error);
    }
  }

  async deletePetPhoto(photoId: string) {
    try {
      if (photoId) {
        await apiClient.delete(`/photo/${photoId}`);
      }
    } catch (error) {
       return handleAxiosError(error);
    }
  }

  async setPetImage() {
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
  }

  async uploadPetThumbnail(pet: IPet): Promise<string | undefined> {
    return this.uploadImage(pet.thumbnailUrl!, `pets/${pet.id}/thumbnail`);
  }



  async uploadImage(image: string, pathToSave: string): Promise<string | undefined> {
    if (!image) return;
    const compressedImage = await this.compressImage(image);
    const response = await fetch(compressedImage);
    const blob = await response.blob();
    const storageRef = ref(storage, `${pathToSave}`);

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }

  async compressImage(uri: string): Promise<string> {
    const manipResult = await manipulateAsync(
      uri,
      [{ resize: { width: 600 } }], // Изменение размера изображения
      { compress:0.8, format: SaveFormat.JPEG }
    );
    return manipResult.uri;
  }

  async deletePetsFromFireStore(user: IUser) {
    try {
      const userPets = user?.petProfiles?.map((pet) => pet.id);
      if (!userPets || userPets.length === 0) return;
      for (let i of userPets) {
        const folderRef = ref(storage, `pets/${i}/`);
        const result = await listAll(folderRef);
        if (result.items.length === 0) {

        }
        for (const fileRef of result.items) {
          await deleteObject(fileRef);
        }
        console.log('Питомцы удалены из FireStore');
      }
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async getPetsForGrid(
    country: string,
    city: string,
    status: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<IPetShortProfileGridDTO[] | undefined> {
    try {
      const response = await apiClient.get('/petprofiles/grid', {
        params: { country, city, status, page, pageSize },
      });
      return response.data as IPetShortProfileGridDTO[];
    } catch (error) {
      return handleAxiosError(error);
    }
  }
}

const petStore = new PetStore();
export default petStore;

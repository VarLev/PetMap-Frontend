// eslint-disable-next-line import/no-unresolved
//import { F_TOKEN, CURRENT_USER } from '@env';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import { IUserRegister } from '@/dtos/Interfaces/user/IUserRegisterDTO';
import { UserCredential } from 'firebase/auth';
import { action, runInAction, makeAutoObservable } from 'mobx';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, storage, signOut, signInWithGoogle } from '@/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import apiClient from '@/hooks/axiosConfig';
import {manipulateAsync,SaveFormat } from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUserUpdateOnbording } from '@/dtos/Interfaces/user/IUserUpdateOnbording';
import { User } from '@/dtos/classes/user/UserDTO';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { IPet } from '@/dtos/Interfaces/pet/IPet';
import petStore from './PetStore';
import { Pet } from '@/dtos/classes/pet/Pet';
import { JobTypeDto } from '@/dtos/Interfaces/job/IJob';
import { handleAxiosError } from '@/utils/axiosUtils';
import { JobType } from '@/dtos/enum/JobType';
import { Job } from '@/dtos/classes/job/Job';
import { IWalkAdvrtShortDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtShortDto';
import { IUserCardDto } from '@/dtos/Interfaces/user/IUserCardDto';


class UserStore {
  fUser: UserCredential | null = null;
  currentUser: User  = new User({});
  users: User[] = [];
  isLogged: boolean = false;
  loading: boolean = false;
  

  constructor() {
    makeAutoObservable(this, {
      setLoginedUser: action,
      setUser: action,
      setLoading: action,
      setLogged: action,
      setCreatedUser: action,
      getUser: action,
      loadUser: action,
      loadUserAfterSignIn: action,
      singInUser: action,
      registerUser: action,
      updateUserOnbordingData: action,
      updateOnlyUserData: action,
      loadUsersOnce: action
    });

   
  }
  

  setLoginedUser(user: any) {
    this.fUser = user;
    this.isLogged = !!user;
  }
  

  setUser(user: IUser | null) {
    this.currentUser = new User({ ...user })
    this.isLogged = !!user;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setLogged(isLogged: boolean) {
    this.isLogged = isLogged;
  }

  setCreatedUser(user: UserCredential) {
    this.fUser = user;
  }
  getUser(user: UserCredential) {
    this.fUser = user;
  }

  

  getCleanUser(obj: any): any  {
    if (Array.isArray(obj)) {
      return obj.map(item => this.getCleanUser(item));
    } else if (obj !== null && typeof obj === 'object') {
      const cleanedObj: any = {};
      Object.keys(obj).forEach(key => {
        if (obj[key] === null || obj[key] === undefined) {
          if (Array.isArray(obj[key])) {
            cleanedObj[key] = [];
          } else if (typeof obj[key] === 'string') {
            cleanedObj[key] = '';
          } else if (typeof obj[key] === 'number') {
            cleanedObj[key] = 0;
          } else if (typeof obj[key] === 'boolean') {
            cleanedObj[key] = false;
          } else if (typeof obj[key] === 'object') {
            cleanedObj[key] = {};
          }
        } else {
          cleanedObj[key] = this.getCleanUser(obj[key]);
        }
      });
      return cleanedObj;
    }
    return obj;
  }

  async loadUsersOnce() {
    if (this.users?.length > 0) {
      console.log('Пользователи уже загружены.');
      return this.users; // Возвращаем уже загруженных пользователей
    }

    try {
      console.log('Загрузка пользователей');
      //const response = await apiClient.get('/users/all'); // Запрос к серверу
      // runInAction(() => {
      //   this.users = response.data.map((user: User) => new User(user));
      // });
    
      return this.users;
    } catch (error) {
      console.error('Не удалось загрузить пользователей', error);
      throw error;
    }
  }


  async loadUser(): Promise<IUser> {
    try {
      const fuid = this.fUser?.user.uid;
      const response = await apiClient.get('/users/me', { params: { fuid } }); // Эндпоинт для получения текущего пользователя
      runInAction(() => {
        this.currentUser = new User({...response.data});
        petStore.currentUserPets = response.data.petProfiles.map((pet: IPet) => new Pet(pet));
      });

      AsyncStorage.setItem('currentUser', JSON.stringify(this.currentUser))
        .then(() => console.log('Пользователь сохранен в AsyncStorage'))
        .catch((error) => console.error('Ошибка сохранения пользователя в AsyncStorage', error));
      
        return this.currentUser;

    } catch (error) {
      console.error('Failed to load user', error);
    }
    return {} as IUser;
  }

  async loadUserAfterSignIn() {
    try {
     
      const fuid = this.fUser?.user.uid;
      const response = await apiClient.get('/users/me', { params: { fuid } }); // Эндпоинт для получения текущего пользователя
      runInAction(() => {
        console.log('Пользователь загружен из базы:');
        this.currentUser = new User(response.data);
        petStore.currentUserPets = response.data.petProfiles.map((pet: IPet) => new Pet(pet));
      });
      
      AsyncStorage.setItem('currentUser', JSON.stringify(this.currentUser))
        .then(() => console.log('Пользователь сохранен в AsyncStorage'))
        .catch((error) => console.error('Ошибка сохранения пользователя в AsyncStorage', error));


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

  async getUserById(id:string): Promise<IUser> {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data as IUser;
    } catch (error) {
      return handleAxiosError(error);
    }
    
  }
  
  async getCurrentUser(): Promise<IUser> {
    if(this.currentUser?.id) {
      console.log('Пользователь загружен из базы:');
      return this.currentUser?? {} as IUser;
    }
    else{
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        console.log('Пользователь загружен из AsyncStorage:');
        return user as IUser;
      } else {
        console.log('Пользователь не найден1');
        return null as unknown as IUser;
      }
    }
  }

  async getCurrentUserFromServer(): Promise<IUser> {
   
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        runInAction(() => {
          this.currentUser = new User(user);
        });
        console.log('Пользователь загружен из AsyncStorage:');
        return user as IUser;
      } else {
        console.log('Пользователь не найден2');
        return null as unknown as IUser;
      }
    
  }

  async singInUser(email: string, password: string) {
    this.setLoading(true);
    try {
      
      const userCred = await signInWithEmailAndPassword(email, password);
      const token = await userCred.user.getIdToken();
      console.log('Token:', token);
      await AsyncStorage.setItem(process.env.EXPO_PUBLIC_F_TOKEN!, token);
      runInAction(() => {this.setLoginedUser(userCred);});
      await this.loadUserAfterSignIn();
      runInAction(() => {this.setLogged(true);});
      
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
    finally 
    {
      this.setLoading(false);
    }
  }

  async registerUser(email: string, password: string): Promise<UserCredential> {
    this.setLoading(true);
    try {
      
      const userCred = await createUserWithEmailAndPassword(email, password);
      
      const userRegisterDTO : IUserRegister  = {
        email: userCred.user.email!,
        password: password,
        firebaseUid: userCred.user.uid,
        provider: 'email'
      };

      const token = await userCred.user.getIdToken();
      await AsyncStorage.setItem(process.env.EXPO_PUBLIC_F_TOKEN!, token);

      const response = await apiClient.post('/users/register', userRegisterDTO);
      const registeredUser = response.data as IUser;
     
      runInAction(() => {
        this.setCreatedUser(userCred);
        this.setLogged(true);
        this.setUser(registeredUser);
      });

      // await AsyncStorage.setItem('user', JSON.stringify({
      //   email: registeredUser.email,
      //   uid: registeredUser.firebaseUid,
      //   provider: registeredUser.provider,
      //   userId: registeredUser.id
      // }));

      return userCred;
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
    finally 
    {
      this.setLoading(false);
    }
  }

  async googleSingInUser(): Promise<[isUserAlreadyRegistrated:boolean, isSuccessfulSignIn:boolean] > {
    this.setLoading(true);
    let isSuccessful = false;
    let isUserAlreadyRegistrated = false;
    try {

      const userCred = await signInWithGoogle();
      const token = await userCred.user.getIdToken();
      await AsyncStorage.setItem(process.env.EXPO_PUBLIC_F_TOKEN!, token);
      runInAction(() => {this.setCreatedUser(userCred);});
      console.log('existingUserResponse:');
      const existingUserResponse = await apiClient.get(`/users/exists/${userCred.user.uid}`);
      console.log('existingUserResponse:', existingUserResponse);
      if(existingUserResponse.status === 200){

        isUserAlreadyRegistrated = true;
        await this.loadUserAfterSignIn();
        console.log('User already registrated', isUserAlreadyRegistrated);

      }else{
        const userRegisterDTO : IUserRegister  = {
          email: userCred.user.email!,
          firebaseUid: userCred.user.uid,
          provider: 'google'
        };
      
        const response = await apiClient.post('/users/register', userRegisterDTO);
        const registeredUser = response.data as IUser;
        runInAction(() => {
          this.setUser(registeredUser);
        });

      }
      isSuccessful = true;
      
      runInAction(() => {this.setLogged(true);});
    } 
    catch (error) 
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
      isSuccessful = false;
    } 
    finally 
    {
      this.setLoading(false);
      return [isUserAlreadyRegistrated, isSuccessful];
    }
  }

  async updateUserOnbordingData(user: Partial<IUserUpdateOnbording>) {
    try 
    {
      if (this.currentUser) 
      {
        // Обновление локального состояния
        if(user.thumbnailUrl && this.currentUser?.email){

          console.log('user thumbnailUrl:', user.thumbnailUrl);
          const thumUrl = await this.uploadUserThumbnailImage(new User({ ...this.currentUser, ...user }));
          
          console.log('thumbnailUrl:', thumUrl);

          runInAction(() => {
            this.currentUser.thumbnailUrl = thumUrl;
          });
          
          user.thumbnailUrl = thumUrl;
          console.log('user thumbnailUrl updated');
        }
        
          
        runInAction(() => {
          this.currentUser = new User({ ...this.currentUser, ...user });
        });
        let thumUrl;
        if((user.petProfiles ?? []).length > 0 ){
          if(user.petProfiles![0].thumbnailUrl){
            thumUrl = await this.uploadImage(user.petProfiles![0].thumbnailUrl, `pets/${user.petProfiles![0].id}/thumbnail`);
          }else{
            const petAvatarUrl = await this.fetchImageUrl(`assets/images/pet/thumbnail.png`);
            thumUrl = await this.uploadImage(petAvatarUrl!, `pets/${user.petProfiles![0].id}/thumbnail`);
          }
          this.currentUser.petProfiles![0].thumbnailUrl = thumUrl;
          user.petProfiles![0].thumbnailUrl = thumUrl;
          console.log('pet thumbnailUrl updated');
        }
       
          
        runInAction(() => {
          this.currentUser = new User({ ...this.currentUser, ...user });
        });

        await apiClient.put('/users/updateOnbording', this.currentUser);
      }
    } catch (error) 
    {
      if (axios.isAxiosError(error)) 
      {
        // Подробная информация об ошибке Axios
        console.error('Axios error:', {
            message: error.message,
            name: error.name,
            //code: error.code,
            //config: error.config,
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
    } 
  }

  async uploadUserThumbnailImage(user: IUser): Promise<string|undefined> {
    return this.uploadImage(user.thumbnailUrl!,`users/${this.currentUser?.email}/thumbnail`)
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
  
  async updateOnlyUserData(user: Partial<IUser>) {
    try 
    {
      if (this.currentUser) 
      {
        console.log('Пользователь найден');
        runInAction(() => {
          this.currentUser = new User({ ...this.currentUser, ...user });
        });
        console.log('Пользователь собран');
        //console.log(this.currentUser);
        await apiClient.put('/users/update', this.currentUser);
        console.log('User data updated');
      }
    } catch (error) 
    {
      if (axios.isAxiosError(error)) 
      {
        // Подробная информация об ошибке Axios
        console.error('Axios error:', {
            message: error.message,
            name: error.name,
            //code: error.code,
            //config: error.config,
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

  async fetchImageUrl(path:string) {
    try {
      const storageRef = ref(storage, `${path}`);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error fetching image URL:', error);
    }
  };


  async signOut() {
    try {
      
      await AsyncStorage.removeItem(process.env.EXPO_PUBLIC_F_TOKEN!);
      await AsyncStorage.removeItem(process.env.EXPO_PUBLIC_CURRENT_USER!);
      signOut();
    } catch (error) {
      console.error('Failed to sign out', error);     
    }
  }

  async setUserImage() {
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.5,
      
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
  };

  async getUserWalks(userId: string): Promise<IWalkAdvrtShortDto[]> {
    try {
      const response = await apiClient.get(`/walkadvrt/${userId}`);
      if(response.data.length > 0){
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Failed to load user walks', error);
      return [];
    }
  }

  async getUserJobs(userId: string): Promise<JobTypeDto[]> {
    try {
      const response = await apiClient.get(`/job/user/${userId}`);
      if(response.data.length > 0){
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Failed to load user jobs', error);
      return [];
    }
  }

  

  async getEarnedBenefitsByJobType(userId: string, jobType: JobType): Promise<number> {
    try {
      const response = await apiClient.get(`/job/user/benefits-by-type`, {
        params: {
          userId: userId,
          jobType: jobType
        }
      });

      if(response.data){
        return response.data;
      } else {
        return 0;
      }
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async updateUserJobs(userId: string, jobs: Job[]) {
    try {
      await apiClient.put(`/job/user/${userId}`, jobs);
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async getAllTopUsers(): Promise<IUserCardDto[]> {
    try {
      const response = await apiClient.get('/users/all-top-users');
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  }


}

const userStore = new UserStore();
export default userStore;
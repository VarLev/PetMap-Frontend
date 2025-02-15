// eslint-disable-next-line import/no-unresolved
//import { F_TOKEN, CURRENT_USER } from '@env';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import { IUserRegister } from '@/dtos/Interfaces/user/IUserRegisterDTO';
import { UserCredential } from 'firebase/auth';
import { action, runInAction, makeAutoObservable } from 'mobx';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, storage, signOut, signInWithGoogle } from '@/firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
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
import { getUserLastOnlineStatus, getUserStatus } from '@/utils/userUtils';
import RevenueCatService from '@/services/RevenueCatService';
import { MapPointType } from '@/dtos/enum/MapPointType';
import { MapPointDTO } from '@/dtos/classes/map/MapPointDTO';
import { AppleAuthenticationCredential } from 'expo-apple-authentication';


type AuthCredential = UserCredential | AppleAuthenticationCredential;

//fghjkl
class UserStore {
  fUid: string | null = null;
  currentUser: User | null  = new User({}) ;
  users: User[] = [];
  isLogged: boolean = false;
  loading: boolean = false;
  isInitialized: boolean = false;
  isError: boolean = false;
  currentCity: string = '';
  currentCountry: string = '';
  userHasSubscription = false;
  isUserJustRegistrated = false;


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
      loadUsersOnce: action,
      setIsUserJustRegistrated: action,
    });
  }

  setUserHasSubscription(hasSubscription: boolean) {
    this.userHasSubscription = hasSubscription;
  }

  getUserHasSubscription() {
    return this.userHasSubscription;
  }
  
  setLoginedUser(user: any) {
    this.fUid = user.user.uid;
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

  getLogged() {
   
    return this.isLogged;
  }
  
  setCreatedUser(user: AuthCredential) {
    // Если user.user является строкой, то это учётные данные от Apple
    if (typeof user.user === 'string') {
      this.fUid = user.user;
    } 
    // Если user.user является объектом, то это Firebase-учётные данные, где присутствует uid
    else if (user.user && 'uid' in user.user) {
      this.fUid = user.user.uid;
    } else {
      console.warn("Не удалось установить идентификатор пользователя");
    }
  }
  
  setCurrentUserCity(city: string) {
    this.currentCity = city;
  }

  getCurrentUserCity() {
    return this.currentCity;
  }

  setCurrentUserCountry(country: string) {
    this.currentCountry = country;
  }

  getCurrentUserCountry() {
    return this.currentCountry;
  }

  getCurrentUserId() {
    return this.currentUser?.id;
  }

  getUser(user: UserCredential) {
    this.fUid = user.user.uid;
  }

  getIsUserJustRegistrated() {
    return this.isUserJustRegistrated;
  }

  setIsUserJustRegistrated(isJustRegistrated: boolean) {
    this.isUserJustRegistrated = isJustRegistrated;
  }

  async getCurrentUser(): Promise<IUser | null | false> {
    if(this.currentUser !== null && this.currentUser !== undefined)
      return this.currentUser;
    else
      return await this.getCurrentUserForProvider();
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

      return this.users; // Возвращаем уже загруженных пользователей
    }

    try {

      //const response = await apiClient.get('/users/all'); // Запрос к серверу
      // runInAction(() => {
      //   this.users = response.data.map((user: User) => new User(user));
      // });
    
      return this.users;
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async loadUser(): Promise<IUser |null> {
    try {
      const fuid = this.fUid;

      const response = await apiClient.get('/users/me', { params: { fuid } }); // Эндпоинт для получения текущего пользователя
      runInAction(() => {
        this.currentUser = new User({...response.data});
        petStore.currentUserPets = response.data.petProfiles.map((pet: IPet) => new Pet(pet));
      });

      AsyncStorage.setItem('currentUser', JSON.stringify(this.currentUser))
        .then(() => {})
        .catch((error) => console.error('Ошибка сохранения пользователя в AsyncStorage', error));
      
        return this.currentUser;

    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async loadUserAfterSignIn() {
    try {
     
      const fuid = this.fUid;
      const response = await apiClient.get('/users/me', { params: { fuid } }); // Эндпоинт для получения текущего пользователя
      runInAction(() => {
     
        this.currentUser = new User(response.data);
        petStore.currentUserPets = response.data.petProfiles.map((pet: IPet) => new Pet(pet));
      });
      
      AsyncStorage.setItem('currentUser', JSON.stringify(this.currentUser))
        .then(() => {})
        .catch((error) => console.error('Ошибка сохранения пользователя в AsyncStorage', error));


    } catch (error) {
      return handleAxiosError(error);
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
  
  async getCurrentUserForProvider(): Promise<IUser | null> {
   
    try{
      // Проверяем, есть ли пользователь уже в состоянии
      if (this.currentUser?.id) {
        runInAction(() => {
          this.checkRevenueCatSubscription();
        });
        
        return this.currentUser;
      }
      
      const currentUserString = await AsyncStorage.getItem(process.env.EXPO_PUBLIC_CURRENT_USER!);
      const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

      //Пытаемся загрузить пользователя из AsyncStorage
      if (!currentUser || !currentUser?.firebaseUid) {
        await this.signOut();
        return null;
      }

      if(!currentUser?.firebaseUid) return null;

      const userData = await apiClient.get('/users/me', { params: { fUid: currentUser?.firebaseUid } });
     
      if (userData.data && currentUser) {
        this.fUid = currentUser?.firebaseUid;
        const user = userData.data as IUser;

        // Обновляем MobX состояние и возвращаем пользователя
        runInAction(() => {
          this.currentUser = new User(user);
          //this.setUserHasSubscription(user.isPremium?? false);
          this.checkRevenueCatSubscription();
        });
        
        
        return this.currentUser;
      } 


      return null; // Возвращаем null, если пользователь не найден
    }catch (error) {
      //this.signOut();
      return handleAxiosError(error);
    }
   
  }

  async checkRevenueCatSubscription() {
    try {
      // Если текущего пользователя или его firebaseUid нет,
      // то подписка по логике быть не может
      if (!this.currentUser?.firebaseUid) {
        this.setUserHasSubscription(false);
        return;
      }

      const firebaseUid = this.currentUser.firebaseUid;

      // Выполняем логин в RevenueCat под тем же appUserID (firebaseUid).
      // Если подписка оформлена на другой Google-аккаунт/другой appUserID,
      // то RevenueCat тут не покажет активный entitlement.
      const customerInfo = await RevenueCatService.setUserId(firebaseUid);
     
      // Проверяем, есть ли активный entitlement 'premium'
      // (Название entitlements задаётся в вашем кабинете RevenueCat)
      const hasPremium = !!customerInfo.entitlements.active['Basic'];

      
    
      runInAction(() => {
        this.setUserHasSubscription(this.currentUser!.isPremium ?? hasPremium);
       
      });

    } catch (error) {
      console.error('Ошибка при проверке подписки RevenueCat:', error);
      // Если произошла ошибка, можно принудительно поставить false
      runInAction(() => {
        this.setUserHasSubscription(false);
      });
    }
  }

  async singInUser(email: string, password: string) {
    this.setLoading(true);
    try {
      
      const userCred = await signInWithEmailAndPassword(email, password);
      const token = await userCred.user.getIdToken();

      await AsyncStorage.setItem(process.env.EXPO_PUBLIC_F_TOKEN!, token);


      
      runInAction(() => {this.setLoginedUser(userCred);});
      await this.loadUserAfterSignIn();

      runInAction(() => {this.setLogged(true);});
      return userCred;
    } catch (error) 
    {
      return handleAxiosError(error);
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

      const response = await apiClient.post('/auth/register', userRegisterDTO);
      const registeredUser = response.data as IUser;
     
      runInAction(() => {
        this.setCreatedUser(userCred);
        this.setLogged(true);
        this.setUser(registeredUser);
        this.setIsUserJustRegistrated(true);
      });

      return userCred;
    } catch (error) 
    {
      return handleAxiosError(error);
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

      const existingUserResponse = await apiClient.get(`/users/exists/${userCred.user.uid}`);


      if(existingUserResponse.status === 200){

        isUserAlreadyRegistrated = true;
        await this.loadUserAfterSignIn();


      }else{


        const userRegisterDTO : IUserRegister  = {
          email: userCred.user.email!,
          firebaseUid: userCred.user.uid,
          provider: 'google'
        };
      
        const response = await apiClient.post('/auth/register', userRegisterDTO);
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
      isSuccessful = false;
      return handleAxiosError(error);
     
    } 
    finally 
    {
      this.setLoading(false);
      return [isUserAlreadyRegistrated, isSuccessful];
    }
  }

  async appleSignInUser(userName:string, firebaseUserCredential: UserCredential): Promise<[isUserAlreadyRegistrated: boolean, isSuccessfulSignIn: boolean]> {
    this.setLoading(true);
    let isSuccessful = false;
    let isUserAlreadyRegistrated = false;
    try {
      // Получаем токен из Firebase-учетных данных (это может быть ID token, полученный через Firebase)
      const token = await firebaseUserCredential.user.getIdToken();
      // Сохраняем токен в AsyncStorage (аналогично Google)
      await AsyncStorage.setItem(process.env.EXPO_PUBLIC_F_TOKEN!, token);
  
      // Сохраняем данные о пользователе в сторе (метод setCreatedUser теперь поддерживает и Firebase UserCredential)
      runInAction(() => {
        this.setCreatedUser(firebaseUserCredential);
      });
  
      // Проверяем, существует ли уже пользователь на сервере по уникальному идентификатору из Firebase
      const existingUserResponse = await apiClient.get(`/users/exists/${firebaseUserCredential.user.uid}`);
      if (existingUserResponse.status === 200) {
        isUserAlreadyRegistrated = true;
        await this.loadUserAfterSignIn();
      } else {
        // Формируем DTO для регистрации пользователя через Apple
        // Обратите внимание: email может быть недоступен при повторном входе (он возвращается только при первой авторизации)
        const userRegisterDTO: IUserRegister = {
          email: firebaseUserCredential.user.email!, // здесь можно добавить проверку на null
          firebaseUid: firebaseUserCredential.user.uid,
          provider: 'apple',
          name: userName
        };
        const response = await apiClient.post('/auth/register', userRegisterDTO);
        const registeredUser = response.data as IUser;
        runInAction(() => {
          this.setUser(registeredUser);
        });
      }
      isSuccessful = true;
      runInAction(() => {
        this.setLogged(true);
      });
    } catch (error) {
      isSuccessful = false;
      return handleAxiosError(error);
    } finally {
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

    
          const thumUrl = await this.uploadUserThumbnailImage(new User({ ...this.currentUser, ...user }));
          

          runInAction(() => {
            this.currentUser!.thumbnailUrl = thumUrl;
          });
          
          user.thumbnailUrl = thumUrl;

        }
        
          
        runInAction(() => {
          this.currentUser = new User({ ...this.currentUser, ...user });
        });
        let thumUrl;
        if((user.petProfiles ?? []).length > 0 ){
          if(user.petProfiles![0].thumbnailUrl){
            thumUrl = await this.uploadImage(user.petProfiles![0].thumbnailUrl, `pets/${user.petProfiles![0].id}/thumbnail`);
          }
          this.currentUser.petProfiles![0].thumbnailUrl = thumUrl;
          user.petProfiles![0].thumbnailUrl = thumUrl;

        }
       
          
        runInAction(() => {
          this.currentUser = new User({ ...this.currentUser, ...user });
        });

        await apiClient.put('/users/updateOnbording', this.currentUser);
      }
    } catch (error) 
    {
      return handleAxiosError(error);
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
      [{ resize: { width: 600 } }], // Изменение размера изображения
      { compress: 0.8, format: SaveFormat.JPEG }
    );
    return manipResult.uri;
  };
  
  async updateOnlyUserData(user: Partial<IUser>) {
    try 
    {
      if (this.currentUser) 
      {

        runInAction(() => {
          this.currentUser = new User({ ...this.currentUser, ...user });
        });
        await apiClient.put('/users/update', this.currentUser);
      }
    } catch (error) 
    {
      return handleAxiosError(error);
    } 
  }

  async fetchImageUrl(path:string) {
    try {
      const storageRef = ref(storage, `${path}`);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  async signOut() {
    try {
      
      await AsyncStorage.removeItem(process.env.EXPO_PUBLIC_F_TOKEN!);
      await AsyncStorage.removeItem(process.env.EXPO_PUBLIC_CURRENT_USER!);
      
      runInAction(() => {
        this.setUser(null);
        this.isInitialized = false;
        this.setLogged(false);
        this.fUid = null;
        this.isError = false;
      });
      
      
      signOut();
     
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async setUserImage() {
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

  async collectPOI(poiId: string): Promise<IUserCardDto[]> {
    try {
      const response = await apiClient.patch('poi/collect', poiId, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async getUserStatus(userId: string): Promise<boolean | undefined> {
    return getUserStatus(userId);
  }

  async getUserLastOnline(userId: string): Promise<string | undefined> {
    return getUserLastOnlineStatus(userId);
  }

  async deleteUserFromFireStore(user: IUser) {
    const storageRef = ref(storage, `users/${user.email}/`);
    try {
      const result = await listAll(storageRef);
      if (result.items.length === 0) {
       
      return;
      }
      for (const fileRef of result.items) {
        await deleteObject(fileRef);
      }
 
      
    }
    catch (error) {
      return handleAxiosError(error);
    }
  }


  async deleteUserAccount(id: string) {
    try {
      await apiClient.delete(`/users/${id}`)

    } 
    catch (error) {
      return handleAxiosError(error);
    }
  }

  async getUserMapMarkers(pointType:MapPointType, userId: string): Promise<MapPointDTO[]> {
    try {
      const response = await apiClient.get(`/map/points/user`, {
        params: {
          pointType: pointType,
          userId: userId
        },
        headers: {
          // Указываем, что ожидаем JSON
          'Accept': 'application/json'
        }
      });
      if(response.data.length > 0){
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      return handleAxiosError(error);
    }
  }


}
const userStore = new UserStore();
export default userStore;
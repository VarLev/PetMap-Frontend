// eslint-disable-next-line import/no-unresolved
import { F_TOKEN } from '@env';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import { IUserRegister } from '@/dtos/Interfaces/user/IUserRegisterDTO';
import { UserCredential } from 'firebase/auth';
import { action, runInAction, makeAutoObservable } from 'mobx';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@/firebaseConfig';
import axios from 'axios';
import apiClient from '@/hooks/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUserUpdateOnbording } from '@/dtos/Interfaces/user/IUserUpdateOnbording';
import { User } from '@/dtos/classes/user/UserDTO';




class UserStore {
  fUser: UserCredential | null = null;
  currentUser: User | null = null;
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
      updateOnlyUserData: action
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


  async loadUser() {
    try {
      const fuid = this.fUser?.user.uid;
      const response = await apiClient.get('/users/me', { params: { fuid } }); // Эндпоинт для получения текущего пользователя
      runInAction(() => {
        this.currentUser = new User({...response.data});
      });
    } catch (error) {
      console.error('Failed to load user', error);
    }
  }

  async loadUserAfterSignIn() {
    try {
     
      const fuid = this.fUser?.user.uid;
      const response = await apiClient.get('/users/me', { params: { fuid } }); // Эндпоинт для получения текущего пользователя
      runInAction(() => {
        this.currentUser = new User(response.data);
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
  
  async getCurrentUser(): Promise<IUser> {
    return this.currentUser?? {} as IUser;
  }

  async singInUser(email: string, password: string) {
    this.setLoading(true);
    try {
      
      const userCred = await signInWithEmailAndPassword(email, password);
      const token = await userCred.user.getIdToken();
      await AsyncStorage.setItem(F_TOKEN, token);
      runInAction(() => {
        this.setLoginedUser(userCred);
        this.loadUserAfterSignIn();
        this.setLogged(true);
      });
      

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
      await AsyncStorage.setItem(F_TOKEN, token);

      const response = await apiClient.post('/users/register', userRegisterDTO);
      const registeredUser = response.data as IUser;
     
      runInAction(() => {
        this.setCreatedUser(userCred);
        this.setLogged(true);
        this.setUser(registeredUser);
      });

      await AsyncStorage.setItem('user', JSON.stringify({
        email: registeredUser.email,
        uid: registeredUser.firebaseUid,
        provider: registeredUser.provider,
        userId: registeredUser.id
      }));

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

  async updateUserOnbordingData(user: Partial<IUserUpdateOnbording>) {
    try 
    {
      if (this.currentUser) 
      {
        // Обновление локального состояния
        runInAction(() => {
          this.currentUser = new User({ ...this.currentUser, ...user });
        });
        
        // Отправка данных на сервер
        await apiClient.put('/users/updateOnbording', this.currentUser);
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

}

const userStore = new UserStore();
export default userStore;
// eslint-disable-next-line import/no-unresolved
import { F_TOKEN } from '@env';
import { IUser } from '@/dtos/Interfaces/user/IUser';
import { IUserRegister } from '@/dtos/Interfaces/user/IUserRegisterDTO';
import { UserCredential } from 'firebase/auth';
import { makeAutoObservable } from 'mobx';
import { createUserWithEmailAndPassword } from '@/firebaseConfig';
import axios from 'axios';
import apiClient from '@/hooks/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUserUpdateOnbording } from '@/dtos/Interfaces/user/IUserUpdateOnbording';



class UserStore {
  fUser: UserCredential | null = null;
  currentUser: IUser | null = null;
  isLogged: boolean = false;
  
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLoginedUser(user: any) {
    this.fUser = user;
    this.isLogged = !!user;
  }

  setUser(user: IUser | null) {
    this.currentUser = user;
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
  
  async getCurrentUser(): Promise<IUser> {
    return {} as IUser;
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
     
      this.setCreatedUser(userCred);
      this.setLogged(true);
      this.setUser(registeredUser);

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
        this.currentUser = { ...this.currentUser, ...user };
        console.log(this.currentUser);
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


  async updateUserData(user: Partial<IUser>) {
    try 
    {
      if (this.currentUser) 
      {
        // Обновление локального состояния
        this.currentUser = { ...this.currentUser, ...user };
        //console.log(this.currentUser);
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

}

const userStore = new UserStore();
export default userStore;
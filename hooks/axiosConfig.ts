import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// eslint-disable-next-line import/no-unresolved
//import { F_TOKEN } from '@env';

const apiClient = axios.create({
  //baseURL: 'http://10.113.1.31:5142/api',
  baseURL: "https://petmeetar-test.azurewebsites.net/api",
  //baseURL: 'http://192.168.0.98:5142/api'
  //baseURL: 'http://192.168.1.17:5142/api'
  //baseURL: 'http://192.168.1.35:5142/api'
});
//baseURL: 'http://192.168.0.98:5142/api'
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(process.env.EXPO_PUBLIC_F_TOKEN!);
    if (token) {
      // Использование токена в заголовке Authorization
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Использование токена в параметре запроса
      config.params = config.params || {};
      config.params["access_token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

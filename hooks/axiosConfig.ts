import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// eslint-disable-next-line import/no-unresolved
import { F_TOKEN } from '@env';

const apiClient = axios.create({
    baseURL: 'http://192.168.0.98:5142/api',
});

apiClient.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem(F_TOKEN);
        if (token) {
            // Использование токена в заголовке Authorization
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            // Использование токена в параметре запроса
            config.params = config.params || {};
            config.params['access_token'] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default apiClient;
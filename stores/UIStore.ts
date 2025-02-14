import { Language } from '@/dtos/enum/Language';
import apiClient from '@/hooks/axiosConfig';
import i18n from '@/i18n';
import { handleAxiosError } from '@/utils/axiosUtils';
import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import * as Location from 'expo-location';
import { randomUUID } from 'expo-crypto';

class UIStore {
  isPointSearchFilterTagSelected : boolean = false;
  isBottomTableViewSheetOpen: boolean = false;
  currentLanguage: Language = Language.Spanish; 
  isLocationPermissionGranted: boolean = false;
  isNotificationPermissionGranted: boolean = false;
  isPhotosPermissionGranted: boolean = false;
  isSearchAddressExpanded: boolean = false;
  isChatTranslatinEnabled: boolean = false;
  resetAppId: string = '';
  isPushTurnedOn: boolean = false;
  isKeyboardVisible: boolean = false;


  

  constructor() {
    makeAutoObservable(this);
    this.initLanguage();
  }

  async initLanguage() {
    const lang = await this.getSystemLanguage();
    runInAction(() => {
      this.currentLanguage = lang;
      this.resetApp();
    });
    await this.setLanguagei18n(lang);
  }

  async resetApp() {
    runInAction(() => {
      this.resetAppId = randomUUID();
    })
  }


  setIsSearchAddressExpanded(isExpanded: boolean) {
    this.isSearchAddressExpanded = isExpanded;
  }
  
  getIsSearchAddressExpanded() {
    return this.isSearchAddressExpanded;
  }

  setLocationPermissionGranted(isGranted: boolean) {
    this.isLocationPermissionGranted = isGranted;
  }

  getLocationPermissionGranted() {
    return this.isLocationPermissionGranted;
  }

  setNotificationPermissionGranted(isGranted: boolean) {
    this.isNotificationPermissionGranted = isGranted;
  }

  getNotificationPermissionGranted() {
    return this.isNotificationPermissionGranted;
  }

  setPhotosPermissionGranted(isGranted: boolean) {
    this.isPhotosPermissionGranted = isGranted;
  }

  getPhotosPermissionGranted() {
    return this.isPhotosPermissionGranted;
  }


  setIsPointSearchFilterTagSelected(isSelected: boolean) {
    this.isPointSearchFilterTagSelected = isSelected;
  }

  getIsPointSearchFilterTagSelected() {
    return this.isPointSearchFilterTagSelected;
  }

  setIsBottomTableViewSheetOpen(isOpen: boolean) {
    this.isBottomTableViewSheetOpen = isOpen;
  }

  getIsBottomTableViewSheetOpen() {
    return this.isBottomTableViewSheetOpen;
  }

  setIsChatTranslatinEnabled(isEnabled: boolean) {
    this.isChatTranslatinEnabled = isEnabled;
  }

  getIsChatTranslatinEnabled() {
    return this.isChatTranslatinEnabled;
  }

  setKeyboardVisible(isVisible: boolean) {
    this.isKeyboardVisible = isVisible;
  }

  getKeyboardVisible() {
    return this.isKeyboardVisible;
  }

  
  async setLanguagei18n(language: Language) {
    
    if(language === Language.English)
      i18n.locale = 'en';
    else if(language === Language.Russian)
      i18n.locale = 'ru';
    else
      i18n.locale = 'es';
  }

  async getGpsStatus() {
    // 2. Проверяем, включены ли службы геолокации
    return await Location.hasServicesEnabledAsync();
  }

  


  async setSystemLanguage(language: Language) {
    try {
      await apiClient.post('/system/language', JSON.stringify(language), {
        headers: { 'Content-Type': 'application/json' }
      });
      await AsyncStorage.setItem(process.env.EXPO_PUBLIC_SYSTEM_LANGUAGE!, language.toString());

      
      // Сначала обновляем i18n
      await this.setLanguagei18n(language);
      
      // Затем меняем наблюдаемое значение
      runInAction(() => {
        this.currentLanguage = language; 
        this.resetApp();
      });
    } catch (error) {
      return handleAxiosError(error);
    }
  }
  
  
  async getSystemLanguage(): Promise<Language> {
    try {
      const stored = await AsyncStorage.getItem(process.env.EXPO_PUBLIC_SYSTEM_LANGUAGE!);
    
      let lang = Language.Spanish;
      if (stored === '0' || stored?.toLowerCase().includes('spanish')) lang = Language.Spanish;
      if (stored === '1' || stored?.toLowerCase().includes('russian')) lang = Language.Russian;
      if (stored === '2' || stored?.toLowerCase().includes('english')) lang = Language.English;

      if (!stored) {
        const response = await apiClient.get('/system/language');
        const serverLang = response.data;

        if (serverLang === Language.Russian) lang = Language.Russian;
        if (serverLang === Language.English) lang = Language.English;
      }

      return lang;
    } catch (error) {
      console.info('Ошибка получения языка:', error);
      console.info('Попытка получить язык из системы',getLocales()[0].languageCode);
      return this.parseLanguage(getLocales()[0].languageCode);// Дефолт
    }
  }

  // Преобразование строки или числа в тип Language
  private parseLanguage(value: string | number | null): Language {
    if (typeof value === 'number') {
      if (value === Language.Spanish || value === Language.Russian || value === Language.English) {
        return value;
      }
    } else if (typeof value === 'string') {
      const lower = value.toLowerCase();
      if (lower === 'es' ||lower.includes('spanish') || lower === '0') return Language.Spanish;
      if (lower === 'ru' || lower.includes('russian') || lower === '1') return Language.Russian;
      if (lower === 'en' ||lower.includes('english') || lower === '2') return Language.English;
    }
    // Если ничего не подошло - дефолт
    return Language.Spanish;
  }


  async translateText(text: string): Promise<string> {
    try {
      const currentLanguageIndex = await this.getSystemLanguage(); 
 
      const response = await apiClient.post('chatgpt/translate', {
        Text: text,
        TargetLanguage: Language[currentLanguageIndex]  
      });
      return response.data.translatedText;
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async subscribe(userId: string, isPremium: boolean) {
    try {
      await apiClient.post('users/subscribe', {
        userId: userId,
        IsPremium:isPremium   
      });
      return true;
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  // Метод для записи состояния переключателя пуш уведомлений в AsyncStorage
  async setPushNotificationToggleState(isEnabled: boolean) {
    try {
      await AsyncStorage.setItem(process.env.EXPO_PUBLIC_PUSH_NOTIFICATION_TOGGLE_KEY!, JSON.stringify(isEnabled));
      runInAction(() => {
       
        this.isPushTurnedOn = isEnabled;
      });
    } catch (error) {
      console.error('Ошибка сохранения состояния пуш уведомлений:', error);
    }
  }

  // Метод для чтения состояния переключателя пуш уведомлений из AsyncStorage
  async getPushNotificationToggleState(): Promise<boolean> {
    try {
      const stored = await AsyncStorage.getItem(process.env.EXPO_PUBLIC_PUSH_NOTIFICATION_TOGGLE_KEY!);
      if (stored === null) {
        return false; // значение по умолчанию
      }
      const parsedState = JSON.parse(stored) as boolean;
      runInAction(() => {
        this.isPushTurnedOn = parsedState;
      });
      return parsedState;
    } catch (error) {
      console.error('Ошибка чтения состояния пуш уведомлений:', error);
      return false;
    }
  }

}

const uiStore = new UIStore();
export default uiStore;
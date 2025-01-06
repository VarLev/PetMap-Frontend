import { Language } from '@/dtos/enum/Language';
import apiClient from '@/hooks/axiosConfig';
import i18n from '@/i18n';
import { handleAxiosError } from '@/utils/axiosUtils';
import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import * as Location from 'expo-location';

class UIStore {
  isPointSearchFilterTagSelected : boolean = false;
  isBottomTableViewSheetOpen: boolean = false;
  currentLanguage: Language = Language.Spanish; 
  isLocationPermissionGranted: boolean = false;
  isNotificationPermissionGranted: boolean = false;
  isPhotosPermissionGranted: boolean = false;
  isSearchAddressExpanded: boolean = false;
  isChatTranslatinEnabled: boolean = false;


  

  constructor() {
    makeAutoObservable(this);
    this.initLanguage();
  }

  async initLanguage() {
    const lang = await this.getSystemLanguage();
    runInAction(() => {
      this.currentLanguage = lang;
    });
    await this.setLanguagei18n(lang);
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

  async setLanguagei18n(language: Language) {
    console.log('Установка языка:', Language[language]);
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
      console.log('Язык сохранен в AsyncStorage:', language);
      
      // Сначала обновляем i18n
      await this.setLanguagei18n(language);
      
      // Затем меняем наблюдаемое значение
      runInAction(() => {
        this.currentLanguage = language; 
      });
    } catch (error) {
      return handleAxiosError(error);
    }
  }
  
  
  async getSystemLanguage(): Promise<Language> {
    try {
      const stored = await AsyncStorage.getItem(process.env.EXPO_PUBLIC_SYSTEM_LANGUAGE!);
      console.log('Загружено из AsyncStorage:', stored);
      let lang = Language.Spanish;
      if (stored === '0' || stored?.toLowerCase().includes('spanish')) lang = Language.Spanish;
      if (stored === '1' || stored?.toLowerCase().includes('russian')) lang = Language.Russian;
      if (stored === '2' || stored?.toLowerCase().includes('english')) lang = Language.English;

      if (!stored) {
        const response = await apiClient.get('/system/language');
        const serverLang = response.data;
        console.log('Загружено с сервера:', serverLang);
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
      console.log('Текущий язык:', Language[currentLanguageIndex]);
      const response = await apiClient.post('chatgpt/translate', {
        Text: text,
        TargetLanguage: Language[currentLanguageIndex]  
      });
      return response.data.translatedText;
    } catch (error) {
      return handleAxiosError(error);
    }
  }

}

const uiStore = new UIStore();
export default uiStore;
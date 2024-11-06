import { Language } from '@/dtos/enum/Language';
import apiClient from '@/hooks/axiosConfig';
import i18n from '@/i18n';
import { handleAxiosError } from '@/utils/axiosUtils';
import { makeAutoObservable } from 'mobx';

class UIStore {
  isPointSearchFilterTagSelected : boolean = false;
  isBottomTableViewSheetOpen: boolean = false;

  constructor() {
    makeAutoObservable(this);
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

  async setLanguagei18n(language: Language) {
    if(language === Language.English)
      i18n.locale = 'en';
    else if(language === Language.Russian)
      i18n.locale = 'ru';
    else
      i18n.locale = 'es';
  }


  async setSystemLanguage(language: Language) {
    try { 
      await apiClient.post('/system/language', JSON.stringify(language), {
        headers: { 'Content-Type': 'application/json' }
    });
    } 
    catch (error) 
    {
      return handleAxiosError(error);
    } 
  }
  
  async getSystemLanguage() {
    try { 
      const response = await apiClient.get('/system/language');
      return response.data;
    } 
    catch (error) 
    {
      return handleAxiosError(error);
    } 
  }

}

const uiStore = new UIStore();
export default uiStore;
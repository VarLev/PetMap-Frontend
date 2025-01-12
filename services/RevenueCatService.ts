import { handleAxiosError } from '@/utils/axiosUtils';
import Purchases from 'react-native-purchases';

export default class RevenueCatService {
  static async initialize(apiKey: string) {
    try {
      Purchases.configure({ apiKey });
    } catch (error) {
      console.error('Ошибка инициализации RevenueCat:', error);
      throw error;
    }
  }

  static async getOfferings() {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings?.current?.availablePackages || [];
    } catch (error) {
      handleAxiosError(error);
    }
  }

  static async purchasePackage(packageToPurchase: any) {
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      return customerInfo;
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error('Ошибка покупки:', error);
        throw error;
      }
      return null;
    }
  }

  static async checkSubscriptionStatus(entitlementId: string) {
    try {
      const purchaserInfo = await Purchases.getCustomerInfo();
      return purchaserInfo.entitlements.active[entitlementId] !== undefined;
    } catch (error) {
      console.error('Ошибка проверки подписки:', error);
      throw error;
    }
  }

  static async restorePurchases() {
    try {
      const purchaserInfo = await Purchases.restorePurchases();
      return purchaserInfo;
    } catch (error) {
      console.error('Ошибка восстановления покупок:', error);
      throw error;
    }
  }
}

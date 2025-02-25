import { handleAxiosError } from '@/utils/axiosUtils';
import Purchases, { CustomerInfo, PurchasesStoreProduct, SubscriptionOption } from 'react-native-purchases';

export default class RevenueCatService {
  static async initialize(apiKey: string) {
    try {
      Purchases.configure({ apiKey });

    } catch (error) {
      console.error('Ошибка инициализации RevenueCat:', error);
      throw error;
    }
  }

  /**
  * Установка appUserID (логин в RevenueCat)
  */
  static async setUserId(appUserId: string): Promise<CustomerInfo> {
    try {
      const customerInfo = (await Purchases.logIn(appUserId)).customerInfo;
      // customerInfo обновит информацию в случае успешного логина
      return customerInfo;
    } catch (error) {
      console.error('Ошибка при логине (logIn) в RevenueCat:', error);
      throw error;
    }
  }

  /**
   * Сброс userId. Полезно при логауте пользователя
   * (чтобы отвязать его от RevenueCat).
   */
  static async logout() {
    try {
      const customerInfo: CustomerInfo = await Purchases.logOut();
      return customerInfo;
    } catch (error) {
      console.error('Ошибка при сбросе пользователя в RevenueCat:', error);
      throw error;
    }
  }

  static async getPackages() {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings?.current?.availablePackages || [];
    } catch (error) {
      handleAxiosError(error);
    }
  }

  static async getOfferings() {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings || [];
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

  /**
   * Универсальный метод: получить всю информацию о покупателе (CustomerInfo)
   * пригодится, если нужно проверить детали подписок, даты, trial и т.д.
   */
  static async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Ошибка при получении CustomerInfo:', error);
      return null;
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


  static async setUserEmail(email: string): Promise<void> {
    try {
      await Purchases.setEmail(email);
    } catch (error) {
      console.error('Ошибка при установке email:', error);
      throw error;
    }
  }

 static getFreeTrialDays(subscriptionOption: SubscriptionOption): number {
    if (!subscriptionOption.freePhase || !subscriptionOption.freePhase.billingPeriod) {
      console.log('Free trial не доступен для этой подписки');
      return 0;
    }

    const { value, unit } = subscriptionOption.freePhase.billingPeriod;
    let days = 0;

    switch (unit) {
      case 'DAY':
        days = value;
        break;
      case 'WEEK':
        days = value * 7;
        break;
      case 'MONTH':
        days = value * 30;
        break;
      case 'YEAR':
        days = value * 365;
        break;
      default:
        console.warn('Неизвестная единица измерения');
    }

    return days;
  }
  


}

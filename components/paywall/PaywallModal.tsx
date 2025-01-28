import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Portal, Text } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SubsciptionType } from '@/dtos/enum/SubscriptionType';
import { router } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import userStore from '@/stores/UserStore';
import uiStore from '@/stores/UIStore';
import RevenueCatService from '@/services/RevenueCatService';
import i18n from "@/i18n";
import BottomSheetComponent from '../common/BottomSheetComponent';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import SuccessModalContent from './SuccessModalContent';
import StartModalContent from './StartModalContent';
import MainModalContent from './MainModalContent';

const PaywallModal = () => {
  const [subscriptionType, setSubscriptionType] = useState('year');
  const [isFullBenefitsVisible, setIsFullBenefitsVisible] = useState(false);
  const [isSubcribedSuccess, setIsSubcribedSuccess] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);

  const sheetRef = useRef<BottomSheet>(null);

  // Ищем нужные пакеты
  const monthlyPackage = packages.find((pkg) => pkg.packageType === 'MONTHLY');
  const annualPackage = packages.find(
    (pkg) => pkg.packageType === 'ANNUAL' || pkg.packageType === 'YEARLY'
  );

  useEffect(() => {
    (async () => {
      // Инициализируем RevenueCat
      await RevenueCatService.initialize(
        process.env.EXPO_PUBLIC_REVENUECAT_API_KEY!
      );
      const availablePackages = await RevenueCatService.getOfferings();
      if (availablePackages) {
        setPackages(availablePackages);
      }
    })();
  }, []);

  const handleCloseModal = () => {
    if (isSubcribedSuccess) setIsSubcribedSuccess(false);
    router.back();
  };

  const openBenefits = () => setIsFullBenefitsVisible(true);

  const handleSheetOpen = (subType: string) => {
    setSubscriptionType(subType);
    sheetRef.current?.expand();
  };

  const handleSubmitPayment = async (type: string) => {
    try {
      const userId = userStore.currentUser?.id;
      if (!userId) return;

      let targetPackage = null;
      if (type === 'month' && monthlyPackage) {
        targetPackage = monthlyPackage;
      } else if (type === 'year' && annualPackage) {
        targetPackage = annualPackage;
      }

      if (targetPackage) {
        const customerInfo = await RevenueCatService.purchasePackage(targetPackage);
        // Если userCancelled == true, purchasePackage вернёт null
        if (!customerInfo) {
          console.log('Пользователь отменил покупку');
          return;
        }

        // 2. Проверяем, действительно ли подписка активна. 
        //    (например, если у вас один Entitlement с ID 'premium')
        const hasPremium = !!customerInfo.entitlements.active['Basic'];
        const hasMonthly = !!customerInfo.entitlements.active['premium_month'];
        const hasYearly  = !!customerInfo.entitlements.active['premium_year'];


        // Обновляем подписку в нашем сторе
        const subscriptionTypeId =
          type === 'year'
            ? SubsciptionType.Year
            : type === 'month'
            ? SubsciptionType.Month
            : null;

        if (subscriptionTypeId && hasPremium) {
          await uiStore.subscribe(userId, hasPremium);
          setIsSubcribedSuccess(true);
        }else{
          setIsSubcribedSuccess(false);
        }

        sheetRef.current?.close();
        setIsFullBenefitsVisible(false);
      }
    } catch (error) {
      console.error(`${i18n.t("paywall.purchaseError")}`, error);
    }
  };

  // Содержимое BottomSheet
  const BottomSheetContent = () => {
    const currentPackage =
      subscriptionType === 'year' ? annualPackage : monthlyPackage;
    const priceString = currentPackage?.product?.priceString;

    const priceSuffix =
      subscriptionType === 'year'
        ? `/ ${i18n.t("paywall.year")}`
        : `/ ${i18n.t("paywall.month")}`;

    return (
      <View className="flex-col mx-5 mt-2 mb-5">
        <Text className="text-[24px] font-semibold">
          {priceString ? `${priceString} ${priceSuffix}` : i18n.t("paywall.loading")}
        </Text>

        <CustomButtonOutlined
          title={i18n.t("paywall.subscribe")}
          handlePress={() => handleSubmitPayment(subscriptionType)}
          containerStyles="w-full bg-[#ACFFB9] mt-4 h-[46px]"
          textStyles="text-[16px]"
          fontWeight="font-semibold"
        />
      </View>
    );
  };

  return (
    <Portal>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MainModalContent>
          {isSubcribedSuccess ? (
            <SuccessModalContent />
            ) : (
            <StartModalContent
              isFullBenefitsVisible={isFullBenefitsVisible}
              subscriptionType={subscriptionType}
              annualPackage={annualPackage}
              monthlyPackage={monthlyPackage}
              setIsFullBenefitsVisible={setIsFullBenefitsVisible}
              handleCloseModal={handleCloseModal}
              setSubscriptionType={setSubscriptionType}
              handleSheetOpen={handleSheetOpen}
              handleOpenBenefits={openBenefits}
            />
          )}
        </MainModalContent>

        {/** Если открываем «шторку» с ценой — показываем BottomSheet */}
        {isFullBenefitsVisible && (
          <BottomSheetComponent
            ref={sheetRef}
            renderContent={<BottomSheetContent />}
            snapPoints={['20%']}
            enablePanDownToClose={false}
          />
        )}
      </GestureHandlerRootView>
    </Portal>
  );
};

export default PaywallModal;

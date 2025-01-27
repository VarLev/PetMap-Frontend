import { observer } from 'mobx-react-lite';
import { FC, useEffect, useRef, useState } from 'react';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { Image, View } from 'react-native';
import { RadioButton, IconButton, Portal, Text } from 'react-native-paper';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SubsciptionType } from '@/dtos/enum/SubscriptionType';
import BottomSheet from '@gorhom/bottom-sheet';

import userStore from '@/stores/UserStore';
import uiStore from '@/stores/UIStore';
import RevenueCatService from '@/services/RevenueCatService';
import i18n from "@/i18n";

import BottomSheetComponent from '../common/BottomSheetComponent';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import SubscriptionRadioButton from './SubscriptionRadioButton';
import FullBenefitsTable from './FullBenefitsTable';
import { router } from 'expo-router';

type PaywallModalProps = {
  closeModal: () => void;
};

const PaywallModal: FC<PaywallModalProps> = observer(({ closeModal }) => {
  const [subscriptionType, setSubscriptionType] = useState('');
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
    closeModal();
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

  // Иконка закрытия
  const CloseIcon = () => (
    <IconButton
      icon="close"
      size={40}
      iconColor="white"
      onPress={handleCloseModal}
    />
  );

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
        <Text className="text-[24px] font-semibold text-white">
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

  // Стартовый контент (до покупки)
  const StartModalContent = () => (
    <View className="flex-col px-4">
      {/* Шапка: стрелка назад (если benefits открыты) и крестик справа */}
      <View className="flex-row justify-between items-center mb-4">
        {isFullBenefitsVisible && (
          <IconButton
            icon="arrow-left"
            size={40}
            iconColor="white"
            onPress={() => setIsFullBenefitsVisible(false)}
          />
        )}
        <CloseIcon />
      </View>
      {/* Либо показываем картинку, либо таблицу */}
      {!isFullBenefitsVisible ? (
        <Image
          source={require('@/assets/images/paywall/Placeholder.png')}
          resizeMode="contain"
          className="mt-4 self-center"
          style={{ height: 200 }}
        />
      ) : (
        <View className="mt-4">
          <FullBenefitsTable />
        </View>
      )}
      {/* Заголовок и описание */}
      <Text className="text-[20px] font-nunitoSansBold text-center text-white">
        {i18n.t("paywall.startModal.title")}
      </Text>
      <Text className="text-[16px] text-center text-white mt-2">
        {i18n.t("paywall.startModal.text")}
      </Text>

      {/* Радио-кнопки выбора подписки */}
      <View className="mt-6">
        <RadioButton.Group
          onValueChange={(newValue) => setSubscriptionType(newValue)}
          value={subscriptionType}
        >
          <SubscriptionRadioButton
            value="year"
            sale={20}
            price={
              annualPackage
                ? `${annualPackage.product.priceString} / ${i18n.t("paywall.year")}`
                : '...'
            }
            handleOpenBenefits={openBenefits}
            checked={subscriptionType === 'year'}
            handleSheetOpen={() => handleSheetOpen('year')}
          />

          <SubscriptionRadioButton
            value="month"
            price={
              monthlyPackage
                ? `${monthlyPackage.product.priceString} / ${i18n.t("paywall.month")}`
                : '...'
            }
            handleOpenBenefits={openBenefits}
            checked={subscriptionType === 'month'}
            handleSheetOpen={() => handleSheetOpen('month')}
          />
        </RadioButton.Group>
      </View>

      {/* Пробная подписка */}
      <CustomButtonOutlined
        title={i18n.t("paywall.tryFree")}
        handlePress={() => {}}
        containerStyles="w-full bg-[#ACFFB9] mt-6 h-[46px]"
        textStyles="text-[16px]"
        fontWeight="font-semibold"
      />

    
    </View>
  );

  // Контент при успехе подписки
  const SuccessModalContent = () => (
    <View className="flex-col items-center px-4">
      <View className="flex-row w-full justify-end mb-2">
        <CloseIcon />
      </View>

      {/* Картинка «звёздочка сверху» (опционально) */}
      <Image
        source={require('@/assets/images/paywall/StarsTop.png')}
        resizeMode="contain"
        style={{ height: 115 }}
      />

      <View className="w-full flex-col items-center mt-2">
        <Image
          source={require('@/assets/images/paywall/Success.png')}
          resizeMode="contain"
          style={{ height: 220 }}
        />
        <Text className="text-[20px] font-nunitoSansBold text-center text-white mt-4">
          {i18n.t("paywall.successModal.title")}
        </Text>
        <Text className="text-[16px] text-center text-white mt-2">
          {i18n.t("paywall.successModal.text")}
        </Text>

        <CustomButtonOutlined
          title={i18n.t("paywall.thank")}
          handlePress={async ()=> {
            await uiStore.resetApp();
            router.back();
          }}
          containerStyles="w-full bg-[#ACFFB9] mt-6 h-[46px]"
          textStyles="text-[16px]"
          fontWeight="font-semibold"
        />
      </View>

      {/* «звёздочка снизу» (опционально) */}
      <Image
        source={require('@/assets/images/paywall/StarsBottom.png')}
        resizeMode="contain"
        style={{ height: 90, marginTop: 20 }}
      />
    </View>
  );

  // Общее «тело» модалки
  const MainContent = () => (
    <View>
      {/* Градиент */}
      <Svg height="100%" width="100%" className="absolute">
        <Defs>
          <RadialGradient
            id="grad"
            cx="10.38%"
            cy="0.32%"
            rx="99.68%"
            ry="99.68%"
            fx="10.38%"
            fy="0.32%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#BC88FF" />
            <Stop offset="100%" stopColor="#2F00B6" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>

      {/* Контент экрана внутри ScrollView, чтобы всё прокручивалось на мелких экранах */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 40, paddingBottom: 20 }}>
        {isSubcribedSuccess ? <StartModalContent /> : <SuccessModalContent />}
      </ScrollView>
    </View>
  );

  return (
    <Portal>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MainContent />

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
});

export default PaywallModal;

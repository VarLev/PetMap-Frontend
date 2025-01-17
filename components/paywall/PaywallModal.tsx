import { observer } from 'mobx-react-lite';
import { FC, useEffect, useRef, useState } from 'react';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { Image, StyleSheet, View } from 'react-native';
import { RadioButton, IconButton, Portal, Text } from 'react-native-paper';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SubsciptionType } from '@/dtos/enum/SubscriptionType';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import SubscriptionRadioButton from './SubscriptionRadioButton';
import BottomSheetComponent from '../common/BottomSheetComponent';
import FullBenefitsTable from './FullBenefitsTable';
import userStore from '@/stores/UserStore';
import uiStore from '@/stores/UIStore';
import RevenueCatService from '@/services/RevenueCatService';
import i18n from "@/i18n";

type PaywallModalProps = {
  closeModal: () => void;
};

const PaywallModal: FC<PaywallModalProps> = observer(({ closeModal }) => {
  const [subscriptionType, setSubscriptionType] = useState('');
  const [isFullBenefitsVisible, setIsFullBenefitsVisible] = useState(false);
  const [isSubcribedSuccess, setIsSubcribedSuccess] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const sheetRef = useRef<BottomSheet>(null);

  const monthlyPackage = packages.find((pkg) => pkg.packageType === 'MONTHLY');
  const annualPackage = packages.find((pkg) => pkg.packageType === 'ANNUAL' || pkg.packageType === 'YEARLY');

  // Можно также найти пробный период, если нужно
  const monthlyIntroPrice = monthlyPackage?.product?.introPrice;
  const annualIntroPrice = annualPackage?.product?.introPrice;

  useEffect(() => {
    (async () => {
      // Инициализация RevenueCat
      await RevenueCatService.initialize(process.env.EXPO_PUBLIC_REVENUECAT_API_KEY!);

      // Получаем массив доступных пакетов
      const availablePackages = await RevenueCatService.getOfferings();
      if (availablePackages) {
        setPackages(availablePackages);
        console.log('availablePackages', availablePackages);
      }
    })();
  }, []);

  const handleCloseModal = () => {
    if (isSubcribedSuccess) {
      setIsSubcribedSuccess(false);
    }

    closeModal();
  };

  const openBenefits = () => {
    setIsFullBenefitsVisible(true)
  }

  const handleSheetOpen = (subscriptionType: string) => {
    setSubscriptionType(subscriptionType);
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

      // Если пакет нашли, покупаем
      if (targetPackage) {
        // Покупаем через RevenueCat
        await RevenueCatService.purchasePackage(targetPackage);

        // Сохраняем у себя на сервере или в MobX, если есть логика
        const subscriptionTypeId = type === 'year' ? SubsciptionType.Year : type === 'month' ? SubsciptionType.Month : null;

        if (subscriptionTypeId) {
          await uiStore.subscribe(userId, subscriptionTypeId);
        }

        sheetRef.current?.close();
        setIsSubcribedSuccess(true);
        setIsFullBenefitsVisible(false);
      }
    } catch (error) {
      console.error(`${i18n.t("paywall.purchaseError")}`, error);
    }
  };

  const CloseIcon = () => {
    return (
      <IconButton
        icon="close"
        size={30}
        iconColor="white"
        onPress={handleCloseModal}
        style={styles.closeIcon}
      />
    )
  }

  const RenderedContent = () => {
    const currentPackage = subscriptionType === 'year' ? annualPackage : monthlyPackage;

    // Пример: currentPackage?.product?.priceString => "$4.00"
    const priceString = currentPackage?.product?.priceString;
    // Если нужно дополнить единицами (например, "/ месяц" или "/ год"), делаем это ниже
    const priceSuffix = subscriptionType === 'year' ? `/ ${i18n.t("paywall.year")}` : `/ ${i18n.t("paywall.month")}`;

    // Если есть пробный период (introPrice), можно условно вывести "7 дней бесплатно" и т.д.
    const introPrice = currentPackage?.product?.introPrice;

    return (
      <View className="flex-column mx-[20px] my-[10px]">
        <View className="flex-row justify-between items-center">
          <Text className="text-[24px] font-semibold"> {priceString ? `${priceString} ${priceSuffix}` : `${i18n.t("paywall.loading")}`}</Text>
          <Text className="text-[16px] font-semibold">{i18n.t("paywall.free")}</Text>
        </View>
        <CustomButtonOutlined
          title={i18n.t("paywall.subscribe")}
          handlePress={() => handleSubmitPayment(subscriptionType)}
          containerStyles="w-full bg-[#ACFFB9] mt-[16px] h-[46px]"
          textStyles="text-[16px]"
          fontWeight="font-semibold"
        />
      </View>
    );
  };

  const StartModalContent = () => {
    const marginBottom = !isFullBenefitsVisible ? 0 : "24%"

    return (
      <View style={{...styles.start, marginBottom: marginBottom}}>
        <View className="flex-row justify-end w-full">
          {isFullBenefitsVisible &&
            <IconButton
              icon="arrow-left"
              size={30}
              iconColor="white"
              onPress={() => setIsFullBenefitsVisible(false)}
              style={{ marginRight: "auto", marginHorizontal: 0, marginVertical: 0 }}
            />
          }
          <CloseIcon />
        </View>
        {!isFullBenefitsVisible ? (
          <Image
            source={require('@/assets/images/paywall/Placeholder.png')}
            resizeMode="contain"
            style={{height: 200, alignSelf: 'center' }}
          />
        ) : (
          <FullBenefitsTable />
        )}

        <Text className="text-[20px] font-nunitoSansBold text-center color-white mt-4">{i18n.t("paywall.startModal.title")}</Text>
        <Text className="text-[16px] text-center color-white mt-2">{i18n.t("paywall.startModal.text")}</Text>
        <View className="self-start mt-[30px]">
          <RadioButton.Group onValueChange={(newValue) => setSubscriptionType(newValue)} value={subscriptionType}>
          <SubscriptionRadioButton
              value="year"
              sale={20}
              // Если annualPackage есть, берём annualPackage.product.priceString, иначе пишем "..."
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

        <CustomButtonOutlined
          title={i18n.t("paywall.tryFree")}
          handlePress={() => {}}
          containerStyles={`w-full bg-[#ACFFB9] mt-auto h-[46px]`}
          textStyles="text-[16px]"
          fontWeight="font-semibold"
        />
      </View>
    )
  }

  const SuccessModalContent = () => {
    return (
      <View className="h-full flex-column items-center justify-center">
        <CloseIcon />
        <Image
          source={require('@/assets/images/paywall/StarsTop.png')}
          resizeMode="contain"
          style={{ height: 115, marginBottom: 'auto' }}
        />
        <View className="w-full flex-column items-center">
          <Image source={require('@/assets/images/paywall/Success.png')} resizeMode="contain" style={{ height: 220 }} />
          <Text className="text-[20px] font-nunitoSansBold text-center color-white mt-4">{i18n.t("paywall.successModal.title")}</Text>
          <Text className="text-[16px] text-center color-white  mt-2">{i18n.t("paywall.successModal.text")}</Text>
          <CustomButtonOutlined
            title={i18n.t("paywall.thank")}
            handlePress={handleCloseModal}
            containerStyles={`w-full bg-[#ACFFB9] mt-[30px] h-[46px]`}
            textStyles="text-[16px]"
            fontWeight="font-semibold"
          />
        </View>
        <Image
          source={require('@/assets/images/paywall/StarsBottom.png')}
          resizeMode="contain"
          style={{ height: 90, marginTop: 'auto' }}
        />
      </View>
    )
  }

  const Content = () => {
    return (
      <View className="h-full">
        <Svg height="100%" width="100%" className="absolute">
          <Defs>
            <RadialGradient id="grad" cx="10.38%" cy="0.32%" rx="99.68%" ry="99.68%" fx="10.38%" fy="0.32%" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#BC88FF" />
              <Stop offset="100%" stopColor="#2F00B6" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </Svg>
        <View className='px-[20px] pt-[40px] pb-[20px]'>
          {!isSubcribedSuccess ? (
            <StartModalContent />
          ) : (
            <SuccessModalContent />
          )}
        </View>
      </View>
    );
  };

  return (
    <Portal>
      <GestureHandlerRootView>
        {!isFullBenefitsVisible ? (
          <Content />
        ) : (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Content />
          </ScrollView>
        )}
        {isFullBenefitsVisible && (
          <BottomSheetComponent
            renderContent={<RenderedContent />}
            ref={sheetRef}
            snapPoints={['16%']}
            enablePanDownToClose={false}
          />
        )}
      </GestureHandlerRootView>
    </Portal>
  );
});

const styles = StyleSheet.create({
  start: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "flex-start"
  },
  closeIcon: {
    alignSelf: "flex-end",
    marginHorizontal: 0,
    marginVertical: 0
  }
})


export default PaywallModal;

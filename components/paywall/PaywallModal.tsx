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

import BottomSheetComponent from '../common/BottomSheetComponent';
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import SubscriptionRadioButton from './SubscriptionRadioButton';
import FullBenefitsTable from './FullBenefitsTable';

type PaywallModalProps = {
  closeModal: () => void;
};

const PaywallModal: FC<PaywallModalProps> = observer(({ closeModal }) => {
  const [subscriptionType, setSubscriptionType] = useState('');
  const [isFullBenefitsVisible, setIsFullBenefitsVisible] = useState(false);
  const [isSubcribedSuccess, setIsSubcribedSuccess] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);

  const sheetRef = useRef<BottomSheet>(null);

  // Определяем нужные пакеты
  const monthlyPackage = packages.find(pkg => pkg.packageType === 'MONTHLY');
  const annualPackage = packages.find(pkg => pkg.packageType === 'ANNUAL' || pkg.packageType === 'YEARLY');

  useEffect(() => {
    (async () => {
      await RevenueCatService.initialize(process.env.EXPO_PUBLIC_REVENUECAT_API_KEY!);
      const availablePackages = await RevenueCatService.getOfferings();
      if (availablePackages) {
        setPackages(availablePackages);
        console.log('availablePackages', availablePackages);
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
      if (type === 'month' && monthlyPackage) targetPackage = monthlyPackage;
      else if (type === 'year' && annualPackage) targetPackage = annualPackage;

      if (targetPackage) {
        await RevenueCatService.purchasePackage(targetPackage);

        const subscriptionTypeId =
          type === 'year'
            ? SubsciptionType.Year
            : type === 'month'
            ? SubsciptionType.Month
            : null;

        if (subscriptionTypeId) {
          await uiStore.subscribe(userId, subscriptionTypeId);
        }

        sheetRef.current?.close();
        setIsSubcribedSuccess(true);
        setIsFullBenefitsVisible(false);
      }
    } catch (error) {
      console.error('Ошибка при покупке подписки:', error);
    }
  };

  // Подкомпоненты без лишнего return
  const CloseIcon = () => (
    <IconButton
      icon="close"
      size={40}
      iconColor="white"
      onPress={handleCloseModal}
      className="z-10"
    />
  );

  const RenderedContent = () => {
    const currentPackage = subscriptionType === 'year' ? annualPackage : monthlyPackage;
    const priceString = currentPackage?.product?.priceString;
    const priceSuffix = subscriptionType === 'year' ? '/ год' : '/ месяц';
    // Пробный период, если понадобится
    const introPrice = currentPackage?.product?.introPrice;

    return (
      <View className="flex-col mx-[20px]">
        <View className="flex-row justify-between items-center">
          <Text className="text-[24px] font-semibold">
            {priceString ? `${priceString} ${priceSuffix}` : 'Загрузка...'}
          </Text>
          {/* Можно динамически подставить introPrice, если нужно */}
          <Text className="text-[16px] font-semibold">3 дня бесплатно</Text>
        </View>

        <CustomButtonOutlined
          title="Оформить подписку"
          handlePress={() => handleSubmitPayment(subscriptionType)}
          containerStyles="w-full bg-[#ACFFB9] mt-[5px] h-[46px]"
          textStyles="text-[16px]"
          fontWeight="font-semibold"
        />
      </View>
    );
  };

  const StartModalContent = () => (
    // Если нужен отступ снизу при раскрытой таблице, условно добавим класс
    <View className={`h-full -mt-4 flex-col ${
        isFullBenefitsVisible ? 'mb-[24%]' : 'mb-0'
      }`}
    >
      <View className="flex-row justify-between w-full">
        {isFullBenefitsVisible && (
          <IconButton
            icon="arrow-left"
            size={40}
            iconColor="white"
            onPress={() => setIsFullBenefitsVisible(false)}
            className="mr-auto m-0"
          />
        )}
        <CloseIcon />
      </View>

      {!isFullBenefitsVisible ? (
        <Image
          source={require('@/assets/images/paywall/Placeholder.png')}
          resizeMode="contain"
          className='-mt-12'
          style={{ height: 200, alignSelf: 'center' }}
        />
      ) : (
        <FullBenefitsTable />
      )}

      <Text className="text-[20px] font-nunitoSansBold text-center text-white mt-4">
        Премиум подписка со скидкой!
      </Text>
      <Text className="text-[16px] text-center font-nunitoSansRegular text-white mt-2">
        Оформите подписку, чтобы использовать весь функционал приложения без ограничений!
      </Text>

      <View className="self-start mt-[30px]">
        <RadioButton.Group
          onValueChange={newValue => setSubscriptionType(newValue)}
          value={subscriptionType}
        >
          <SubscriptionRadioButton
            value="year"
            sale={20}
            price={annualPackage ? `${annualPackage.product.priceString} / год` : '...'}
            handleOpenBenefits={openBenefits}
            checked={subscriptionType === 'year'}
            handleSheetOpen={() => handleSheetOpen('year')}
          />
          <SubscriptionRadioButton
            value="month"
            price={monthlyPackage ? `${monthlyPackage.product.priceString} / месяц` : '...'}
            handleOpenBenefits={openBenefits}
            checked={subscriptionType === 'month'}
            handleSheetOpen={() => handleSheetOpen('month')}
          />
        </RadioButton.Group>
      </View>

     {!isFullBenefitsVisible ? <CustomButtonOutlined
        title="Попробовать 7 дней бесплатно"
        handlePress={() => {}}
        containerStyles="w-full bg-[#ACFFB9] h-[46px]"
        textStyles="text-[16px]"
        fontWeight="font-semibold"
      /> : <View className="h-10"/>}
    </View>
  );

  const SuccessModalContent = () => (
    <View className="h-full flex-col items-center justify-center">
      <CloseIcon />
      <Image
        source={require('@/assets/images/paywall/StarsTop.png')}
        resizeMode="contain"
        style={{ height: 115, marginBottom: 'auto' }}
      />
      <View className="w-full flex-col items-center">
        <Image
          source={require('@/assets/images/paywall/Success.png')}
          resizeMode="contain"
          style={{ height: 220 }}
        />
        <Text className="text-[20px] font-nunitoSansBold text-center text-white mt-4">
          Ура! Вы оформили подписку!
        </Text>
        <Text className="text-[16px] text-center text-white mt-2">
          Добро пожаловать в семью PetMap в качестве Премиум пользователя. Теперь вам доступен весь функционал приложения.
        </Text>
        <CustomButtonOutlined
          title="Спасибо!"
          handlePress={handleCloseModal}
          containerStyles="w-full bg-[#ACFFB9] mt-[30px] h-[46px]"
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
  );

  const Content = () => (
    <View className="h-full">
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
      <View className="px-[20px] pt-[40px] pb-[20px]">
        {!isSubcribedSuccess ? <StartModalContent /> : <SuccessModalContent />}
      </View>
    </View>
  );

  return (
    <Portal>
      <GestureHandlerRootView>
        {/* Если таблица открыта, оборачиваем контент в ScrollView */}
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

export default PaywallModal;

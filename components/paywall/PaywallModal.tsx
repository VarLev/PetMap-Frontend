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

type PaywallModalProps = {
  closeModal: () => void;
};

const PaywallModal: FC<PaywallModalProps> = observer(({ closeModal }) => {
  const [subscriptionType, setSubscriptionType] = useState('');
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isFullBenefitsVisible, setIsFullBenefitsVisible] = useState(false);
  const [buttonMarginTop, setButtonMarginTop] = useState('mt-[auto]');
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

  useEffect(() => {
    if (subscriptionType) {
      setIsBottomSheetVisible(true);
    } else {
      setIsBottomSheetVisible(false);
    }
  }, [subscriptionType]);

  useEffect(() => {
    if (isFullBenefitsVisible) {
      setButtonMarginTop('my-[16px]');
    } else {
      setButtonMarginTop('mt-[auto]');
    }
  }, [isFullBenefitsVisible]);

  const handleCloseModal = () => {
    if (isSubcribedSuccess) {
      setIsSubcribedSuccess(false);
    }

    closeModal();
  };

  const openBenefits = () => setIsFullBenefitsVisible(true);

  const handleSheetClose = () => {
    sheetRef.current?.close();
  };

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
      }
    } catch (error) {
      console.error('Ошибка при покупке подписки:', error);
    }
  };

  const RenderedContent = () => {
    const currentPackage = subscriptionType === 'year' ? annualPackage : monthlyPackage;

    // Пример: currentPackage?.product?.priceString => "$4.00"
    const priceString = currentPackage?.product?.priceString;
    // Если нужно дополнить единицами (например, "/ месяц" или "/ год"), делаем это ниже
    const priceSuffix = subscriptionType === 'year' ? '/ год' : '/ месяц';

    // Если есть пробный период (introPrice), можно условно вывести "7 дней бесплатно" и т.д.
    const introPrice = currentPackage?.product?.introPrice;

    return (
      <View className="flex-column mx-[20px] my-[10px]">
        <View style={styles.BottomSheetImageBackground}>
          <Image source={require('@/assets/images/alert-dog-bonuses.webp')} resizeMode="contain" style={styles.BottomSheetImage} />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-[24px] font-semibold"> {priceString ? `${priceString} ${priceSuffix}` : 'Загрузка...'}</Text>
          <Text className="text-[16px] font-semibold">7 дней бесплатно</Text>
        </View>
        <CustomButtonOutlined
          title="Оформить подписку"
          handlePress={() => handleSubmitPayment(subscriptionType)}
          containerStyles="w-full bg-[#ACFFB9] mt-[16px] h-[46px]"
          textStyles="text-[16px]"
          fontWeight="font-semibold"
        />
      </View>
    );
  };

  const Content = () => {
    return (
      <View className="h-dvh">
        <Svg height="100%" width="100%" className="absolute">
          <Defs>
            <RadialGradient id="grad" cx="10.38%" cy="0.32%" rx="99.68%" ry="99.68%" fx="10.38%" fy="0.32%" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#BC88FF" />
              <Stop offset="100%" stopColor="#2F00B6" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </Svg>
        {!isSubcribedSuccess ? (
          <View className="h-full flex-column justify-start content-start px-[20px] pt-[40px]">
            <IconButton
              icon="close"
              size={30}
              iconColor="white"
              onPress={handleCloseModal}
              style={{ alignSelf: 'flex-end', marginHorizontal: 0, marginVertical: 0 }}
            />
            {!isFullBenefitsVisible && (
              <Image
                source={require('@/assets/images/paywall/Placeholder.png')}
                resizeMode="contain"
                style={{ maxWidth: '90%', maxHeight: '36%', alignSelf: 'center' }}
              />
            )}

            <Text className="text-[20px] font-nunitoSansBold text-center color-white mt-4">Премиум подписка со скидкой!</Text>
            <Text className="text-[16px] text-center color-white  mt-2">
              Оформите подписку, чтобы использовать весь функционал приложения без ограничений!
            </Text>
            <View className="self-start mt-6">
              <RadioButton.Group onValueChange={(newValue) => setSubscriptionType(newValue)} value={subscriptionType}>
              <SubscriptionRadioButton
                  value="year"
                  // Если annualPackage есть, берём annualPackage.product.priceString, иначе пишем "..."
                  price={
                    annualPackage
                      ? `${annualPackage.product.priceString} / год`
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
                      ? `${monthlyPackage.product.priceString} / месяц`
                      : '...'
                  }
                  handleOpenBenefits={openBenefits}
                  checked={subscriptionType === 'month'}
                  handleSheetOpen={() => handleSheetOpen('month')}
                />
              </RadioButton.Group>
            </View>
            {isFullBenefitsVisible && <FullBenefitsTable />}
            <CustomButtonOutlined
              title="Попробовать 7 дней бесплатно"
              handlePress={() => {}}
              containerStyles={`w-full bg-[#ACFFB9] ${buttonMarginTop} h-[46px]`}
              textStyles="text-[16px]"
              fontWeight="font-semibold"
            />
          </View>
        ) : (
          <View className="h-full flex-column items-center justify-center px-[20px] py-[40px]">
            <IconButton
              icon="close"
              size={30}
              iconColor="white"
              onPress={handleCloseModal}
              style={{ alignSelf: 'flex-end', marginHorizontal: 0, marginVertical: 0 }}
            />
            <Image
              source={require('@/assets/images/paywall/StarsTop.png')}
              resizeMode="contain"
              style={{ height: 115, marginBottom: 'auto' }}
            />
            <View className="w-full flex-column items-center">
              <Image source={require('@/assets/images/paywall/Success.png')} resizeMode="contain" style={{ height: 220 }} />
              <Text className="text-[20px] font-nunitoSansBold text-center color-white mt-4">Ура! Вы оформили подписку!</Text>
              <Text className="text-[16px] text-center color-white  mt-2">
                Добро пожаловать в семью PetMap в качестве Премиум пользователя. Теперь вам доступен весь функционал приложения.
              </Text>
              <CustomButtonOutlined
                title="Спасибо!"
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
        )}
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
        {isBottomSheetVisible && (
          <BottomSheetComponent
            renderContent={<RenderedContent />}
            ref={sheetRef}
            snapPoints={['46%']}
            enablePanDownToClose={true}
            onClose={handleSheetClose}
          />
        )}
      </GestureHandlerRootView>
    </Portal>
  );
});

const styles = StyleSheet.create({
  BottomSheetImageBackground: {
    width: '100%',
    backgroundColor: '#E8DFFF',
    marginBottom: 20,
    height: 240,
    borderRadius: 15,
  },
  BottomSheetImage: {
    alignSelf: 'center',
    height: 260,
    top: 9,
  },
});

export default PaywallModal;

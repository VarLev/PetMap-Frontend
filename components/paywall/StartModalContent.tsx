import { Dispatch, FC, SetStateAction } from 'react';
import { Image,  View } from 'react-native';
import { RadioButton, IconButton, Text } from 'react-native-paper';
import i18n from "@/i18n";
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';
import SubscriptionRadioButton from './SubscriptionRadioButton';
import FullBenefitsTable from './FullBenefitsTable';

type StartModalContentProps = {
    isFullBenefitsVisible: boolean;
    subscriptionType: string;
    annualPackage: any;
    monthlyPackage: any;
    setIsFullBenefitsVisible: Dispatch<SetStateAction<boolean>>;
    handleCloseModal: () => void;
    setSubscriptionType: Dispatch<SetStateAction<string>>;
    handleSheetOpen: (subType: string) => void;
    handleOpenBenefits: () => void;
    handleSubmitPayment: () => void;
}

// Стартовый контент (до покупки)
const StartModalContent: FC<StartModalContentProps> = ({
    isFullBenefitsVisible,
    subscriptionType,
    annualPackage,
    monthlyPackage,
    setIsFullBenefitsVisible,
    handleCloseModal,
    setSubscriptionType,
    handleSheetOpen,
    handleOpenBenefits,
    handleSubmitPayment
}) => {

    return (
    <View className="flex-col justify-between h-full px-4">
      {/* Шапка: стрелка назад (если benefits открыты) и крестик справа */}
      <View className="flex-row justify-between items-center z-[1]">
        {isFullBenefitsVisible && (
          <IconButton
            icon="arrow-left"
            size={40}
            iconColor="white"
            onPress={() => setIsFullBenefitsVisible(false)}
          />
        )}
        <IconButton
          icon="close"
          size={40}
          iconColor="white"
          onPress={handleCloseModal}
          className={!isFullBenefitsVisible ? "absolute left-[0] top-[0] z-[2]" : ""}
        />
      </View>
      {/* Либо показываем картинку, либо таблицу */}
      {!isFullBenefitsVisible ? (
        <Image
          source={require('@/assets/images/paywall/Placeholder.png')}
          resizeMode="contain"
          className="self-center"
          style={{ height: 220 }}
        />
      ) : (
        <FullBenefitsTable />
      )}
      {/* Заголовок и описание */}
      <Text className="text-[20px] font-nunitoSansBold text-center text-white">
        {i18n.t("paywall.startModal.title")}
      </Text>
      <Text className="text-[16px] text-center text-white mt-2 font-nunitoSansRegular">
        {i18n.t("paywall.startModal.text")}
      </Text>

      {/* Радио-кнопки выбора подписки */}
      <View className={` mt-[28px] ${isFullBenefitsVisible ? 'mb-[180px]' : ''}`}>
        <RadioButton.Group 
          onValueChange={(newValue) => setSubscriptionType(newValue)}
          value={subscriptionType}
        
        >
          <SubscriptionRadioButton
            value="year"
            sale={20}
            price={
              annualPackage
                ? `${annualPackage.product.priceString} / ${i18n.t("paywall.year")} `
                : '...'
            }
            addedText={i18n.t("paywall.yRenual")}
            handleOpenBenefits={handleOpenBenefits}
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
            addedText={i18n.t("paywall.mRenual")}
            handleOpenBenefits={handleOpenBenefits}
            checked={subscriptionType === 'month'}
            handleSheetOpen={() => handleSheetOpen('month')}
          />
        </RadioButton.Group>
      </View>

      {/* Пробная подписка */}
      <CustomButtonOutlined
        title={i18n.t("paywall.next")}
        handlePress={handleOpenBenefits}
        containerStyles="w-full bg-[#ACFFB9] mt-6 h-[46px]"
        textStyles="text-[16px]"
        fontWeight="font-semibold"
      />
    
    </View>
  )};

  export default StartModalContent;
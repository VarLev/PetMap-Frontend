import { Image, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { router } from 'expo-router';
import uiStore from '@/stores/UIStore';
import i18n from "@/i18n";
import CustomButtonOutlined from '../custom/buttons/CustomButtonOutlined';

// Контент при успехе подписки
const SuccessModalContent = () => {

  const closeModal = async () => {
    await uiStore.resetApp();
    router.back();
  }

  return (
    <View className="h-full flex-col items-center px-4 pt-6 justify-between">
      <IconButton
        icon="close"
        size={40}
        iconColor="white"
        onPress={closeModal}
        style={{position: "absolute", right: 0, zIndex: 1}}
      />
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
          handlePress={closeModal}
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
)};

export default SuccessModalContent;
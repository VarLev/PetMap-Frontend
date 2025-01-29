import React from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import CustomAlert from "./CustomAlert";
import i18n from "@/i18n";

interface SupportAlertProps {
  isVisible: boolean;
  onClose: () => void;
}

const SupportAlert: React.FC<SupportAlertProps> = ({ isVisible, onClose }) => {
  return (
    <CustomAlert
      isVisible={isVisible}
      onClose={onClose}
      message={i18n.t("permissions")}
      type="info"
      renderContent={() => (
        <View className="flex items-center">
          <Text className="text-lg font-nunitoSansBold text-center mb-2">
            {i18n.t("support.support_title")}
          </Text>
          <Text className="text-sm font-nunitoSansRegular text-center mb-5">
            {i18n.t("support.support_description")}
          </Text>

          <TouchableOpacity
            className="flex-row items-center mb-4"
            onPress={() => {
              const telegramUrl = 'https://t.me/petmap_app';
              Linking.openURL(telegramUrl).catch((err) => console.error('Не удалось открыть Telegram', err));
            }}
          >
            <Image
              source={{ uri: 'https://img.icons8.com/color/48/telegram-app.png' }}
              className="w-6 h-6 mr-3"
            />
            <Text className="text-base font-nunitoSansBold text-blue-500">
              {i18n.t("support.telegram")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center mb-4"
            onPress={() => {
              const email = 'mailto:info@petmap.app';
              Linking.openURL(email).catch((err) => console.error('Не удалось открыть почту', err));
            }}
          >
            <Image
              source={{ uri: 'https://img.icons8.com/color/48/gmail-new.png' }}
              className="w-6 h-6 mr-3"
            />
            <Text className="text-base font-nunitoSansBold text-blue-500">
              {i18n.t("support.email")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => {
              const whatsappUrl = 'https://wa.me/5491121938641';
              Linking.openURL(whatsappUrl).catch((err) => console.error('Не удалось открыть WhatsApp', err));
            }}
          >
            <Image
              source={{ uri: 'https://img.icons8.com/color/48/whatsapp.png' }}
              className="w-6 h-6 mr-3"
            />
            <Text className="text-base font-nunitoSansBold text-blue-500">
              {i18n.t("support.whatsapp")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default SupportAlert;
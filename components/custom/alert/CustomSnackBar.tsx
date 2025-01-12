import { useState, useEffect } from "react";
import { View, Pressable, Platform } from "react-native";
import { Snackbar, Text } from "react-native-paper";
import i18n from "@/i18n";

interface CustomSnackBarProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}
function CustomSnackBar({ visible, setVisible }: CustomSnackBarProps) {
  const [isIOS, setIsIOS] = useState(false);

  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    setIsIOS(Platform.OS === "ios");
  }, []);

  return (
    <View className={`z-10 items-center justify-center ${isIOS ? "pt-24" : "pt-16"}`}>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={5000}
        className="bg-white rounded-3xl"
      >
        <Pressable onPress={onDismissSnackBar}>
          <Text className="text-black font-regular text-base font-nunitoSansRegular text-center -mb-1">
            {i18n.t("Snackbar.noResults")}
          </Text>
        </Pressable>
      </Snackbar>
    </View>
  );
}

export default CustomSnackBar;
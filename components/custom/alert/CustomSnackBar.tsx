import { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
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
    <View style={isIOS ? styles.containerIOS : styles.container}>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={5000}
        style={{ backgroundColor: "white", borderRadius: 30 }}
      >
        <Pressable onPress={onDismissSnackBar}>
          <Text
            style={{
              color: "black",
              fontFamily: "font-nunitoSansRegular",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            {i18n.t("Snackbar.noResults")}
          </Text>
        </Pressable>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    paddingLeft: 10,
    paddingRight: 10,
    opacity: 0.85,
    textAlignVertical: "center",
    paddingTop: 65,
  },
  containerIOS: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    paddingLeft: 10,
    paddingRight: 10,
    opacity: 0.85,
    textAlignVertical: "center",
    paddingTop: 95,
  },
});

export default CustomSnackBar;
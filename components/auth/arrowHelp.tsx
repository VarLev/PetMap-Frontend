import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import i18n from "@/i18n"; // Импорт i18n для мультиязычности

type ArrowHelpProps = {
  onPressArrow: () => void;
  onPressHelp: () => void;
};

function ArrowHelp({onPressArrow, onPressHelp}: ArrowHelpProps) {
  

  return (
    <View className="flex-row justify-between items-center">
      <IconButton icon="arrow-left" size={26} onPress={onPressArrow} />
      <Text
        onPress={onPressHelp}
        className="text-lg font-nunitoSansBold"
      >
        {i18n.t('arrowHelp.help')}
      </Text>
    </View>
  );
}

export default ArrowHelp;

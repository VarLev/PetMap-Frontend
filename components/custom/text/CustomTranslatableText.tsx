import { FC, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BG_COLORS } from '@/constants/Colors';
import IconSelectorComponent from '../icons/IconSelectorComponent';
import CustomAlert from '../alert/CustomAlert';
import uiStore from '@/stores/UIStore';

interface TranslatableTextProps {
  text: string;
  textClassName?: string;
  _className?: string;
  iconSize?: number;
}

const TranslatableText: FC<TranslatableTextProps> = ({
  text,
  _className = '', // Указываем пустую строку как значение по умолчанию
  textClassName,
  iconSize = 24
}) => {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const translatedText = await uiStore.translateText(text);
      setTranslatedText(translatedText);
    } catch (error) {
      setModalVisible(true);
      setModalMessage('Не удалось перевести текст');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTranslation = () => {
    setTranslatedText(null);
  };

  return (
    <View className={_className}>
      <Text className={`text-base font-nunitoSansRegular ${textClassName}`}>
        {translatedText || text}
      </Text>
      {!translatedText ? (
        <TouchableOpacity
          onPress={handleTranslate}
          disabled={loading}
          className="h-6 justify-start items-start"
        >
          {!loading ? (
            <IconSelectorComponent
              iconSet="MaterialIcons"
              iconName={'g-translate'}
              size={iconSize}
              color={BG_COLORS.violet[300]}
            />
          ) : (
            <ActivityIndicator size="small" color={BG_COLORS.violet[300]} />
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleCancelTranslation}
          className="h-6 justify-start items-start"
        >
          <IconSelectorComponent
            iconSet="Ionicons"
            iconName={'close-circle-outline'}
            size={iconSize}
            color={BG_COLORS.violet[300]}
          />
        </TouchableOpacity>
      )}
      <CustomAlert
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMessage}
        type="info"
      />
    </View>
  );
};

export default TranslatableText;

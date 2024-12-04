import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import IconSelectorComponent from '../icons/IconSelectorComponent';
import { BG_COLORS } from '@/constants/Colors';
import CustomAlert from '../alert/CustomAlert';
import uiStore from '@/stores/UIStore';

interface TranslatableTextProps {
  text: string;
  className?: string;
}

const TranslatableText: React.FC<TranslatableTextProps> = ({
  text,
  className = '', // Указываем пустую строку как значение по умолчанию
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
    <View className={className}>
      <Text className="text-base font-nunitoSansRegular">
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
              size={24}
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
            size={24}
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

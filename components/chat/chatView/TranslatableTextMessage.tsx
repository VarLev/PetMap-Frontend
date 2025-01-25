import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { MessageType } from '@flyerhq/react-native-chat-ui'
import uiStore from '@/stores/UIStore'
import userStore from '@/stores/UserStore'
import { observer } from 'mobx-react-lite'
import i18n from '@/i18n'

// Описываем пропы компонента
interface TranslatableTextMessageProps {
  message: MessageType.Text
  translatedText?: string
  isLoading?: boolean
  onTranslate: (message: MessageType.Text) => void
  onShowOriginal: (messageId: string) => void
}

const TranslatableTextMessage: React.FC<TranslatableTextMessageProps> = observer(
  ({ message, translatedText, isLoading, onTranslate, onShowOriginal }) => {
  // Либо показываем переведённый текст, либо оригинальный
  const textToDisplay = translatedText ?? message.text;
  
  const hasSubscription = userStore.getUserHasSubscription() ?? false;
  const isFromOtherUser = message.author.id !== userStore.currentUser?.id

  return (
    <View className="p-2 my-1">
      <Text selectable={true} className="text-base mb-0 font-nunitoSansRegular">{textToDisplay}</Text>

      {/* Если перевод загружается, показываем индикатор */}
      {uiStore.isChatTranslatinEnabled && hasSubscription && isFromOtherUser && (
        isLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            {translatedText ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onShowOriginal(message.id)}
                className="px-2 py-1 rounded self-start"
              >
                <Text className='text-gray-500 text-xs font-nunitoSansBold'>{i18n.t("translation.reverse")}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onTranslate(message)}
                className="px-2 py-1 rounded self-start"
              >
                <Text className='text-gray-500 text-xs font-nunitoSansRegular'>{i18n.t("translation.translate")}</Text>
              </TouchableOpacity>
            )}
          </>
        )
      )}
      
    </View>
  )
});  

export default TranslatableTextMessage
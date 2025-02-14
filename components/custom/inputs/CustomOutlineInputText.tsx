import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text';
import { View, Text } from 'react-native';
import { BG_COLORS } from '@/constants/Colors';

type AllowedSymbol = 'latin' | 'spanish' | 'cyrillic';

type InputTextProps = {
  value?: string | number;
  placeholder?: string;
  handleChange?: (text: string) => void;
  containerStyles?: string;
  label?: string;
  numberOfLines?: number;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  mask?: string; // Опциональная маска
  maxLength?: number;
  onPress?: () => void;
  editable?: boolean;
  allowOnlyLetters?: boolean; // Флаг для разрешения только букв
  /** Массив наборов разрешённых символов. Возможные варианты:
   * - 'latin' — базовая латиница (a-zA-Z)
   * - 'spanish' — испанские диакритические символы (áéíóúÁÉÍÓÚüÜñÑ)
   * - 'cyrillic' — кириллица (а-яА-Я)
   */
  allowedSymbols?: AllowedSymbol[];
};

const CustomOutlineInputText = ({
  value,
  placeholder,
  handleChange,
  containerStyles,
  label,
  numberOfLines,
  keyboardType,
  mask, // Опциональная маска для поля ввода
  maxLength,
  onPress,
  editable = true,
  allowOnlyLetters = false,
  // Если не передали массив, по умолчанию разрешаем латиницу, испанские символы и кириллицу
  allowedSymbols,
}: InputTextProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (text: string) => {
    let processedText = text;
    if (allowOnlyLetters) {
      // Если массив не передан или пустой, используем значение по умолчанию
      const allowedSet: AllowedSymbol[] =
        allowedSymbols && allowedSymbols.length ? allowedSymbols : ['latin', 'spanish', 'cyrillic'];

      let allowedChars = '';

      if (allowedSet.includes('latin')) {
        allowedChars += 'a-zA-Z';
      }
      if (allowedSet.includes('spanish')) {
        // Добавляем испанские символы: áéíóúÁÉÍÓÚüÜñÑ
        allowedChars += 'áéíóúÁÉÍÓÚüÜñÑ';
      }
      if (allowedSet.includes('cyrillic')) {
        allowedChars += 'а-яА-Я';
      }

      // Создаём регулярное выражение, которое удаляет всё, что не входит в разрешённый набор и не является пробелом
      const regex = new RegExp(`[^${allowedChars}\\s]`, 'g');
      processedText = text.replace(regex, '');
    }
    if (handleChange) {
      handleChange(processedText);
    }
  };

  return (
    <>
      {mask ? (
        <View>
          {label && (
            <Text
              className="font-nunitoSansRegular"
              style={{
                color: BG_COLORS.gray[700],
                fontFamily: 'NunitoSans_400Regular',
                fontSize: 12,
                position: 'absolute',
                top: 9,
                left: 8,
                backgroundColor: '#fff',
                paddingHorizontal: 4,
                zIndex: 3001,
              }}
            >
              {label}
            </Text>
          )}
          <TextInputMask
            type={'custom'}
            options={{
              mask: mask,
            }}
            value={value !== undefined ? String(value) : ''}
            onChangeText={handleTextChange}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              fontFamily: 'NunitoSans_400Regular',
              fontSize: 16,
              color: '#363636',
              borderColor: isFocused ? '#7038c9' : '#bababa',
              borderRadius: 8,
              borderWidth: isFocused ? 2 : 1,
              marginTop: 18,
              backgroundColor: '#ffffff',
              padding: 10,
            }}
            className={`text-base font-nunitoSansBold bg-white ${containerStyles}`}
            keyboardType={keyboardType || 'default'}
          />
        </View>
      ) : (
        <TextInput
          maxLength={maxLength}
          multiline={!!numberOfLines && numberOfLines > 1}
          label={label}
          value={value !== undefined ? String(value) : ''}
          placeholder={placeholder}
          onChangeText={handleTextChange}
          onEndEditing={(d) => handleTextChange(d.nativeEvent.text)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          mode="outlined"
          className={`mt-1 text-base font-nunitoSansBold bg-white ${containerStyles}`}
          contentStyle={{ fontFamily: 'NunitoSans_400Regular', fontSize: 16, color: '#363636' }}
          style={{ fontFamily: 'NunitoSans_400Regular', fontSize: 16 }}
          numberOfLines={numberOfLines || 1}
          outlineStyle={{
            borderColor: isFocused ? '#7038c9' : '#bababa',
          }}
          keyboardType={keyboardType || 'default'}
          onPress={onPress}
          editable={editable}
          theme={{
            fonts: {
              bodyLarge: { fontFamily: 'NunitoSans_400Regular' },
            },
            roundness: 8,
          }}
        />
      )}
    </>
  );
};

export default CustomOutlineInputText;

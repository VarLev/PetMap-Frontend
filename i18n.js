import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';

// Импортируем переводы из отдельных JSON-файлов
import en from './locales/en/translation.json';
import ru from './locales/ru/translation.json';
import es from './locales/es/translation.json';

// Настраиваем объект с переводами
const translations = {
  es,
  ru,
  en,
};

// Инициализация i18n с переводами
const i18n = new I18n(translations);

// Установка текущего языка на основе языка устройства
i18n.locale = getLocales()[0].languageCode;

// Включение резервного языка (если в текущем языке отсутствует перевод, используется другой язык)
i18n.enableFallback = true;

export default i18n;
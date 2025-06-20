import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import translationEN from './locales/en.json';
import translationHI from './locales/hi.json';
import translationTA from './locales/ta.json';
import translationTE from './locales/te.json';
import translationKN from './locales/kn.json';
import translationML from './locales/ml.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  hi: {
    translation: translationHI
  },
  ta: {
    translation: translationTA
  },
  te: {
    translation: translationTE
  },
  kn: {
    translation: translationKN
  },
  ml: {
    translation: translationML
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    keySeparator: '.', // allows hierarchical keys
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationUA from './locales/ua/common.json';
import errorsUA from './locales/ua/errors.json';
import translationRU from './locales/ru/common.json';
import errorsRU from './locales/ru/errors.json';
import translationEN from './locales/en/common.json';
import errorsEN from './locales/en/errors.json';
import translationPT from './locales/pt/common.json';
import errorsPT from './locales/pt/errors.json';
import translationZH from './locales/zh/common.json';
import errorsZH from './locales/zh/errors.json';

// To fix an incompatibility between the return value of the 't' function
// and the Header property of the Column object of the react-table library
declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

const resources = {
  ua: {
    common: translationUA,
    errors: errorsUA,
  },
  ru: {
    common: translationRU,
    errors: errorsRU,
  },
  en: {
    common: translationEN,
    errors: errorsEN,
  },
  pt: {
    common: translationPT,
    errors: errorsPT,
  },
  zh: {
    common: translationZH,
    errors: errorsZH,
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'ru',
  ns: ['common', 'errors'],
  defaultNS: 'common',
});

export default i18n;

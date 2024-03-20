import { useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from'./locales/en/translations.json'
import ro from'./locales/ro/translations.json'
i18n.use(initReactI18next).init({
  fallbackLng: 'ro',
  lng: 'ro',
  resources: {
    en: {
      translations: en
    },
    ro: {
      translations: ro
    }
  },
  ns: ['translations'],
  defaultNS: 'translations'
});

i18n.languages = ['en', 'ro'];

export default i18n;
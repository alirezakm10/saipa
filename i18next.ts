// i18next.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {en, enNav, enSideNav, enFormBuilder} from './public/locales/en'
import {fa, faNav, faSideNav, faFormBuilder} from './public/locales/fa'

i18n.use(LanguageDetector).use(initReactI18next);

let language: string;

// Check if the code is running on the client-side
if (typeof window !== 'undefined') {
  // Access localStorage only if running on the client
  language = localStorage.getItem('i18nextLng') || 'fa';
} else {
  // Use a default language for the server-side (e.g., 'en')
  language = 'fa';
}

i18n.init({
  resources: {
    en: {
      translation: { ...en,...enNav, ...enSideNav, ...enFormBuilder }
    },
    fa: {
      translation: { ...fa, ...faNav, ...faSideNav, ...faFormBuilder }
    }
  },
  lng: language, // Use the language from localStorage as the initial language
  fallbackLng: 'fa',
  interpolation: {
    escapeValue: true
  }
});

export default i18n;

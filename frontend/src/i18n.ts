import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';
}

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en'],
    ns: ['common', 'outreach', 'lesson-plans', 'explore', 'expeditions', 'media', 'map', 'ai', 'admin'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
    saveMissing: false,
  });

export default i18n;

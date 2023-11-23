import { createI18n } from 'vue-i18n';

import enUS from './locales/en.json';
import ruRU from './locales/ru.json';
import esES from './locales/es.json';
import hiIN from './locales/hi.json';

// Type-define 'en-US' as the master schema for the resource
type MessageSchema = typeof enUS;
type Locales = 'en' | 'ru' | 'es' | 'hi';

const i18n = createI18n<[MessageSchema], Locales>({
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  legacy: false,
  globalInjection: true,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  messages: {
    'en': enUS,
    'ru': ruRU,
    'es': esES,
    'hi': hiIN,
  },
});

export default i18n;

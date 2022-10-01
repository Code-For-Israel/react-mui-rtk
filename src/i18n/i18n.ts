import i18n, { Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'

const resources: Resource = {
  en: {
    translation: en,
  },
}

i18n.use(initReactI18next).init({
  resources,
  supportedLngs: ['en'],
  fallbackLng: 'en',
  keySeparator: '.',
  interpolation: {
    escapeValue: false,
  },
})

export { i18n }

import i18n from 'i18next';
import { DefaultNamespace, initReactI18next, TFuncKey, Resources } from 'react-i18next';
import { resources, defaultLang, getProcessForDisplay } from 'sr2020-mm-translations';

const availableLangs = Object.keys(resources);

const REACT_APP_LANG = (process.env.REACT_APP_LANG || '').toLowerCase();

console.log('REACT_APP_LANG', REACT_APP_LANG);

const lang = availableLangs.includes(REACT_APP_LANG) ? REACT_APP_LANG : defaultLang;

export const processForDisplay = getProcessForDisplay(lang);

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: lang,

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export { i18n };

// This stuff adds type checking of translation keys
declare module 'react-i18next' {
  type DefaultResources = typeof resources[typeof defaultLang];
  interface Resources extends DefaultResources {}
}
// type SRTKeys = TFuncKey<DefaultNamespace, Resources>

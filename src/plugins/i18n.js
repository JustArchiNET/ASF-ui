import * as storage from '../utils/storage';
import i18n from '../i18n/lib';
import isAprilFoolsDay from '../utils/isAprilFoolsDay';

// https://webpack.js.org/guides/dependency-management/#require-context
const requireLocale = require.context('../i18n/locale', false, /.json$/, 'lazy');

const availableLocales = requireLocale.keys().map(fileName => {
  if (fileName === './default.json') return { name: 'en-US', fileName };
  return { name: fileName.replace('./', '').replace('.json', ''), fileName };
}).filter(Boolean);

function getUserLocale(availableLocales, fallbackLocale) {
  const selectedLocale = storage.get('locale');
  if (selectedLocale && availableLocales.includes(selectedLocale)) return selectedLocale;

  if (isAprilFoolsDay && availableLocales.includes('lol-US')) return 'lol-US';

  let locale = navigator.language;
  if (!locale) return fallbackLocale;

  if (availableLocales.includes(locale)) return locale;

  // Remove regional code, if present
  if (locale.includes('-')) {
    locale = locale.split('-')[0];
    if (availableLocales.includes(locale)) return locale;
  }

  // Try default regional code
  if (availableLocales.includes(`${locale}-${locale.toUpperCase()}`)) return `${locale}-${locale.toUpperCase()}`;

  // Find locale with any regional code
  const localeRegex = new RegExp(`${locale}\-\\\S\\\S`);
  const matchedLocale = availableLocales.find(locale => localeRegex.test(locale));
  if (matchedLocale) return matchedLocale;

  return fallbackLocale;
}

export default {
  install(Vue, store) {
    Vue.use(i18n, store, {
      locale: getUserLocale(availableLocales.map(locale => locale.name), 'en-US'),
      fallbackLocale: 'en-US',
      availableLocales,
      requireLocale,
    });
  },
};

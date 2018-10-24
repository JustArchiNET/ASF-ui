import i18n from '../i18n/lib';

import enUS from '../i18n/locale/default.json';

// https://webpack.js.org/guides/dependency-management/#require-context
const requireLocale = require.context('../i18n/locale', false, /.json$/, 'lazy');

const availableLocale = requireLocale.keys().map(fileName => {
	if (fileName === './default.json') return { locale: 'en-US', fileName };
	return { locale: fileName.replace('./', '').replace('.json', ''), fileName };
}).filter(Boolean);

export default {
	install(Vue, store, options) {
		Vue.use(i18n, store, {
			locale: 'en-US',
			fallbackLocale: 'en-US',
			translations: {
				'en-US': enUS
			}
		});

		Vue.i18n.loadLocale = async function loadLocale(name) {
			const locale = availableLocale.find(locale => locale.name === name);
			if (!locale) return console.warn(`[i18n] Locale ${name} not available!`);
			Vue.i18n.add(name, await requireLocale(locale.fileName));
			Vue.i18n.set(name);
		}
	}
}

import i18n from '../i18n/lib';

// https://webpack.js.org/guides/dependency-management/#require-context
const requireLocale = require.context('../i18n/locale', false, /.json$/, 'lazy');

const availableLocales = requireLocale.keys().map(fileName => {
	if (fileName === './default.json') return { name: 'en-US', fileName };
	return { name: fileName.replace('./', '').replace('.json', ''), fileName };
}).filter(Boolean);

export default {
	install(Vue, store, options) {
		Vue.use(i18n, store, {
			availableLocales,
			requireLocale,
			...options
		});
	}
}

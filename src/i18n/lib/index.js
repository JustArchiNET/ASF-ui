import storeModule from './store';
import Formatter from './formatter';

const requireLocale = require.context('../locale', false, /.json$/, 'lazy');

const availableLocale = requireLocale.keys().map(fileName => {
	if (fileName === './default.json') return { name: 'en-US', fileName };
	return { name: fileName.replace('./', '').replace('.json', ''), fileName };
}).filter(Boolean);

export default {
	install(Vue, store, config) {
		if (this.installed) return;
		this.installed = true;

		store.registerModule('i18n', storeModule);

		const formatter = new Formatter();

		const translate = function $t(key, values) {
			console.log(`Translating ${key}...`);
			const translationLocale = store.getters['i18n/translationLocale'](key);
			const translationString = translationLocale ? store.getters['i18n/translation'](translationLocale, key) : key;
			return formatter.interpolate(translationString, values, translationLocale);
		};

		const has = name => store.getters['i18n/locales'].includes(name);

		const load = async function loadLocale(name) {
			if (has(name)) return;

			const locale = availableLocale.find(locale => locale.name === name);
			if (!locale) throw new Error(`[i18n] Locale ${name} not available!`);

			store.dispatch('i18n/addLocale', { locale: name, translation: await requireLocale(locale.fileName) });
		};

		const set = async function setLocale(name) {
			const oldLocale = store.getters['i18n/locale'];
			store.dispatch('i18n/setLocale', { locale: name });

			await load(name).catch(err => {
				console.warn(err.message);
				store.dispatch('i18n/setLocale', { locale: oldLocale })
			});
		};

		const i18n = {
			get locales() { return store.getters['i18n/locales']; },
			get locale() { return store.getters['i18n/locale']; },
			get fallbackLocale() { return store.getters['i18n/fallbackLocale']; },
			has,
			set,
			translate
		};

		Vue.prototype.$i18n = i18n;
		Vue.prototype.$t = translate;
		Vue.i18n = i18n;

		if (config.locale) set(config.locale);
		if (config.fallbackLocale) store.dispatch('i18n/setFallbackLocale', { locale: config.fallbackLocale });
	}
}

import storeModule from './store';
import Formatter from './formatter';

export default {
  install(Vue, store, config = {}) {
    if (this.installed) return;
    this.installed = true;

    store.registerModule('i18n', storeModule);

    const formatter = new Formatter();

    const i18n = {
      _availableLocales: [],
      _requireLocale() {},
      get locales() { return store.getters['i18n/locales']; },
      get locale() { return store.getters['i18n/locale']; },
      get fallbackLocale() { return store.getters['i18n/fallbackLocale']; },
      get availableLocales() { return this._availableLocales.map(locale => locale.name); },
      get translationPercent() { return store.getters['i18n/translationPercent']; },
      get noRegionalLocale() { return store.getters['i18n/noRegionalLocale']; },
      setAvailableLocales(availableLocales, requireLocale) {
        this._availableLocales = availableLocales;
        this._requireLocale = requireLocale;
      },
      has(name) {
        return store.getters['i18n/locales'].includes(name);
      },
      async set(name) {
        const oldLocale = this.locale;
        store.dispatch('i18n/setLocale', { locale: name });

        this.load(name).catch(err => {
          console.warn(err.message);
          store.dispatch('i18n/setLocale', { locale: oldLocale });
        });
      },
      async load(name) {
        if (this.has(name)) return;

        const locale = this._availableLocales.find(locale => locale.name === name);
        if (!locale) throw new Error(`[i18n] Locale "${name}" not available!`);

        store.dispatch('i18n/addLocale', { locale: name, translation: await this._requireLocale(locale.fileName) });
      },
      translate(key, fallbackString, values) {
        if (typeof fallbackString !== 'string') values = fallbackString;

        const translationLocale = store.getters['i18n/translationLocale'](key);
        const translationString = (translationLocale) ? store.getters['i18n/translation'](translationLocale, key) : (fallbackString || key);
        return formatter.interpolate(translationString, values, translationLocale);
      },
    };

    const finalConfig = {
      locale: 'en-US',
      translations: {},
      availableLocales: [],
      requireLocale() { },
      ...config,
    };

    i18n._availableLocales = finalConfig.availableLocales;
    i18n._requireLocale = finalConfig.requireLocale;

    Object.keys(finalConfig.translations).forEach(locale => store.dispatch('i18n/addLocale', { locale, translation: finalConfig.translations[locale] }));

    i18n.set(finalConfig.locale);

    if (finalConfig.fallbackLocale) i18n.load(finalConfig.fallbackLocale);
    store.dispatch('i18n/setFallbackLocale', { locale: finalConfig.fallbackLocale || finalConfig.locale });

    Vue.prototype.$i18n = i18n;
    Vue.prototype.$t = i18n.translate;
    Vue.i18n = i18n;
  },
};

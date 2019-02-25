import Vue from 'vue';
import flatten from 'flat';

export default {
	namespaced: true,
	state: {
		locale: null,
		fallbackLocale: null,
		translations: {}
	},
	mutations: {
		setLocale(state, { locale }) {
			state.locale = locale;
		},
		setFallbackLocale(state, { locale }) {
			state.fallbackLocale = locale;
		},
		addLocale(state, { locale, translation }) {
			Vue.set(state.translations, locale, flatten(translation));
		},
		removeLocale(state, { locale }) {
			Vue.delete(state.translations, locale);
		}
	},
	actions: {
		setLocale({ commit }, payload) {
			commit('setLocale', payload);
		},
		setFallbackLocale({ commit }, payload) {
			commit('setFallbackLocale', payload);
		},
		addLocale({ commit }, payload) {
			commit('addLocale', payload);
		},
		removeLocale({ commit }, payload) {
			commit('removeLocale', payload);
		}
	},
	getters: {
		locale: state => state.locale,
		fallbackLocale: state => state.fallbackLocale,
		locales: state => Object.keys(state.translations),
		translation: state => (locale, key) => state.translations[locale][key],
		hasTranslation: state => (locale, key) => !!locale && !!state.translations[locale] && !!state.translations[locale][key],
		noRegionalLocale: state => (state.locale ? state.locale.split('-')[0] : state.locale),
		translationLocale: (state, getters) => key => {
			if (state.locale && getters.hasTranslation(state.locale, key)) return state.locale;
			if (getters.noRegionalLocale && getters.hasTranslation(getters.noRegionalLocale, key)) return getters.noRegionalLocale;
			if (state.fallbackLocale && getters.hasTranslation(state.fallbackLocale, key)) return state.fallbackLocale;
		},
		translationPercent: (state, getters) => {
			if (!state.locale || !state.fallbackLocale) return 0;
			if (!state.translations[state.locale] || !state.translations[state.fallbackLocale]) return 0;
			const availableStrings = Object.keys(state.translations[state.fallbackLocale]);
			return (availableStrings.filter(key => getters.hasTranslation(state.locale, key)).length / availableStrings.length) * 100;
		}
	}
};

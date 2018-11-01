import * as storage from '../../utils/storage';

export const state = {
	smallNavigation: false,
	sideMenu: false,
	theme: 'blue',
	availableThemes: ['blue', 'red', 'teal', 'purple', 'green', 'orange'],
	boxed: false,
	darkMode: false
};

export const mutations = {
	setSmallNavigation: (state, value) => state.smallNavigation = value,
	toggleNavigation: state => state.smallNavigation = !state.smallNavigation,
	changeTheme: (state, theme) => state.theme = theme,
	toggleSideMenu: state => state.sideMenu = !state.sideMenu,
	toggleBoxed: state => state.boxed = !state.boxed,
	setBoxed: (state, value) => state.boxed = value,
	toggleDarkMode: state => state.darkMode = !state.darkMode,
	setDarkMode: (state, value) => state.darkMode = value
};

export const actions = {
	init: ({ commit }) => {
		const smallNavigation = storage.get('small-navigation');
		if (smallNavigation) commit('setSmallNavigation', JSON.parse(smallNavigation));
		if (window.innerWidth < 700) commit('toggleNavigation');

		const theme = storage.get('theme');
		if (theme) commit('changeTheme', theme);

		const boxed = storage.get('boxed-layout');
		if (boxed) commit('setBoxed', JSON.parse(boxed));
		else if (window.innerWidth >= 2560) commit('setBoxed', true);

		const darkMode = storage.get('dark-mode');
		if (darkMode) commit('setDarkMode', JSON.parse(darkMode));
	},
	toggleNavigation: ({ commit, getters }) => {
		commit('toggleNavigation');
		storage.set('small-navigation', JSON.parse(getters.smallNavigation));
	},
	toggleSideMenu: ({ commit }) => {
		commit('toggleSideMenu');
	},
	changeTheme: ({ commit }, theme) => {
		commit('changeTheme', theme);
		storage.set('theme', theme);
	},
	toggleBoxed: ({ commit, getters }) => {
		commit('toggleBoxed');
		storage.set('boxed-layout', JSON.parse(getters.boxed));
	},
	toggleDarkMode: ({ commit, getters }) => {
		commit('toggleDarkMode');
		storage.set('dark-mode', JSON.parse(getters.darkMode));
	}
};

export const getters = {
	smallNavigation: state => state.smallNavigation,
	sideMenu: state => state.sideMenu,
	theme: state => state.theme,
	availableThemes: state => state.availableThemes,
	boxed: state => state.boxed,
	darkMode: state => state.darkMode
};

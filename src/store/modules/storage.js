import * as http from '../../plugins/http';
import * as storage from '../../utils/storage';

export const state = {
  theme: 'blue',
  darkMode: false,
};

export const mutations = {
  changeTheme: (state, theme) => (state.theme = theme),
  setDarkMode: (state, value) => (state.darkMode = value),
  toggleDarkMode: state => (state.darkMode = !state.darkMode),
};

export const actions = {
  init: async ({ commit }) => {
    try {
      // get setting from ASF
      const response = await http.get('/storage/asfui-settings');
      const { theme: asfTheme, darkMode: asfDarkmode } = response;

      // get setting from local storage
      const localTheme = storage.get('layout:theme');
      const localDarkMode = storage.get('layout:dark-mode');

      // set setting. local > ASF
      const theme = localTheme ?? asfTheme;
      const darkMode = localDarkMode ?? asfDarkmode;

      commit('changeTheme', theme);
      if (typeof darkMode === 'boolean') commit('setDarkMode', darkMode);
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) commit('setDarkMode', true);

      http.post('/storage/asfui-settings', state);
    } catch (err) {
      console.warn(err.message);
    }
  },
  changeTheme: ({ commit, state }, theme) => {
    commit('changeTheme', theme);
    storage.set('layout:theme', theme);
    http.post('/storage/asfui-settings', state);
  },
  toggleDarkMode: ({ commit, getters }) => {
    commit('toggleDarkMode');
    storage.set('layout:dark-mode', getters.darkMode);
    http.post('/storage/asfui-settings', state);
  },
};

export const getters = {
  theme: state => state.theme,
  darkMode: state => state.darkMode,
};

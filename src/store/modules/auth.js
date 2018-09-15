import { get, authenticate, updateBaseURL } from '../../utils/http';

export const state = {
  password: null,
  baseURL: `${window.location.protocol}//${window.location.host}`,
  validPassword: false
};

export const mutations = {
  setPassword: (state, password) => {
    state.password = password;
    authenticate(password);
    localStorage.setItem('ipc-password', password);
  },
  setBaseURL: (state, baseURL) => {
    state.baseURL = baseURL;
    updateBaseURL(baseURL);
    localStorage.setItem('ipc-base-url', baseURL);
  },
  updateHost: (state, { host, basePath }) => {
    state.host = host;
    state.basePath = basePath;
  },
  validate: state => state.validPassword = true,
  invalidate: state => state.validPassword = false
};

export const actions = {
  init: async ({ commit, dispatch }) => {
    const baseURL = localStorage.getItem('ipc-base-url');
    if (baseURL) commit('setBaseURL', baseURL);

    const password = localStorage.getItem('ipc-password');
    if (!password) return commit('invalidate');

    commit('setPassword', password);
    await dispatch('validate');
  },
  validate: async ({ commit }) => {
    const validPassword = await get('ASF').then(response => true).catch(err => false);
    commit(validPassword ? 'validate' : 'invalidate');
    return validPassword;
  }
};

export const getters = {
  baseURL: state => state.baseURL,
  password: state => state.password,
  validPassword: state => state.validPassword
};
import { get, authenticate } from '../../utils/http';

export const state = {
  password: null,
  basePath: null,
  validPassword: false
};

export const mutations = {
  setPassword: (state, password) => {
    state.password = password;
    authenticate(password);
    localStorage.setItem('ipc-password', password);
  },
  validate: state => state.validPassword = true,
  invalidate: state => state.validPassword = false
};

export const actions = {
  init: async ({ commit, dispatch }) => {
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
  password: state => state.password,
  validPassword: state => state.validPassword
};
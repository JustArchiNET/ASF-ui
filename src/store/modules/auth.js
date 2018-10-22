import { get, authenticate } from '../../utils/http';
import Vue from 'vue';

export const state = {
	password: null,
	validPassword: false
};

export const mutations = {
	setPassword: (state, password) => {
		state.password = password;
		authenticate(password);
		if (password) localStorage.setItem('ipc-password', password);
		else localStorage.removeItem('ipc-password');
	},
	validate: state => state.validPassword = true,
	invalidate: state => state.validPassword = false
};

export const actions = {
	init: async ({ commit, dispatch }) => {
		const password = localStorage.getItem('ipc-password');
		if (password) commit('setPassword', password);
		await dispatch('validate');
	},
	validate: async ({ commit }) => {
		const validPassword = await get('ASF')
			.then(response => true)
			.catch(err => {
				if (err.response.status === 401) return false;
				if (err.response.status === 403) throw new Error(Vue.i18n.t('rate-limited'));
				throw err;
			});
		commit(validPassword ? 'validate' : 'invalidate');
		return validPassword;
	}
};

export const getters = {
	password: state => state.password,
	validPassword: state => state.validPassword
};

import { get, authenticate } from '../../utils/http';

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
		const validPassword = await get('ASF').then(response => true).catch(err => false);
		commit(validPassword ? 'validate' : 'invalidate');
		return validPassword;
	}
};

export const getters = {
	password: state => state.password,
	validPassword: state => state.validPassword
};

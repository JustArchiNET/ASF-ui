import { authenticate } from '../../plugins/http';
import * as storage from '../../utils/storage';
import { STATUS, getStatus } from '../../utils/getStatus';

function createDefer() {
	const defer = {};

	defer.promise = new Promise((resolve, reject) => {
		defer.resolve = resolve;
		defer.reject = reject;
	});

	return defer;
}

const initializer = createDefer();

export const state = {
	password: null,
	validPassword: false,
	status: STATUS.NOT_CONNECTED,
	initialized: initializer.promise
};

export const mutations = {
	setPassword: (state, password) => {
		state.password = password;
		authenticate(password);
		if (password) storage.set('ipc-password', password);
		else storage.remove('ipc-password');
	},
	setStatus: (state, status) => state.status = status
};

export const actions = {
	async init({ commit, dispatch }) {
		const password = storage.get('ipc-password');
		if (password) commit('setPassword', password);
		await dispatch('updateStatus');
		initializer.resolve()
	},
	async setPassword({ commit, dispatch }, password) {
		commit('setPassword', password);
		await dispatch('updateStatus');
	},
	async validate({ state, getters }) {
		await state.initialized;
		return getters.status === STATUS.AUTHENTICATED;
	},
	async updateStatus({ commit }) {
		const status = await getStatus();
		commit('setStatus', status);
	}
};

export const getters = {
	password: state => state.password,
	validPassword: state => state.status === STATUS.AUTHENTICATED,
	status: state => state.status
};

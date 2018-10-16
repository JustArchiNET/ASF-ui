import axios from 'axios';

const http = axios.create({
	baseURL: window.__BASE_PATH__ ? window.__BASE_PATH__ + 'api' : '/api'
});

function extractResult(response) {
	return response.data.Result;
}

function checkForError(response) {
	if (!response.data.Success) throw new Error(response.data.Message);
	return response;
}

export function authenticate(password) {
	http.defaults.headers.common.Authentication = password;
}

export function get(endpoint, params = {}, options = {}) {
	return http.get(endpoint, { ...options, params }).then(checkForError).then(extractResult);
}

export function post(endpoint, data, options = {}) {
	return http.post(endpoint, data, options).then(checkForError).then(extractResult);
}

export function del(endpoint, options = {}) {
	return http.delete(endpoint, options).then(checkForError).then(extractResult);
}

export function command(...args) {
	return http.post(`command/${args.join(' ')}`).then(checkForError).then(extractResult);
}

export function botAction(bots, action, params) {
	const botsString = Array.isArray(bots) ? bots.join(',') : bots;
	return http.post(`bot/${botsString}/${action}`, params).then(response => {
		if (!response.data.Success) throw response.data.Message;
		return response.data.Message;
	});
}

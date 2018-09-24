import axios from 'axios';

const http = axios.create({
	baseURL: '/api'
});

window.http = http;

function extractResult(response) {
	return response.data.Result;
}

export function authenticate(password) {
	http.defaults.headers.common.Authentication = password;
}

export function updateBaseURL(baseURL) {
	http.defaults.baseURL = baseURL + '/api';
}

export function get(endpoint, params = {}) {
	return http.get(endpoint, { params }).then(extractResult);
}

export function post(endpoint, data) {
	return http.post(endpoint, data).then(extractResult);
}

export function command(...args) {
	return http.post(`command/${args.join(' ')}`).then(extractResult);
}

export function botAction(bots, action, params) {
	const botsString = Array.isArray(bots) ? bots.join(',') : bots;
	return http.post(`bot/${botsString}/${action}`, params).then(response => {
		if (!response.data.Success) throw response.data.Message;
		return response.data.Message;
	});
}

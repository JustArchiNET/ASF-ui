import axios from 'axios';

const http = axios.create({
  baseURL: '/Api'
});

function extractResult(response) {
  return response.data.Result;
}

export function authenticate(password) {
  http.defaults.headers.common.Authentication = password;
}

export function updateBaseURL(baseURL) {
  http.defaults.baseURL = baseURL + '/Api';
}

export function get(endpoint) {
  return http.get(endpoint).then(extractResult);
}

export function post(endpoint, data) {
  return http.post(endpoint, data).then(extractResult);
}

export function command(...args) {
  return http.post(`Command/${args.join(' ')}`).then(extractResult);
}

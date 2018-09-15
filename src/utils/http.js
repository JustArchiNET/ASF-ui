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

export function get(endpoint) {
  return http.get(endpoint).then(extractResult);
}

export function command(...args) {
  return http.post(`Command/${args.join(' ')}`).then(extractResult);
}

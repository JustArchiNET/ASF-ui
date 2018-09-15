import axios from 'axios';

const http = axios.create({
  baseURL: '/Api'
});

export function authenticate(password) {
  http.defaults.headers.common.Authentication = password;
}

export function get(endpoint) {
  return http.get(endpoint).then(response => response.data.Result);
}

import axios from 'axios';

export class NotificationError extends Error {
  constructor(message, result) {
    super();

    this.message = message;
    this.result = result;

    Object.setPrototypeOf(this, NotificationError.prototype);
  }
}

const http = axios.create({
  baseURL: (window.__BASE_PATH__) ? `${window.__BASE_PATH__}api` : '/api',
});

function extractResult(response) {
  return response.data.Result;
}

function checkForError(response) {
  if (response.status !== 200) {
    if (response.status === 400 && response.data && response.data.Message) throw new NotificationError(response.data.Message);
    throw new NotificationError(`HTTP Error ${response.status}`, response.data);
  }

  if (response.data && !response.data.Success) throw new NotificationError(response.data.Message, response.data.result);
  return response;
}

function processResponse(response) {
  return Promise.resolve(response)
    .then(checkForError)
    .then(extractResult);
}

function catchError(err) {
  if (err.response) checkForError(err.response);
  if (err instanceof NotificationError) throw err;
  throw new NotificationError(err.message);
}

export function authenticate(password) {
  if (password) http.defaults.headers.common.Authentication = password;
}

export function get(endpoint, params = {}, options = {}) {
  return http.get(endpoint, { ...options, params }).then(processResponse).catch(catchError);
}

export function post(endpoint, data, options = {}) {
  return http.post(endpoint, data, options).then(processResponse).catch(catchError);
}

export function del(endpoint, options = {}) {
  return http.delete(endpoint, options).then(processResponse).catch(catchError);
}

export function command(...args) {
  return http.post('command', { Command: args.join(' ') }).then(processResponse).catch(catchError);
}

export function botAction(bots, action, params) {
  const botsString = (Array.isArray(bots)) ? bots.join(',') : bots;
  return http.post(`bot/${botsString}/${action}`, params).then(response => {
    if (!response.data.Success) throw response.data.Message;
    return response.data.Message;
  });
}

export default {
  install(Vue) {
    Vue.prototype.$http = {
      authenticate,
      get,
      post,
      del,
      command,
      botAction,
    };
  },
};

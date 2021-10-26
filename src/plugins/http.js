import axios from 'axios';

import * as storage from '../utils/storage';

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

http.interceptors.request.use(config => {
  // Check what language the user is using and prepare "Accept-Language" header accordingly
  const acceptedLanguages = [];

  const locale = storage.get('locale');
  if (locale) acceptedLanguages.push(locale);

  // eslint-disable-next-line no-restricted-syntax
  for (const language of window.navigator.languages || []) {
    // Attempt to reconstruct default Accept-Language header using navigator.languages
    // This may be useful if asf-ui introduces new language which is not supported by ASF
    if (acceptedLanguages.includes(language)) continue;
    acceptedLanguages.push(language);
  }

  const acceptLanguageHeader = acceptedLanguages.reduce((acceptLanguageHeader, language, currentIndex) => {
    if (currentIndex === 0) {
      // We are only starting constructing the header string, the first language does not have any q-factor (weight).
      return language;
    }

    // Each following language should have descending q-factor.
    // We start with 0.9 and descend until it reaches 0.1.
    // Further languages will be used as equal.
    return `${acceptLanguageHeader},${language};q=0.${Math.max(1, 10 - currentIndex)}`;
  }, '');

  // It is possible config.headers is always declared, but I'd rather not break production if this proven to be false.
  config.headers = config.headers || {};
  config.headers['Accept-Language'] = acceptLanguageHeader;

  return config;
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

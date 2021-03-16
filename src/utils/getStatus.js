import * as http from '../plugins/http';

export const STATUS = {
  NOT_CONNECTED: 'NOT_CONNECTED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  AUTHENTICATED: 'AUTHENTICATED',
  RATE_LIMITED: 'RATE_LIMITED',
  GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',
};

export async function getStatus() {
  return http.get('asf')
    .then(response => STATUS.AUTHENTICATED)
    .catch(err => {
      if (err.message === 'HTTP Error 401') return STATUS.UNAUTHORIZED;
      if (err.message === 'HTTP Error 403') return STATUS.RATE_LIMITED;
      if (err.message === 'HTTP Error 504' || err.message === 'Network Error') return STATUS.GATEWAY_TIMEOUT;
      return STATUS.NOT_CONNECTED;
    });
}

import * as http from '../plugins/http';

export const STATUS = {
  NOT_CONNECTED: 'NOT_CONNECTED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  AUTHENTICATED: 'AUTHENTICATED',
  RATE_LIMITED: 'RATE_LIMITED',
  GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',
  NETWORK_ERROR: 'NETWORK_ERROR',
};

export async function getStatus() {
  return http.get('asf')
    .then(response => STATUS.AUTHENTICATED)
    .catch(err => {
      if (err.message === 'HTTP Error 401') return STATUS.UNAUTHORIZED;
      if (err.message === 'HTTP Error 403') return STATUS.RATE_LIMITED;
      if (err.message === 'HTTP Error 504') return STATUS.GATEWAY_TIMEOUT;
      if (err.message === 'Network Error') return STATUS.NETWORK_ERROR;
      return STATUS.NOT_CONNECTED;
    });
}

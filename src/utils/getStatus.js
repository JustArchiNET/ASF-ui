import * as http from '../plugins/http';

export const STATUS = {
  NOT_CONNECTED: 'NOT_CONNECTED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  AUTHENTICATED: 'AUTHENTICATED',
  RATE_LIMITED: 'RATE_LIMITED',
  GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  NO_IPC_PASSWORD: 'NO_IPC_PASSWORD',
};

export async function getStatus() {
  return http.get('asf')
    .then(response => STATUS.AUTHENTICATED)
    .catch(err => {
      if (err.message === 'HTTP Error 401') return STATUS.UNAUTHORIZED;
      if (err.message === 'HTTP Error 504') return STATUS.GATEWAY_TIMEOUT;
      if (err.message === 'Network Error') return STATUS.NETWORK_ERROR;

      if (err.message === 'HTTP Error 403') {
        if (err.result && err.result.Result.Permanent) {
          // assume lack of IPCPassword since Result.Permanent is true
          return STATUS.NO_IPC_PASSWORD;
        }

        return STATUS.RATE_LIMITED;
      }

      return STATUS.NOT_CONNECTED;
    });
}

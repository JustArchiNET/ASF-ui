import * as http from '../plugins/http';
import * as storage from './storage';

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
  const authenticationRequired = storage.get('cache:authentication-required');
  if (authenticationRequired) return STATUS.UNAUTHORIZED;

  return http.get('asf')
    .then(response => {
      storage.remove('cache:authentication-required');
      return STATUS.AUTHENTICATED;
    })
    .catch(err => {
      if (err.message === 'HTTP Error 401') {
        storage.set('cache:authentication-required', true);
        return STATUS.UNAUTHORIZED;
      }

      if (err.message === 'HTTP Error 403') {
        const result = err.result.Result;
        if (result && result.Permanent) {
          // assume lack of IPCPassword since Result.Permanent is true
          return STATUS.NO_IPC_PASSWORD;
        }

        return STATUS.RATE_LIMITED;
      }

      if (err.message === 'HTTP Error 504') return STATUS.GATEWAY_TIMEOUT;
      if (err.message === 'Network Error') return STATUS.NETWORK_ERROR;
      return STATUS.NOT_CONNECTED;
    });
}

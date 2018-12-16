import * as http from '../plugins/http';

export const STATUS = {
	NOT_CONNECTED: 'NOT_CONNECTED',
	UNAUTHORIZED: 'UNAUTHORIZED',
	AUTHENTICATED: 'AUTHENTICATED',
	RATE_LIMITED: 'RATE_LIMITED'
};

export async function getStatus() {
	return http.get('ASF')
		.then(response => STATUS.AUTHENTICATED)
		.catch(err => {
			if (err.message === 'HTTP Error 401') return STATUS.UNAUTHORIZED;
			if (err.message === 'HTTP Error 403') return STATUS.RATE_LIMITED;
			return STATUS.NOT_CONNECTED;
		});
}

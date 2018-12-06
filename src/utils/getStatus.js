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
			if (!err.response) return STATUS.NOT_CONNECTED;
			if (err.response.status === 401) return STATUS.UNAUTHORIZED;
			if (err.response.status === 403) return STATUS.RATE_LIMITED;
			return STATUS.NOT_CONNECTED;
		});
}

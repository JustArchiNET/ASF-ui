function generateKey(key) {
	return `asf-ui:${key}`;
}

export function set(key, value) {
	return localStorage.setItem(generateKey(key), value);
}

export function get(key, defaultValue) {
	return localStorage.getItem(generateKey(key)) || defaultValue;
}

export function remove(key) {
	return localStorage.removeItem(generateKey(key));
}

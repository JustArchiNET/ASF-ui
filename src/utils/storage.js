function generateKey(key) {
	return `asf-ui:${key}`;
}

export function set(key, value) {
	return localStorage.setItem(generateKey(key), JSON.stringify(value));
}

export function get(key, defaultValue) {
	const storedValue = localStorage.getItem(generateKey(key));
	if (!storedValue) return defaultValue;
	try { return JSON.parse(storedValue); }
	catch (err) { return storedValue; }
}

export function remove(key) {
	return localStorage.removeItem(generateKey(key));
}

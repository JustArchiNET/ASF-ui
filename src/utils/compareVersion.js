export default function compareVersion(a, b) {
	const aValues = a.split('.');
	const bValues = b.split('.');

	for (let i = 0; i < aValues.length; ++i) {
		if (aValues[i] === bValues[i]) continue;
		return aValues[i] > bValues[i] ? 1 : -1;
	}

	return 0;
}

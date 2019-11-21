export default function compareVersion(a, b) {
	const aValues = a.split('.').map(v => parseInt(v, 10));
	const bValues = b.split('.').map(v => parseInt(v, 10));

	const versionLength = Math.max(aValues.length, bValues.length);

	for (let i = 0; i < versionLength; ++i) {
		const aValue = aValues[i] || 0;
		const bValue = bValues[i] || 0;

		if (aValue === bValue) continue;
		return aValue > bValue ? 1 : -1;
	}

	return 0;
}

export default function compareVersion(a, b) {
	let result = 0;

	const aValues = a.split('.');
	const bValues = b.split('.');

	aValues.forEach((value, index) => {
		if (result !== 0) return;

		if (value === bValues[index]) return;

		if (value > bValues[index]) result = 1;
		else result = -1;
	});

	return result;
}

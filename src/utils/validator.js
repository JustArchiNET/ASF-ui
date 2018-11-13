const steamidRegex = /^[1-9][0-9]{16,17}$/;

function isNumber(value) {
	return ('' + value).split('').every(n => !isNaN(n));
}

export function steamid() {
	return function(value) {
		const errors = [];

		if (!isNumber(value)) errors.push('not a number');
		if (!steamidRegex.test('' + value) && '' + value !== '0') errors.push('not valid steamid');

		return errors;
	};
}

function limitedNumber(min = 0, max) {
	return function(value) {
		const errors = [];

		if (!isNumber(value)) errors.push('not a number');
		if (value < min) errors.push(`lesser than allowed (${min})`);
		if (value > max) errors.push(`greater than allowed (${max})`);

		return errors;
	};
}

export default {
	byte: limitedNumber(0, 255),
	uint16: limitedNumber(0, 65535),
	uint32: limitedNumber(0, 4294967295),
	uint64: steamid()
};

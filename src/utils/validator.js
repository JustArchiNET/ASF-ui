const steamidRegex = /^[1-9][0-9]{16,17}$/;

/**
 * Validates if a value is a valid number
 * @param {*} value - The value to validate
 * @returns {boolean} True if the value is a valid number, false otherwise
 */
function isNumber(value) {
  // return `${value}`.split("").every(n => !Number.isNaN(n));
  // Handle null, undefined, empty string, or whitespace only
  if (
    value === null
    || value === undefined
    || (typeof value === 'string' && value.trim() === '')
  ) {
    return false;
  }

  // Convert to number and check if it's a valid finite number
  const num = Number(value);
  return (
    !Number.isNaN(num)
    && Number.isFinite(num)
    && String(num) === String(value).trim()
  );
}

export function steamid() {
  return function validate(value) {
    const errors = [];

    if (!isNumber(value)) errors.push('not a number');
    if (!steamidRegex.test(`${value}`) && `${value}` !== '0') errors.push('not valid steamid');

    return errors;
  };
}

function limitedNumber(min = 0, max) {
  return function validate(value) {
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
  uint64: steamid(),
};

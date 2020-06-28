/**
 * @param {string} str
 * @param {object} [options]
 */
function isValidPositiveInt(str, options = {}) {
  if (!/^\d+$/.test(str)) return false;

  const num = Number.parseFloat(str);
  if (!Number.isInteger(num)) return false;

  if (num < 1) return false;
  if (typeof options.min === 'number' && num < options.min) return false;
  if (typeof options.max === 'number' && num > options.max) return false;

  return true;
}

export default isValidPositiveInt;

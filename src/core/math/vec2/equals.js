/**
 * Compares two vec2 for equality.
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Boolean} if a and b are equal or not.
 */
const equals = (a, b) => (a[0] === b[0]) && (a[1] === b[1])

module.exports = equals

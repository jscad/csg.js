const create = require('./create')

/**
 * Multiplies two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
const multiply = (a, b) => {
  const out = create()
  out[0] = a[0] * b[0]
  out[1] = a[1] * b[1]
  return out
}

module.exports = multiply

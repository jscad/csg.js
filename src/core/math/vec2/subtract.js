const create = require('./create')

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
const subtract = (a, b) => {
  const out = create()
  out[0] = a[0] - b[0]
  out[1] = a[1] - b[1]
  return out
}

module.exports = subtract

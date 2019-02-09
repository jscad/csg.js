const create = require('./create')

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
const subtract = (a, b) => {
  const out = create()
  out[0] = a[0] - b[0]
  out[1] = a[1] - b[1]
  out[2] = a[2] - b[2]
  return out
}

module.exports = subtract

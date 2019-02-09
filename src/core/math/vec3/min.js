const create = require('./create')

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector (optional)
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
const min = (a, b) => {
  const out = create()
  out[0] = Math.min(a[0], b[0])
  out[1] = Math.min(a[1], b[1])
  out[2] = Math.min(a[2], b[2])
  return out
}

module.exports = min

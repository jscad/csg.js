const create = require('./create')

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
const min = (a, b) => {
  const out = create()
  out[0] = Math.min(a[0], b[0])
  out[1] = Math.min(a[1], b[1])
  return out
}

module.exports = min

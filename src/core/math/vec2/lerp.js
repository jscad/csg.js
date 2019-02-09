const create = require('./create')

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {Number} t interpolation amount between the two inputs
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
const lerp = (t, a, b) => {
  let out = create()
  const ax = a[0]
  const ay = a[1]
  out[0] = ax + t * (b[0] - ax)
  out[1] = ay + t * (b[1] - ay)
  return out
}

module.exports = lerp

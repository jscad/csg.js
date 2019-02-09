const create = require('./create')

/**
 * Calculates the absolute value of the give vector
 *
 * @param {vec3} vec - given value
 * @returns {vec3} absolute value of the vector
 */
const abs = (vec) => {
  out = create()
  out[0] = Math.abs(vec[0])
  out[1] = Math.abs(vec[1])
  out[2] = Math.abs(vec[2])
  return out
}

module.exports = abs

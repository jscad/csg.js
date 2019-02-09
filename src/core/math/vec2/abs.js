const create = require('./create')

/**
 * Calculates the absolute value of the give vector
 *
 * @param {vec2} vec - given value
 * @returns {vec2} absolute value of the vector
 */
const abs = vec => {
  let out = create()
  out[0] = Math.abs(vec[0])
  out[1] = Math.abs(vec[1])
  return out
}

module.exports = abs

const create = require('./create')

/**
 * Create a clone of the given vector
 *
 * @param {vec3} vec - vector to clone
 * @returns {vec3} clone of the vector
 */
const clone = vec => {
  const out = create()
  out[0] = vec[0]
  out[1] = vec[1]
  out[2] = vec[2]
  return out
}

module.exports = clone

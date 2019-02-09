const create = require('./create')

/**
 * Create a clone of the given vector
 *
 * @param {vec4} vector - vector to clone
 * @returns {vec4} clone of vector
 */
const clone = (vec) => {
  let out = create()
  out[0] = vec[0]
  out[1] = vec[1]
  out[2] = vec[2]
  out[3] = vec[3]
  return out
}

module.exports = clone

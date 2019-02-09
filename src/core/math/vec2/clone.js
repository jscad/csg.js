const create = require('./create')

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} vec - given vector to clone
 * @returns {vec2} clone of the vector
 */
const clone = (vec) => {
  const out = create()
  out[0] = vec[0]
  out[1] = vec[1]
  return out
}

module.exports = clone

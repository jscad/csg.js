const create = require('./create')
const length = require('./length')

/**
 * Calculates the unit vector of the given vector
 *
 * @param {vec3} vector - the base vector for calculations
 * @returns {vec3} unit vector of the given vector
 */
const unit = (vector) => {
  const out = create()
  const magnitude = length(vector) // calculate the magnitude
  out[0] = vector[0] / magnitude
  out[1] = vector[1] / magnitude
  out[2] = vector[2] / magnitude
  return out
}

module.exports = unit

const create = require('./create')

/**
 * Scales a vec3 by a scalar number
 *
 * @param {Number} amount amount to scale the vector by
 * @param {vec3} vector the vector to scale
 * @returns {vec3} out
 */
const scale = (amount, vector) => {
  const out = create()
  out[0] = vector[0] * amount
  out[1] = vector[1] * amount
  out[2] = vector[2] * amount
  return out
}

module.exports = scale

const create = require('./create')

/**
 * Scales a vec2 by a scalar number
 *
 * @param {Number} amount amount to scale the vector by
 * @param {vec2} vector the vector to scale
 * @returns {vec2} out
 */
const scale = (amount, vector) => {
  let out = create()
  out[0] = vector[0] * amount
  out[1] = vector[1] * amount
  return out
}

module.exports = scale

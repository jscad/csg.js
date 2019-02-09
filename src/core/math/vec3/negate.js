const create = require('./create')

/**
 * Negates the components of a vec3
 *
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
const negate = (a) => {
  const out = create()
  out[0] = -a[0]
  out[1] = -a[1]
  out[2] = -a[2]
  return out
}

module.exports = negate

const create = require('./create')

/**
 * Negates the components of a vec2
 *
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
const negate = (a) => {
  const out = create()
  out[0] = -a[0]
  out[1] = -a[1]
  return out
}

module.exports = negate

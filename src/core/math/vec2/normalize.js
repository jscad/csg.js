const create = require('./create')

/**
 * Normalize the given vector.
 *
 * @param {vec2} a vector to normalize
 * @returns {vec2} normalized (unit) vector
 */
const normalize = (a) => {
  let out = create()
  const x = a[0]
  const y = a[1]
  let len = x * x + y * y
  if (len > 0) {
    len = 1 / Math.sqrt(len)
    out[0] = a[0] * len
    out[1] = a[1] * len
  }
  return out
}

// old this.dividedBy(this.length())

module.exports = normalize

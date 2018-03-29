module.exports = lerp
const create = require('./create')

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
function lerp (...params) {
  let out
  let a
  let b
  let t
  if (params.length === 2) {
    out = create()
    a = params[0]
    b = params[1]
    t = params[2]
  } else {
    out = params[0]
    a = params[1]
    b = params[2]
    t = params[3]
  }
  let ax = a[0]
  let ay = a[1]
  out[0] = ax + t * (b[0] - ax)
  out[1] = ay + t * (b[1] - ay)
  return out
}

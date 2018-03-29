module.exports = rotate
const create = require('./create')

/**
 * Rotates a vec2 by an angle
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to rotate
 * @param {Number} angle the angle of rotation (in radians)
 * @returns {vec2} out
 */
function rotate (...params) {
  let out
  let a
  let angle
  if (params.length === 2) {
    out = create()
    a = params[0]
    angle = params[1]
  } else {
    out = params[0]
    a = params[1]
    angle = params[2]
  }

  const c = Math.cos(angle)
  const s = Math.sin(angle)
  const x = a[0]
  const y = a[1]

  out[0] = x * c - y * s
  out[1] = x * s + y * c

  return out
}

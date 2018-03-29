module.exports = rotateX
const create = require('./create')

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateX (...params) {
  let out
  let a
  let b
  let c
  if (params.length === 3) {
    out = create()
    a = params[0]
    b = params[1]
    c = params[2]
  } else {
    out = params[0]
    a = params[1]
    b = params[2]
    c = params[3]
  }
  let p = []
  let r = []
    // Translate point to the origin
  p[0] = a[0] - b[0]
  p[1] = a[1] - b[1]
  p[2] = a[2] - b[2]

    // perform rotation
  r[0] = p[0]
  r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c)
  r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c)

    // translate to correct position
  out[0] = r[0] + b[0]
  out[1] = r[1] + b[1]
  out[2] = r[2] + b[2]

  return out
}

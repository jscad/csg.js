const vec3 = require('../vec3/index')

/**
 * Computes the cross product (3D) of two vectors
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} cross product
 */
const cross = (a, b) => {
  let out = vec3.create()
  out[0] = 0
  out[1] = 0
  out[2] = a[0] * b[1] - a[1] * b[0]
  // alternative return vec3.cross(out, vec3.fromVec2(a), vec3.fromVec2(b))
  return out
}

module.exports = cross

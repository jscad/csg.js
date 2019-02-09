const create = require('./create')

/**
 * Rotate vector 3D vector around the z-axis
 *
 * @param {Number} angle The angle of rotation in radians
 * @param {vec3} origin The origin of the rotation
 * @param {vec3} vector The vec3 point to rotate
 * @returns {vec3} out
 */
const rotateZ = (angle, origin, vector) => {
  let out = create()
  const p = []
  const r = []
  // Translate point to the origin
  p[0] = vector[0] - origin[0]
  p[1] = vector[1] - origin[1]

  // perform rotation
  r[0] = (p[0] * Math.cos(angle)) - (p[1] * Math.sin(angle))
  r[1] = (p[0] * Math.sin(angle)) + (p[1] * Math.cos(angle))

  // translate to correct position
  out[0] = r[0] + origin[0]
  out[1] = r[1] + origin[1]
  out[2] = vector[2]

  return out
}

module.exports = rotateZ

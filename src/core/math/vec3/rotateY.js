const create = require('./create')

/**
 * Rotate vector 3D vector around the y-axis
 * @param {vec3} out The receiving vec3 (optional)
 * @param {Number} angle The angle of rotation
 * @param {vec3} origin The origin of the rotation
 * @param {vec3} vector The vec3 point to rotate
 * @returns {vec3} out
 */
const rotateY = (angle, origin, vector) => {
  const out = create()
  const p = []
  const r = []

  // translate point to the origin
  p[0] = vector[0] - origin[0]
  p[1] = vector[1] - origin[1]
  p[2] = vector[2] - origin[2]

  // perform rotation
  r[0] = p[2] * Math.sin(angle) + p[0] * Math.cos(angle)
  r[1] = p[1]
  r[2] = p[2] * Math.cos(angle) - p[0] * Math.sin(angle)

  // translate to correct position
  out[0] = r[0] + origin[0]
  out[1] = r[1] + origin[1]
  out[2] = r[2] + origin[2]

  return out
}

module.exports = rotateY

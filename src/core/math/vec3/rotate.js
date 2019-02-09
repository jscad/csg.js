const create = require('./create')
const rotateX = require('./rotateX')
const rotateY = require('./rotateY')
const rotateZ = require('./rotateZ')
/**
 * Rotate vector 3D vector around the all 3 axes in the order x-axis , yaxis, z axis
 * @param {vec3} out The receiving vec3 (optional)
 * @param {vec3} vector The vec3 point to rotate
 * @returns {vec3} out
 */
function rotate (angle, vector) {
  const out = create()

  // fIXME: not correct
  console.log('rotate', angle, vector)
  const origin = [0, 0, 0]
  out = rotateZ(angle[2], origin, rotateY(angle[1], origin, rotateX(angle[0], origin, vector)))
  return out
}

module.exports = rotate

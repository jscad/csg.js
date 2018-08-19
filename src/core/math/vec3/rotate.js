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
function rotate (...params) {
  let out
  let angle
  let vector
  if (params.length === 3) {
    out = create()
    angle = params[0]
    vector = params[1]
  } else {
    out = params[0]
    angle = params[1]
    vector = params[2]
  }

  // fIXME: not correct
  out = rotateZ(angle[2], rotateY(angle[1], rotateX(angle[0], vector)))
  return out
}

module.exports = rotate
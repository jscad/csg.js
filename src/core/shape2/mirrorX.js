const vec4 = require('../math//vec4')
const mirror = require('./mirror')

const mirrorX = (shape2) => {
  let plane = vec4.fromValues(1, 0, 0, 0) // new Plane(Vector3.Create(1, 0, 0), 0)
  return mirror(plane, shape2)
}

module.exports = mirrorX

const vec4 = require('../../math/vec4')
const mirror = require('./mirror')

const mirrorX = shape => {
  const plane = vec4.fromValues(1, 0, 0, 0)
  return mirror(plane, shape)
}

module.exports = mirrorX

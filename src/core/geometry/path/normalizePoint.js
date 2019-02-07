const vec3 = require('../../math/vec3')

const normalizePoint = point => {
  switch (point.length) {
    case 2: return vec3.fromValues(point[0], point[1], 0)
    case 3: return vec3.fromValues(point[0], point[1], point[2])
    default: throw new Error('Only 2 and 3 dimensional points are supported')
  }
}

module.exports = normalizePoint

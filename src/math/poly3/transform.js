const map = require('./map')
const mat4 = require('../mat4')
const plane = require('../plane')
const vec3 = require('../vec3')

// Affine transformation of polygon. Returns a new poly3.
const transform = (matrix, poly3) => {
  const transformed = map(poly3, vertex => vec3.transform(matrix, vertex))
  if (mat4.isMirroring(matrix)) {
    // Reverse the order to preserve the orientation.
    transformed.reverse()
    // And recompute the normal.
    transformed.plane = plane.fromPoints(...transformed)
  }
  return transformed
}

module.exports = transform

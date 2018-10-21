const create = require('./create')

const _plane = require('../../math/plane/')
const _vec3 = require('../../math/vec3')

const _mat4 = require('../../math/mat4')

// Affine transformation of polygon. Returns a new Polygon3
const transform = (matrix, poly3) => {
  const vertices = poly3.vertices.map((vertex) => { return _vec3.transformMat4(matrix, vertex)} )
  if (_mat4.isMirroring(matrix)) {
    // reverse the order to preserve the orientation
    vertices.reverse()
  }
  const out = create()
  out.vertices = vertices
  out.plane = _plane.transformMat4(matrix, poly3.plane)
  return out
}

module.exports = transform

const { mat4, vec3 } = require('../../../math')

const create = require('./create')
const toEdges = require('./toEdges')

/**
 * Transform the given slice using the given matrix.
 */
const transform = (matrix, slice) => {
  const oldedges = toEdges(slice)
  const edges = oldedges.map((edge) => [vec3.transform(matrix, edge[0]), vec3.transform(matrix, edge[1])])
  if (mat4.isMirroring(matrix)) {
    // reverse the order to preserve the orientation
    // TODO vertices.reverse()
  }
  return create(edges)
}

module.exports = transform

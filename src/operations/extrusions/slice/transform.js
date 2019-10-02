const { vec3 } = require('../../../math')

const create = require('./create')

/**
 * Transform the given slice using the given matrix.
 */
const transform = (matrix, slice) => {
  const oldedges = slice.edges
  const edges = oldedges.map((edge) => [vec3.transform(matrix, edge[0]), vec3.transform(matrix, edge[1])])
  return create(edges)
}

module.exports = transform

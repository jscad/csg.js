const clone = require('./clone')
const mat4 = require('../../math/mat4')

/**
 * Return a new solid with an updated transformation matrix.
 * The application of the geometry occurs in canonicalize.
 * @param {mat4} matrix - the matrix to be applied.
 * @returns {solid} the new transformed solid.
 * @example
 * let m = mat4.create()
 * m = mat4.multiply(mat4.rotateX(40, m))
 * m = mat4.multiply(mat4.translate([-.5, 0, 0], m))
 * const transformedSolid = transform(m, solid)
 */
const transform = (matrix, solid) => {
  const cloned = clone(solid)
  cloned.transforms = mat4.multiply(solid.transforms, matrix)
  cloned.isCanonicalized = false
  cloned.isRetessellated = false
  return cloned
}

module.exports = transform

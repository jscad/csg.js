const clone = require('./clone')
const mat4 = require('../../math/mat4')

/** Performs a lazy transform.
 * @param {Mat4} matrix
 * @param {Geom2} geometry
 * @returns {Geom2} a new shape, with updated geometry
 */

/** Transforms the surface using the matrix provided.
  * This implementation uses a lazy transformation which is realized
  *   upon canonicalization.
  * @param {mat4} matrix - the transformation matrix.
  * @param {surface} surface - the surface to transform.
  * @returns {surface} the transformed surface.
  */
const transform = (matrix, surface) => {
  let cloned = clone(surface)
  cloned.transforms = mat4.multiply(surface.transforms, matrix);
  cloned.polygons = undefined
  cloned.isCanonicalized = false
  return cloned;
}

module.exports = transform

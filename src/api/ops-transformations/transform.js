const Matrix4 = require('../../core/math/Matrix4')
const toArray = require('../../core/utils/toArray')
const {flatten} = require('../../core/utils')

/** apply the given matrix transform to the given objects
 * @param {Array} matrix - the 4x4 matrix to apply, as a simple 1d array of 16 elements
 * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to transform
 * @returns {CSG} new CSG object , transformed
 *
 * @example
 * const angle = 45
 * let transformedShape = transform([
 * cos(angle), -sin(angle), 0, 10,
 * sin(angle),  cos(angle), 0, 20,
 * 0         ,           0, 1, 30,
 * 0,           0, 0,  1
 * ], sphere())
 */
function transform (matrix, ...objects) { // v, obj or array
  const shapes = flatten(toArray(objects))
  const _objects = (shapes.length >= 1 && shapes[0].length) ? shapes[0] : shapes

  let transformationMatrix
  if (!Array.isArray(matrix)) {
    throw new Error('Matrix needs to be an array')
  }
  matrix.forEach(element => {
    if (!Number.isFinite(element)) {
      throw new Error('you can only use a flat array of valid, finite numbers (float and integers)')
    }
  })
  transformationMatrix = new Matrix4(matrix)
  const results = _objects.map(function (object) {
    return object.transform(transformationMatrix)
  })
  return results.length === 1 ? results[0] : results
}

module.exports = transform

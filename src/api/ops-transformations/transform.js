const Matrix4 = require('../../core/math/Matrix4')

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
  const _objects = (objects.length >= 1 && objects[0].length) ? objects[0] : objects
  let object = _objects[0]

  if (_objects.length > 1) {
    for (let i = 1; i < _objects.length; i++) { // FIXME/ why is union really needed ??
      object = object.union(_objects[i])
    }
  }

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
  return object.transform(transformationMatrix)
}

module.exports = transform

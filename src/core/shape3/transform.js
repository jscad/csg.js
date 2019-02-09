const mat4 = require('../math/mat4')
const clone = require('./clone')

/** returns a clone of the input object, with updated transforms
 * this only updates the transformation matrix, not the geometry/points !
 * @param  {Mat4} matrix the transformation matrix to apply
 * @param  {Shape3} shape the shape to transform
 * @returns {Shape3} a new shape, with updated transformation matrix
 */
const transform = (matrix, shape) => {
  const newShape = clone(shape)
  mat4.multiply(newShape.transforms, shape.transforms, matrix)
  return newShape
}
module.exports = transform

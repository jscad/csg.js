const mat4 = require('../math//mat4')
const geom2 = require('../geometry/geom2')

// FIXME: how about properties ?
/** check if two Shape3s are equal
 * @param {Shape3} shape the first shape
 * @param {Shape3} otherShape the second shape
 * @returns {Boolean} are they equal
 */
const equals = (shape, otherShape) =>
  mat4.equals(shape.transforms, otherShape.transforms) &&
  geom2.equals(shape.geometry, otherShape.geometry)

module.exports = equals

const mat4 = require('../../math/mat4')
const geom2 = require('./geom2')

const equals = (shape, otherShape) =>
  mat4.equals(shape.transforms, otherShape.transforms) &&
  geom2.equals(shape.geometry, otherShape.geometry)

module.exports = equals

const mat4 = require('../../math/mat4')
const geom3 = require('./geom3')

// FIXME: how about properties ?
const equals = (shape, otherShape) =>
  mat4.equals(shape.transforms, otherShape.transforms) &&
  geom3.equals(shape.geometry, otherShape.geometry)

module.exports = equals

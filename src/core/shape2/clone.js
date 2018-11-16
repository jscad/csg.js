const create = require('./create')
const mat4 = require('../../math/mat4')
// const fromSides = require('./fromSides')
const geom2 = require('./geom2')

const clone = (sourceShape) => {
  const newShape = create()
  newShape.geometry = geom2.clone(sourceShape.geometry)
  // not sure newShape.curves = fromCurves(sourceShape.curves)
  newShape.transforms = mat4.clone(sourceShape.transforms)
  newShape.isNegative = sourceShape.isNegative
  return newShape
}

module.exports = clone

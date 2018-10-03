const create = require('./create')
const mat4 = require('../../math/mat4')
const fromSides = require('./fromSides')

const clone = (sourceShape) => {
  const newShape = create()
  newShape.sides = fromSides(sourceShape.sides)
  // newShape.curves = fromCurves(sourceShape.curves)
  newShape.isCanonicalized = sourceShape.isCanonicalized
  newShape.transforms = mat4.clone(sourceShape.transforms)
  return newShape
}

module.exports = clone

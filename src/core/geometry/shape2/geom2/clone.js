const create = require('./create')
const fromSides = require('./fromSides')

const clone = (sourceGeometry) => {
  const newGeometry = create()
  newGeometry.isCanonicalized = sourceGeometry.isCanonicalized
  newGeometry.sides = fromSides(sourceGeometry.sides)
  return newGeometry
}

module.exports = clone

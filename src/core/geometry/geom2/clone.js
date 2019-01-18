const create = require('./create')
const fromSides = require('./fromSides')

/** clones an existing Geom2
 * @returns Geom2
 */
const clone = (sourceGeometry) => {
  const newGeometry = create()
  newGeometry.isCanonicalized = sourceGeometry.isCanonicalized
  newGeometry.sides = fromSides(sourceGeometry.sides)
  return newGeometry
}

module.exports = clone

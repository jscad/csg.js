const geom3 = require('./geom3')
const clone = require('./clone')
const create = require('./create')

/**
   * Return a new Shape3 solid representing space in this solid but
   * not in the given solids. Neither this solid nor the given solids are modified.
   * @param {Shape3[]} Shape3 - list of Shape3 objects
   * @returns {Shape3} new Shape3 object
   * @example
   * let C = A.subtract(B)
   * @example
   * +-------+            +-------+
   * |       |            |       |
   * |   A   |            |       |
   * |    +--+----+   =   |    +--+
   * +----+--+    |       +----+
   *      |   B   |
   *      |       |
   *      +-------+
   */
const difference = (...shapes) => {
  if (shapes.length < 2) {
    throw new Error(`please provide at least two operands for a boolean difference.(${shapes.length} given)`)
  }
  const shapesWithUpdatedGeoms = shapes.map(shape => {
    const transformedGeom = geom3.transform(shape.transforms, shape.geometry)
    const newShape = clone(shape)
    newShape.geometry = transformedGeom
    return newShape
  })

  const newGeometry = geom3.difference(shapesWithUpdatedGeoms[0], ...shapesWithUpdatedGeoms)
  const newShape = create() // this means that the new shapes transforms are the default ones !
  newShape.geometry = newGeometry
  return newShape
}

module.exports = difference

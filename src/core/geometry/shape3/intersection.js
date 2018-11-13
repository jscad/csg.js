const geom3 = require('./geom3')
const clone = require('./clone')
const create = require('./create')

/**
   * Return a new Shape3 solid representing space in both this solid and
   * in the given solids. Neither this solid nor the given solids are modified.
   * @param {Shape3[]} csg - list of Shape3 objects
   * @returns {Shape3} new Shape3 object
   * @example
   * let C = A.intersect(B)
   * @example
   * +-------+
   * |       |
   * |   A   |
   * |    +--+----+   =   +--+
   * +----+--+    |       +--+
   *      |   B   |
   *      |       |
   *      +-------+
   */
const intersection = (...shapes) => {
  if (shapes.length < 2) {
    throw new Error(`please provide at least two operands for a boolean intersection.(${shapes.length} given)`)
  }
  // first we transform all geometries to 'bake in' the transforms
  const shapesWithUpdatedGeoms = shapes.map(shape => {
    const transformedGeom = geom3.transform(shape.transforms, shape.geometry)
    const newShape = clone(shape)
    newShape.geometry = transformedGeom
    return newShape
  })

  const newGeometry = geom3.intersection(shapesWithUpdatedGeoms[0], ...shapesWithUpdatedGeoms)
  const newShape = create() // this means that the new shapes transforms are the default ones !
  newShape.geometry = newGeometry
  return newShape
}

module.exports = intersection

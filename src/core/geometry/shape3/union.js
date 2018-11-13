const geom3 = require('./geom3')
const clone = require('./clone')
const create = require('./create')

const union = (...shapes) => {
  if (shapes.length < 2) {
    throw new Error(`please provide at least two operands for a boolean union.(${shapes.length} given)`)
  }
  // first we transform all geometries to 'bake in' the transforms
  const shapesWithUpdatedGeoms = shapes.map(shape => {
    const transformedGeom = geom3.transform(shape.transforms, shape.geometry)
    const newShape = clone(shape)
    newShape.geometry = transformedGeom
    return newShape
  })

  const newGeometry = geom3.union(shapesWithUpdatedGeoms[0], ...shapesWithUpdatedGeoms)
  const newShape = create() // this means that the new shapes transforms are the default ones !
  newShape.geometry = newGeometry
  return newShape
}

module.exports = union

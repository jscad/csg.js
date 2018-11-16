const geom2 = require('../geometry/geom2')
const clone = require('./clone')
const create = require('./create')

/** create a convex hull of the given shapes
 * @param {Array} objects a list of Shape2 objects to create a hull around
 * @returns {Shape3} new Shape2 object , a hull around the given shapes
 *
 * @example
 * let hulled = hull(rectangle(), ellipse())
 */
const hull = shapes => {
  // first we transform all geometries to 'bake in' the transforms
  const shapesWithUpdatedGeoms = shapes.map(shape => {
    const transformedGeom = geom2.transform(shape.transforms, shape.geometry)
    const newShape = clone(shape)
    newShape.geometry = transformedGeom
    return newShape
  })

  const newGeometry = geom2.hull(shapesWithUpdatedGeoms)
  /* this means that the new shape:
   - has default transforms (reset)
   - does not get any attributes or data from the input shapes
  */
  const newShape = create()
  newShape.geometry = newGeometry
  return newShape
}

module.exports = hull

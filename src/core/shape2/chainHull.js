const geom2 = require('../geometry/geom2')
const clone = require('./clone')
const create = require('./create')

/** create a convex chainHull of the given shapes
 * Originally "Whosa whatsis" suggested "Chain Hull" ,
 * as described at https://plus.google.com/u/0/105535247347788377245/posts/aZGXKFX1ACN
 * essentially hull A+B, B+C, C+D and then union those
 * @param {Array} objects a list of Shape2 objects to create a chainHull around
 * @returns {Shape3} new Shape2 object , a chainHull around the given shapes
 *
 * @example
 * let hulled = chainHull(rectangle(), ellipse())
 */
const chainHull = shapes => {
  // first we transform all geometries to 'bake in' the transforms
  const shapesWithUpdatedGeoms = shapes.map(shape => {
    const transformedGeom = geom2.transform(shape.transforms, shape.geometry)
    const newShape = clone(shape)
    newShape.geometry = transformedGeom
    return newShape
  })

  const newGeometry = geom2.chainHull(shapesWithUpdatedGeoms)
  /* this means that the new shape:
   - has default transforms (reset)
   - does not get any attributes or data from the input shapes
  */
  const newShape = create()
  newShape.geometry = newGeometry
  return newShape
}

module.exports = chainHull

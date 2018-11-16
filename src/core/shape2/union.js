const geom2 = require('../geometry/geom2')

/** // FIXME: double check this algorithm, or even better, swap it out with something not reliant
 * on converting to 3D and back !!!
 * do a boolean union of two (or more) 2d shapes
 * 1 - first apply the transforms of the shapes to their geometries, 'freezing' their transform
 * into the points/vertices (or else) that make up their geometry, see transformGeometry
 * 2 - apply the boolean operation
 * 3 - return a single output 2d shape
 * @param  {} shapes
 * @returns {Shape2} a single 2d shape, with default transforms (identity matrix)
 */
const union = shapes => {
  // apply the transforms of the shapes to their geometries
  let _shapes = shapes.map(shape => {
    // transformGeometry(shape.transforms, shape)
    const newGeom = geom2.transform(shape.transform, shape.geometry)
  })
}

module.exports = union

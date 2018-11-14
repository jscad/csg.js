const geom3 = require('./geom3')

/** returns the triangles of this Shape3
 * @param {Shape3} shape input shape
 * @returns {Polygons} triangulated polygons
 */
const toTriangles = shape => {
  const transformedGeom = geom3.transform(shape.transforms, shape.geometry)
  return geom3.toTriangles(transformedGeom)
}

module.exports = toTriangles

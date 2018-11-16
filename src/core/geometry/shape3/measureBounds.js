const geom3 = require('./geom3')

// FIXME: we can add a bounds field to shape3 & cache the data there , no more hacks
// and this is needed in the future for the webgl side of things as well
/**
 * Returns the AABB (axis aligned bounding box) of this solid,
 * as an array of numerical values [[minX, minY, minZ], [maxY, maxY, maxZ], [width, length, height]]
 * @param  {Shape3} shape
 * @returns {Array[]}
 * @example
 * let bounds = A.getBounds()
 * let minX = bounds[0].x
 */
const measureBounds = shape => {
  const transformedGeom = geom3.transform(shape.transforms, shape.geometry)
  return geom3.measureBounds(transformedGeom)
}

module.exports = measureBounds

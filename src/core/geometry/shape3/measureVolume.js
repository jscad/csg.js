const geom3 = require('./geom3')

/** measure the volume of the given shape
 * @param  {Shape} shape
 * @returns float : the volume
 */
const volume = shape => {
  const transformedGeom = geom3.transform(shape.transforms, shape.geometry)
  return geom3.measureVolume(transformedGeom)
}

module.exports = volume

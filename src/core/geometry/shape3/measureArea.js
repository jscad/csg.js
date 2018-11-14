const geom3 = require('./geom3')

const measureArea = shape => {
  // FIXME: we might be able to get measurements without having to apply transforms ?
  const transformedGeom = geom3.transform(shape.transforms, shape.geometry)
  const geomArea = geom3.measureArea(transformedGeom)
  return geomArea
}

module.exports = measureArea

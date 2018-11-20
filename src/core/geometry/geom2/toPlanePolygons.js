const measureBounds = require('./measureBounds')
const vec2 = require('../../math/vec2')
const fromPolygons = require('../geom3/fromPolygons')

const toPlanePolygons = (geometry, options) => {
  const defaults = {
    flipped: false
  }
  options = Object.assign({}, defaults, options)
  let { flipped } = options
  // reference connector for transformation
  let origin = [0, 0, 0]
  let defaultAxis = [0, 0, 1]
  let defaultNormal = [0, 1, 0]
  let thisConnector = new Connector(origin, defaultAxis, defaultNormal)
  // translated connector per options
  let translation = options.translation || origin
  let axisVector = options.axisVector || defaultAxis
  let normalVector = options.normalVector || defaultNormal
  // will override above if options has toConnector
  let toConnector = options.toConnector ||
            new Connector(translation, axisVector, normalVector)
  // resulting transform
  let m = thisConnector.getTransformationTo(toConnector, false, 0)
  // create plane as a (partial non-closed) CSG in XY plane
  const bounds = measureBounds(geometry)
  const expandedBounds = [
    vec2.subtract(bounds[0], [1, 1]),
    vec2.add(bounds[1], [1, 1])
  ]

  let csgshell = toCSGWall(geometry, -1, 1)
  let csgplane = fromPolygons([new Polygon3([
    new Vertex3D(new Vector3D(bounds[0].x, bounds[0].y, 0)),
    new Vertex3D(new Vector3D(bounds[1].x, bounds[0].y, 0)),
    new Vertex3D(new Vector3D(bounds[1].x, bounds[1].y, 0)),
    new Vertex3D(new Vector3D(bounds[0].x, bounds[1].y, 0))
  ])])
  if (flipped) {
    csgplane = csgplane.invert()
  }
  // intersectSub -> prevent premature retesselate/canonicalize
  csgplane = intersectSub(csgplane, csgshell)
  // only keep the polygons in the z plane:
  let polys = csgplane.polygons.filter(function (polygon) {
    return Math.abs(polygon.plane.normal.z) > 0.99
  })
  // finally, position the plane per passed transformations
  return polys.map(function (poly) {
    return poly.transform(m)
  })
}

module.exports = toPlanePolygons

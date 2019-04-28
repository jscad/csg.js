const plane = require('../../math/plane')

const {geom3, poly3} = require('../../geometry')

const reTesselateCoplanarPolygons = require('./reTesselateCoplanarPolygons')

/*
  After boolean operations all coplanar polygon fragments are joined by a retesselating
  operation. geom3.reTesselate(geom).
  Retesselation is done through a linear sweep over the polygon surface.
  The sweep line passes over the y coordinates of all vertices in the polygon.
  Polygons are split at each sweep line, and the fragments are joined horizontally and vertically into larger polygons
  (making sure that we will end up with convex polygons).
*/
const retessellate = (geometry) => {
  if (!geometry.isCanonicalized) {
    throw new Error('geometry must be canonical, call canonicalize first')
  }

  if (geometry.isRetesselated) {
    return geometry
  }

  const polygonsPerPlane = new Map()
  const polygons = geom3.toPolygons(geometry)
  polygons.forEach((polygon) => {
    let values = polygonsPerPlane.get(polygon.plane)
    if (values === undefined) {
      values = [polygon]
//console.log(poly3.toString(polygon))
//console.log(plane.toString(polygon.plane))
      polygonsPerPlane.set(polygon.plane, values)
    } else {
      values.push(polygon)
    }
  })

  let destpolygons = []
  polygonsPerPlane.forEach((sourcepolygons) => {
//console.log(sourcepolygons.length)
    if (sourcepolygons.length < 2) {
      destpolygons = destpolygons.concat(sourcepolygons)
    } else {
      const retesselayedpolygons = reTesselateCoplanarPolygons(sourcepolygons)
      destpolygons = destpolygons.concat(retesselayedpolygons)
    }
  })

  const result = geom3.create(destpolygons)
  result.isCanonicalized = geometry.isCanonicalized
  result.isRetesselated = true

  polygonsPerPlane.clear()
  return result
}

module.exports = retessellate

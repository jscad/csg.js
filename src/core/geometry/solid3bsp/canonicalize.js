const poly3 = require('../poly3')
const reTessellateCoplanarPolygons = require('./reTessellateCoplanarPolygons')

// Retessellation should not be triggered by transformation, and happen only once after construction.
/*
  After boolean operations all coplanar polygon fragments are joined by a retesselating
  operation. geom3.reTesselate(geom).
  Retesselation is done through a linear sweep over the polygon surface.
  The sweep line passes over the y coordinates of all vertices in the polygon.
  Polygons are split at each sweep line, and the fragments are joined horizontally and vertically into larger polygons
  (making sure that we will end up with convex polygons).
*/
const retessellate = (solid) => {
  const polygonsPerPlane = new Map()

  solid.polygons.forEach((polygon) => {
    let values = polygonsPerPlane.get(polygon.plane)
    if (values === undefined) {
      polygonsPerPlane.set(polygon.plane, [polygon])
    } else {
      values.push(polygon)
    }
  })

  let retessellatedPolygons = []

  polygonsPerPlane.forEach(polygons => {
    if (sourcepolygons.length < 2) {
      retessellatedPolygons = retessellatedPolygons.concat(polygons)
    } else {
      retessellatedPolygons = retessellatedPolygons.concat(reTesselateCoplanarPolygons(polygons))
    }
  })

  polygonsPerPlane.clear()

  return retessellatedPolygons
}

/**
 * Returns a canonicalized version of the input geometry : ie every very close
 * points get deduplicated
 * @returns {Geom3}
 * @example
 * let rawGeometry = someGeometryMakingFunction()
 * let canonicalizedGeom = canonicalize(rawGeometry)
 */
const canonicalize = (solid) => {
  if (solid.isCanonicalized) {
    return solid
  }

  // We need to canonicalize the sub-geometry before retessellating.
  console.log(`QQ/canonicalize/basePolygons: ${JSON.stringify(solid)}`)
  // Note: poly3 transform eagerly canonicalizes its vec3s.
  solid.polygons = solid.basePolygons.map(
      polygon => poly3.transform(solid.transforms, polygon))

  // This will only happen once per geometry, and should only be lost when a new
  // geometry is constructed (e.g., union).
  if (solid.isRetessellated == false) {
    // This will never be invalidated for this particular solid.
    retessellate(solid)
    solid.isRetessellated = true
  }

  // This will be invalidated by transforms.
  solid.isCanonicalized = true
  return solid
}

module.exports = canonicalize

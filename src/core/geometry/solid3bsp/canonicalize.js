const poly3 = require('../poly3')
const reTessellateCoplanarPolygons = require('./reTessellateCoplanarPolygons')

// Joins coplanar polygon fragments to produce an equivalent surface.
//
//  Retessellation is done through a linear sweep over the polygon surface.
//  The sweep line passes over the y coordinates of all vertices in the polygon.
//  Polygons are split at each sweep line, and the fragments are joined horizontally and vertically into larger polygons
//  (making sure that we will end up with convex polygons).
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
    if (polygons.length < 2) {
      retessellatedPolygons = retessellatedPolygons.concat(polygons)
    } else {
      retessellatedPolygons = retessellatedPolygons.concat(reTessellateCoplanarPolygons(polygons))
    }
  })

  polygonsPerPlane.clear()

  return retessellatedPolygons
}

/**
 * Performs an in-place canoncalization of the solid.
 * After canonicalization solid.polygons contains polygons retessellated
 *   polygons with transformed quantized points.
 * @params {solid} solid - the solid to canonicalize.
 * @returns {solid}
 * @example
 * let rawGeometry = someGeometryMakingFunction()
 * let canonicalizedGeom = canonicalize(rawGeometry)
 */
const canonicalize = (solid) => {
  if (solid.isCanonicalized && solid.isRecanonicalized) {
    return solid
  }

  if (!solid.isCanonicalized) {
    // We need to canonicalize the sub-geometry before retessellating.
    // Note: poly3 transform eagerly canonicalizes its vec3s.
    solid.polygons = solid.basePolygons.map(
        polygon => poly3.transform(solid.transforms, polygon))

    // This will be invalidated by transforms.
    solid.isCanonicalized = true
  }

  // This will only happen once per geometry, and should only be lost when a new
  // geometry is constructed (e.g., union).
  if (!solid.isRetessellated) {
    // This will never be invalidated for this particular solid.
    retessellate(solid)
    solid.isRetessellated = true
  }

  return solid
}

module.exports = canonicalize

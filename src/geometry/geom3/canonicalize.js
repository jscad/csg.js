const mat4 = require('../../math/mat4')

const poly3 = require('../poly3')

/**
 * Updates the given geometry by canonicalizing the polygons.
 * Must be called before exposing any polygon data.
 * @param {geom3} geometry - the geometry to canonicalize.
 * @returns {geom3} the given geometry
 * @example
 * let newgeometry = canonicalize(geometry)
 */
const canonicalize = (geometry) => {
  if (geometry.isCanonicalized) return geometry

  // apply transforms to each polygon
  const isMirror = mat4.isMirroring(geometry.transforms)
  geometry.polygons = geometry.polygons.map((polygon) => {
    // TBD if (isMirror) newvertices.reverse()
    return poly3.transform(geometry.transforms, polygon) // .canonicalize()
  })
  geometry.isCanonicalized = true
  return geometry
}

module.exports = canonicalize

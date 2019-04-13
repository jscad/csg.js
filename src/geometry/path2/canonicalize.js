const vec2 = require('../../math/vec2')

/**
 * Produces a canonicalized geometry by canonicalizing the base points.
 * Must be called before exposing any point data.
 * @param {path} geometry - the geometry to canonicalize
 * @returns {path} new geometry
 * @example
 * let newpath = canonicalize(path)
 */
const canonicalize = (geometry) => {
  if (geometry.isCanonicalized) {
    return geometry
  }
  // canonicalize in-place.
  geometry.points = geometry.basePoints.map((point) => vec2.canonicalize(vec2.transform(geometry.transforms, point)))
  geometry.isCanonicalized = true
  return geometry
}

module.exports = canonicalize

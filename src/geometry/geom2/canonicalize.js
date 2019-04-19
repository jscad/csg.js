const mat4 = require('../../math/mat4')
const vec2 = require('../../math/vec2')

/**
 * Produces a canonicalized geometry by canonicalizing the sides.
 * Must be called before exposing any side data.
 * @param {geom2} geometry - the geometry to canonicalize
 * @returns {geom2} the given geometry with transformed points
 * @example
 * let newgeometry = canonicalize(geometry)
 */
const canonicalize = (geometry) => {
  if (mat4.equals(geometry.transforms, mat4.identity())) return geometry

  // apply transforms to each side
  geometry.sides = geometry.sides.map((side) => {
    const p0 = vec2.canonicalize(vec2.transform(geometry.transforms, side[0]))
    const p1 = vec2.canonicalize(vec2.transform(geometry.transforms, side[1]))
    return [p0, p1]
  })
  mat4.identity(geometry.transforms)
  return geometry
}

module.exports = canonicalize

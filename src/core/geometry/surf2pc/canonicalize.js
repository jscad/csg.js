const vec2 = require('../../math/vec2')

/**
 * Only canonical geometries have meaningful content.
 * All operations that access the geometry content (as opposed to dealing
 *   with the geometry as a whole) must first canonicalize the geometry.
 * This geometry does in-place canonicalization.
 * @param {surface} surface - the surface to canonicalize.
 * @returns {surface} the same surface canonicalized.
 */
const canonicalize = (surface) => {
  if (surface.isCanonicalized) {
    return surface
  }
  // Canonicalize in-place, transforming from the base geometry via the
  // accumulated transformation matrix to avoid any incremental error.
  // Note that we repack the point as an ordinary array, for consumption by 
  // the polygon-clipping module.
  surface.polygons =
      surface.basePolygons.map(
          polygon => polygon.map(
              point => [...vec2.canonicalize(
                               vec2.transform(surface.transforms, point))]))
  surface.isCanonicalized = true
  return surface;
}

module.exports = canonicalize

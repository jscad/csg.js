/**
 * Makes a new copy of the geometry that is initially equal to the old.
 * @param {surface} surface - the surface to canonicalize.
 * @returns {surface} a distinct new surface, equal to the old surface.
 */
const clone = (surface) => {
  return {
    basePolygons: surface.basePolygons,
    polygons: surface.polygons,
    transforms: surface.transforms,
    isCanonicalized: surface.isCanonicalized,
    isFlipped: surface.isFlipped
  }
}

module.exports = clone

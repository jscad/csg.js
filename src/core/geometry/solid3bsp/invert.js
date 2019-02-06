const fromPoly3Array = require('./fromPoly3Array')
const poly3 = require('../poly3')

/**
 * Return a new Geom3 geometry with solid and empty space switched.
 * This source geometry is not modified.
 * @returns {Geom3} new Geom3 object
 * @example
 * let B = invert(A)
 */
const invert = (geometry) => {
  const flippedpolygons = geometry.polygons.map((polygon) => {
    return poly3.flip(polygon)
  })
  return fromPoly3Array(flippedpolygons)
}

module.exports = invert

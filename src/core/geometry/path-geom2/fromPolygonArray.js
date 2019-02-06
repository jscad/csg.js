const create = require('./create')
const vec2 = require('../../math/vec2')

const reversed = array => array.reverse()
const unreversed = array => array

/**
 * Construct a surface from a polygon array.
 * A polygon array is an array of polygons.
 * A polygon is an array of points.
 * A point is an array of [x, y] coordinates.
 * @param {boolean} options.flipped - polygons are wound backward if true
 * @returns {surface} the constructed surface
 */
const fromPolygonArray = ({ flipped = false }, polygonArray) => {
  const wind = flipped ? reversed : unreversed
  const surface = create()
  // Assemble the base geometry.
  surface.basePolygons =
      polygonArray.map(polygon =>
                       wind(polygon.map(point =>
                                        vec2.canonicalize(point))))
  surface.isCanonicalized = false
  surface.isFlipped = flipped
  return surface
}

module.exports = fromPolygonArray

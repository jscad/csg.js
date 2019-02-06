const canonicalize = require('./canonicalize')
const create = require('./create')

const reversed = array => array.reverse()
const unreversed = array => array

/**
 * Construct a polygon array from a surface.
 * The polygon array is wound CCW unless the surface has been flipped.
 * @param {object} options - options for creating the polygon array.
 * @returns {polygon array} the constructed polygon array.
 */
const toPolygonArray = (options, surface) => {
  const wind = surface.isFlipped ? reversed : unreversed
  return wind(canonicalize(surface).polygons.map(polygon => wind(polygon.map(point => point))))
}

module.exports = toPolygonArray

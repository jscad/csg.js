const canonicalize = require('./canonicalize')

/** Construct a Geom3 from a list of `Polygon` instances.
 * @param {Polygon[]} polygons - list of polygons
 * @returns {Geom3} new Geom3 object
 */
const toPolygonArray = (options, solid) => canonicalize(solid).polygons

module.exports = toPolygonArray

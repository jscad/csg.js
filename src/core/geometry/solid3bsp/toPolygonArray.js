const canonicalize = require('./canonicalize')
const vec3 = require('../../math/vec3')

/** Construct a Geom3 from a list of `Polygon` instances.
 * @param {Polygon[]} polygons - list of polygons
 * @returns {Geom3} new Geom3 object
 */
const toPolygonArray = (options, solid) => canonicalize(solid).polygons.map(polygon => polygon.vertices.map(vec3.toValues))

module.exports = toPolygonArray

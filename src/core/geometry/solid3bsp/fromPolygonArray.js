const create = require('./create')
const fromPoly3Array = require('./fromPoly3Array')
const poly3 = require('../poly3')

/** Construct a Geom3 from a list of `Polygon` instances.
 * @param {Polygon[]} polygons - list of polygons
 * @returns {Geom3} new Geom3 object
 */
const fromPolygonArray = (options, polygonArray) =>
    fromPoly3Array(polygonArray.map(polygon => poly3.fromPoints(polygon)))

module.exports = fromPolygonArray

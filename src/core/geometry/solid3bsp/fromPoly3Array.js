const create = require('./create')

/** Construct a Geom3 from a list of `Polygon` instances.
 * @param {Polygon[]} polygons - list of polygons
 * @returns {Geom3} new Geom3 object
 */
const fromPoly3Array = (poly3Array) => {
  let solid = create()
  solid.basePolygons = poly3Array
  if (poly3Array.length > 0) {
    solid.isCanonicalized = false
    solid.isRetesselated = false
  }
  return solid
}

module.exports = fromPoly3Array

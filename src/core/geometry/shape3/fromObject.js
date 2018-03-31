/** Reconstruct a CSG solid from an object with identical property names.
 * @param {Object} obj - anonymous object, typically from JSON
 * @returns {CSG} new CSG object
 */
function fromObject (obj) {
  let polygons = obj.polygons.map(function (p) {
    return Polygon3.fromObject(p)
  })
  let csg = fromPolygons(polygons)
  csg.isCanonicalized = obj.isCanonicalized
  csg.isRetesselated = obj.isRetesselated
  return csg
}
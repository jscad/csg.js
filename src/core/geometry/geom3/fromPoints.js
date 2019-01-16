const create = require('./create')

const poly3 = require('../poly3')

/**
 * Create a new 3D geometry from a list of polygons represented as points.
 *
 * @param {polygon[]} polygons - list of polygons, where each polygon is a list of points
 * @returns {geom3} a new 3D geometry
 */
const fromPoints = function (polygons) {
  let geometry = create()

  geometry.polygons = polygons.map((points) => {
    return poly3.fromPoints(points)
  })
  geometry.isCanonicalized = false
  geometry.isRetesselated = false

  return geometry
}

module.exports = fromPoints

const poly3 = require('../poly3')

const create = require('./create')

/**
 * Construct a new 3D geometry from a list of points.
 * The list of points should contain sub-arrays, each defining a single polygon of points.
 * In addition, the points should follow the right-hand rule for rotation in order to
 * define an external facing polygon. The opposite is true for internal facing polygon.
 * @param {Array[[point],...]} listofpoints - (nested) list of points in 3D space
 * @returns {geom2} a new geometry
 */
const fromPoints = function (listofpoints) {
  if (!Array.isArray(listofpoints)) {
    throw new Error('the given points must be an array')
  }

  let polygons = listofpoints.map((points, i) => {
    let polygon = poly3.fromPoints(points)
    if (polygon.length < 3) throw new Error('invalid list of points, polygon at '+i)
    //if (polygon.checkIfConvex() === false) throw new Error('invalid list of points, invalid polygon at '+i)
    return polygon
  })
  let result = create(polygons)
  return result
}

module.exports = fromPoints

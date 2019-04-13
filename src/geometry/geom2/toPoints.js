const canonicalize = require('./canonicalize')

/**
 * Produces an array of points from the given geometry.
 * NOTE: The points returned do NOT define an order. Use toOutlines() for ordered points. 
 * @param {path} path - the path
 * @returns {Array} an array of points, each point contains an array of two numbers
 * @example
 * let sharedpoints = toPoints(geometry)
 */
const toPoints = function (geometry) {
  let sides = canonicalize(geometry).sides
  let points = sides.map((side) => {
    return side[0]
  })
  // due to the logic of fromPoints()
  // move the first point to the last
  if (points.length > 0) {
    points.push(points.shift())
  }
  return points
}

module.exports = toPoints

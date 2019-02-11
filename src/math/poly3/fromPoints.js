const map = require('./map')
const vec3 = require('../vec3')

/**
 * Create a poly3 from the given points.
 *
 * @param {Array[]} points - list of points
 * @param {plane} [planeof] - plane of the polygon
 *
 * @example
 * const points = [
 *   [0,  0, 0],
 *   [0, 10, 0],
 *   [0, 10, 10]
 * ]
 * const polygon = createFromPoints(points)
 */
const fromPoints = (points, planeof) => {
  const out = map(points, vec3.clone, planeof)
  return out
}

module.exports = fromPoints

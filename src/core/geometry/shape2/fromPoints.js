const fromSides = require('./fromSides')
const {area} = require('./utils/cagMeasurements')
const canonicalize = require('./utils/canonicalize')
const {areaEPS} = require('./constants')
const {isSelfIntersecting} = require('./utils/cagValidation')
const Side = require('./math/Side')
const Vector2 = require('./math/Vector2')
const Vertex2 = require('./math/Vertex2')

/** Construct a CAG from a list of points (a polygon).
 * The rotation direction of the points is not relevant.
 * The points can define a convex or a concave polygon.
 * The polygon must not self intersect.
 * @param {points[]} points - list of points in 2D space
 * @returns {CAG} new CAG object
 */
const fromPoints = function (points) {
  let numpoints = points.length
  if (numpoints < 3) throw new Error('CAG shape needs at least 3 points')
  let sides = []
  let prevpoint = new Vector2(points[numpoints - 1])
  let prevvertex = new Vertex2(prevpoint)
  points.map(function (p) {
    let point = new Vector2(p)
    let vertex = new Vertex2(point)
    let side = new Side(prevvertex, vertex)
    sides.push(side)
    prevvertex = vertex
  })
  let result = fromSides(sides)
  if (isSelfIntersecting(result)) {
    throw new Error('Polygon is self intersecting!')
  }
  let resultArea = area(result)
  if (Math.abs(resultArea) < areaEPS) {
    throw new Error('Degenerate polygon!')
  }
  if (resultArea < 0) {
    result = result.flipped()
  }
  result = canonicalize(result)
  return result
}

module.exports = fromPoints

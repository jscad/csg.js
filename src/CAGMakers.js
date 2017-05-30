const CAG = require('./CAG')
const Side = require('./math/Side')
const Vector2D = require('./math/Vector2')
const Vertex = require('./math/Vertex2')
const {areaEPS} = require('./constants')

/** Reconstruct a CAG from an object with identical property names.
 * @param {Object} obj - anonymous object, typically from JSON
 * @returns {CAG} new CAG object
 */
const fromObject = function (obj) {
  let sides = obj.sides.map(function (s) {
    return Side.fromObject(s)
  })
  let cag = fromSides(sides)
  cag.isCanonicalized = obj.isCanonicalized
  return cag
}

/** Construct a CAG from a list of `Side` instances.
 * @param {Side[]} sides - list of sides
 * @returns {CAG} new CAG object
 */
const fromSides = function (sides) {
  let cag = new CAG()
  cag.sides = sides
  return cag
}

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
  let prevpoint = new Vector2D(points[numpoints - 1])
  let prevvertex = new Vertex(prevpoint)
  points.map(function (p) {
    let point = new Vector2D(p)
    let vertex = new Vertex(point)
    let side = new Side(prevvertex, vertex)
    sides.push(side)
    prevvertex = vertex
  })
  let result = fromSides(sides)
  if (result.isSelfIntersecting()) {
    throw new Error('Polygon is self intersecting!')
  }
  let area = result.area()
  if (Math.abs(area) < areaEPS) {
    throw new Error('Degenerate polygon!')
  }
  if (area < 0) {
    result = result.flipped()
  }
  result = result.canonicalized()
  return result
}

/** Construct a CAG from a list of points (a polygon).
 * Like fromPoints() but does not check if the result is a valid polygon.
 * The points MUST rotate counter clockwise.
 * The points can define a convex or a concave polygon.
 * The polygon must not self intersect.
 * @param {points[]} points - list of points in 2D space
 * @returns {CAG} new CAG object
 */
const fromPointsNoCheck = function (points) {
  let sides = []
  let prevpoint = new Vector2D(points[points.length - 1])
  let prevvertex = new Vertex(prevpoint)
  points.map(function (p) {
    let point = new Vector2D(p)
    let vertex = new Vertex(point)
    let side = new Side(prevvertex, vertex)
    sides.push(side)
    prevvertex = vertex
  })
  return fromSides(sides)
}

// Converts a CSG to a  The CSG must consist of polygons with only z coordinates +1 and -1
// as constructed by _toCSGWall(-1, 1). This is so we can use the 3D union(), intersect() etc
const fromFakeCSG = function (csg) {
  let sides = csg.polygons.map(function (p) {
    return Side._fromFakePolygon(p)
  })
        .filter(function (s) {
          return s !== null
        })
  return fromSides(sides)
}

module.exports = {
  fromObject,
  fromSides,
  fromPoints,
  fromPointsNoCheck,
  fromFakeCSG
}

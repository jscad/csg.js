const {EPS} = require('../constants')
const {solve2Linear} = require('../utils')

// see if the line between p0start and p0end intersects with the line between p1start and p1end
// returns true if the lines strictly intersect, the end points are not counted!
const linesIntersect = function (p0start, p0end, p1start, p1end) {
  if (p0end.equals(p1start) || p1end.equals(p0start)) {
    let d = p1end.minus(p1start).unit().plus(p0end.minus(p0start).unit()).length()
    if (d < EPS) {
      return true
    }
  } else {
    let d0 = p0end.minus(p0start)
    let d1 = p1end.minus(p1start)
    // FIXME These epsilons need review and testing
    if (Math.abs(d0.cross(d1)) < 1e-9) return false // lines are parallel
    let alphas = solve2Linear(-d0.x, d1.x, -d0.y, d1.y, p0start.x - p1start.x, p0start.y - p1start.y)
    if ((alphas[0] > 1e-6) && (alphas[0] < 0.999999) && (alphas[1] > 1e-5) && (alphas[1] < 0.999999)) return true
    // if( (alphas[0] >= 0) && (alphas[0] <= 1) && (alphas[1] >= 0) && (alphas[1] <= 1) ) return true;
  }
  return false
}

/** Finds the intersection of two circles.
 * https://jsfiddle.net/SalixAlba/54Fb2/
 * @param {Float} x1 - first circle center point
 * @param {Float} y1 - first circle center point
 * @param {Float} d1 - first circle center point
 * @param {Float} x2 - second circle center point
 * @param {Float} y2 - second circle center point
 * @param {Float} d2 - second circle center point
 * @returns {Array} [x3, y3, x4, y4]
 */
 function circlesIntersection (x1, y1, d1, x2, y2, d2) {
  let c = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
  let d = (d2 * d2 + c * c - d1 * d1) / (2 * c)
  let h = Math.sqrt(d2 * d2 - d * d)
  let x3 = (x2 - x1) * d / c - (y2 - y1) * h / c + x1
  let y3 = (y2 - y1) * d / c + (x2 - x1) * h / c + y1
  let x4 = (x2 - x1) * d / c + (y2 - y1) * h / c + x1
  let y4 = (y2 - y1) * d / c - (x2 - x1) * h / c + y1
  return [x3, y3, x4, y4]
}

module.exports = {
  linesIntersect,
  circlesIntersection
}

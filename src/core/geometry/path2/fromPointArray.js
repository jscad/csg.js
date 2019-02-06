const create = require('./create')

/**
 * Create a path2 from a point array.
 * The point array is an array of points, where a point is an array of two
 *   numbers.
 * @param {PointArray} pointArray - array of points to create the path from.
 * @param {boolean} options.closed - if the path should be open or closed.
 * @example:
 * path2.fromPointArray({ closed: true }, [[10,10], [-10,10]])
 */
const fromPointArray = ({ closed = false }, pointArray) => {
  let path = create()
  if (pointArray.length > 0) {
    path.isCanonicalized = false // Can't expect these to be canonical points.
  }
  path.isClosed = closed
  path.points = pointArray.slice() // Can't expect caller not to modify this.
  return path
}

module.exports = fromPointArray

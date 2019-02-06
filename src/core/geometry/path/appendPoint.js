const create = require('./create')

/**
 * Appends zero or more points to an open path.
 * @param {Object} options - options to describe the path to point.
 * @param {vec2} point - the waypoint to append to the path.
 * @param {path2} path - the path appended to
 * @returns {path2}
 * @example
 * appendPoint({}, vec2.fromValues(1, 1), path.fromPointArray([[0, 0]]))
 * (should produce [[0, 0], [1, 1]])
 */
const appendPoint = (options, point, path) => {
  if (path.isClosed) {
    throw new Error('Cannot append to closed path')
  }
  const created = create()
  created.isClosed = false
  // Perhaps we should eagerly canonicalize the new points if the source is
  // canonical.
  created.isCanonicalized = false
  created.points = path.points.concat([point])
  return created
}

module.exports = appendPoint

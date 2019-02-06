const create = require('./create')
const normalizePoint = require('./normalizePoint')

/**
 * Appends zero or more points to an open path.
 * @param {Object} options - options to describe the path to point.
 * @param {vec2|vec3} point - the waypoint to append to the path.
 * @param {path} path - the path appended to
 * @returns {path}
 * @example
 * appendPoint({}, vec3.fromValues(1, 1, 0), path.fromPointArray([[0, 0, 0]]))
 * (should produce [[0, 0, 0], [1, 1, 0]])
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
  created.points = path.points.concat([normalizePoint(point)])
  return created
}

module.exports = appendPoint

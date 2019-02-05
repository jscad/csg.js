const create = require('./create')

/**
 * Appends zero or more points to an open path.
 * @param {path2} path - the path appended to
 * @param {Array<vec2>} points - the points to append.
 * @returns {path2}
 * @example
 * appendPoint(path, [1, 0], [2, 0])
 */
const appendPoint = (path, ...points) => {
  if (path.isClosed) {
    throw new Error('Cannot append to closed path')
  }
  const created = create()
  created.isClosed = false
  // Perhaps we should eagerly canonicalize the new points if the source is
  // canonical.
  created.isCanonical = false
  created.points = path.points.concat(points)
  return created
}

module.exports = appendPoint

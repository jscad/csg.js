const canonicalize = require('./canonicalize')

/**
 * Produces a new array containing the path's point data.
 * This will be an array of canonicalized vec2.
 * The points returned should not be modified as they may be shared between
 *   callers.
 * @param {path2} path - the path to canonicalize.
 * @returns {Array<vec2>} - the array of canonicalized vec2.
 * @example
 * toPoints(path)
 */
const toPoints = (geometry) => {
  return canonicalize(geometry).points
}

module.exports = toPoints

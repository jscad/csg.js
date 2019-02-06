const canonicalize = require('./canonicalize')

/**
 * Produces a new array containing the path's point data.
 * This will be an array of canonicalized vec3.
 * @param {path2} path - the path to canonicalize.
 * @returns {Array<vec3>} - the array of canonicalized vec3.
 * @example
 * toPointArray(path)
 */
const toPointArray = (options, path) => {
  // Make a copy, since the caller might modify the point array.
  return canonicalize(path).points.slice()
}

module.exports = toPointArray
